import { useState } from "react";
import { ChevronRight, ChevronDown, Search, Package, FileCode, Database, Eye, Zap, File } from "lucide-react";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";
import { mockObjects, ObjectType } from "@/lib/mockData";

interface ObjectExplorerProps {
  onObjectSelect: (objectId: string) => void;
  selectedObjectId?: string;
}

const objectTypeIcons: Record<ObjectType, React.ComponentType<{ className?: string }>> = {
  package: Package,
  procedure: FileCode,
  function: Zap,
  table: Database,
  view: Eye,
  trigger: Zap,
  file: File,
};

export const ObjectExplorer = ({ onObjectSelect, selectedObjectId }: ObjectExplorerProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSchemas, setExpandedSchemas] = useState<Set<string>>(new Set(['apexstg']));
  const [expandedTypes, setExpandedTypes] = useState<Set<string>>(new Set());

  const schemas = Array.from(new Set(mockObjects.map(obj => obj.schema)));
  
  const filteredObjects = mockObjects.filter(obj =>
    obj.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSchema = (schema: string) => {
    const newExpanded = new Set(expandedSchemas);
    if (newExpanded.has(schema)) {
      newExpanded.delete(schema);
    } else {
      newExpanded.add(schema);
    }
    setExpandedSchemas(newExpanded);
  };

  const toggleType = (key: string) => {
    const newExpanded = new Set(expandedTypes);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedTypes(newExpanded);
  };

  return (
    <div className="flex h-full flex-col border-r border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border p-4">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search objects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {schemas.map(schema => {
            const schemaObjects = filteredObjects.filter(obj => obj.schema === schema);
            if (schemaObjects.length === 0) return null;

            const isSchemaExpanded = expandedSchemas.has(schema);
            const typeGroups = schemaObjects.reduce((acc, obj) => {
              if (!acc[obj.type]) acc[obj.type] = [];
              acc[obj.type].push(obj);
              return acc;
            }, {} as Record<ObjectType, typeof mockObjects>);

            return (
              <div key={schema} className="mb-2">
                <button
                  onClick={() => toggleSchema(schema)}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium hover:bg-accent"
                >
                  {isSchemaExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  <Database className="h-4 w-4 text-primary" />
                  <span>{schema}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {schemaObjects.length}
                  </span>
                </button>

                {isSchemaExpanded && (
                  <div className="ml-4 mt-1 space-y-1">
                    {Object.entries(typeGroups).map(([type, objects]) => {
                      const typeKey = `${schema}-${type}`;
                      const isTypeExpanded = expandedTypes.has(typeKey);
                      const Icon = objectTypeIcons[type as ObjectType];

                      return (
                        <div key={typeKey}>
                          <button
                            onClick={() => toggleType(typeKey)}
                            className="flex w-full items-center gap-2 rounded-lg px-2 py-1 text-sm hover:bg-accent"
                          >
                            {isTypeExpanded ? (
                              <ChevronDown className="h-3 w-3" />
                            ) : (
                              <ChevronRight className="h-3 w-3" />
                            )}
                            <Icon className="h-3 w-3" />
                            <span className="capitalize">{type}s</span>
                            <span className="ml-auto text-xs text-muted-foreground">
                              {objects.length}
                            </span>
                          </button>

                          {isTypeExpanded && (
                            <div className="ml-4 mt-1 space-y-0.5">
                              {objects.map(obj => (
                                <button
                                  key={obj.id}
                                  onClick={() => onObjectSelect(obj.id)}
                                  className={cn(
                                    "flex w-full items-center gap-2 rounded-lg px-2 py-1 text-sm transition-colors hover:bg-accent",
                                    selectedObjectId === obj.id && "bg-primary/10 text-primary font-medium"
                                  )}
                                >
                                  <div className="h-2 w-2 rounded-full bg-current opacity-50" />
                                  <span className="truncate">{obj.name}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
