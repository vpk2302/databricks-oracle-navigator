import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { mockObjects } from "@/lib/mockData";
import { Highlight, themes } from 'prism-react-renderer';

interface ObjectDetailsPanelProps {
  objectId?: string;
}

export const ObjectDetailsPanel = ({ objectId }: ObjectDetailsPanelProps) => {
  const object = mockObjects.find(obj => obj.id === objectId);

  if (!object) {
    return (
      <div className="flex h-full items-center justify-center border-l border-border bg-card p-8 text-center">
        <div>
          <p className="text-muted-foreground">
            Select an object to view details
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col border-l border-border bg-card">
      <div className="border-b border-border p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg">{object.name}</h3>
            <p className="text-sm text-muted-foreground">{object.schema}</p>
          </div>
          <Badge className="capitalize">{object.type}</Badge>
        </div>
        {object.description && (
          <p className="mt-2 text-sm text-muted-foreground">
            {object.description}
          </p>
        )}
      </div>

      <Tabs defaultValue="code" className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent px-4">
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
          <TabsTrigger value="migration">Migration</TabsTrigger>
        </TabsList>

        <TabsContent value="code" className="flex-1 mt-0 p-0">
          <ScrollArea className="h-full">
            <div className="p-4">
              {object.code ? (
                <Highlight
                  theme={themes.vsDark}
                  code={object.code}
                  language="sql"
                >
                  {({ className, style, tokens, getLineProps, getTokenProps }) => (
                    <pre className={`${className} rounded-lg p-4 text-sm`} style={style}>
                      {tokens.map((line, i) => (
                        <div key={i} {...getLineProps({ line })}>
                          <span className="mr-4 inline-block w-8 text-right opacity-50">
                            {i + 1}
                          </span>
                          {line.map((token, key) => (
                            <span key={key} {...getTokenProps({ token })} />
                          ))}
                        </div>
                      ))}
                    </pre>
                  )}
                </Highlight>
              ) : (
                <p className="text-sm text-muted-foreground">No code available</p>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="summary" className="flex-1 mt-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Object Type</h4>
                <p className="text-sm text-muted-foreground capitalize">{object.type}</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Schema</h4>
                <p className="text-sm text-muted-foreground">{object.schema}</p>
              </div>
              
              {object.description && (
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{object.description}</p>
                </div>
              )}

              <div>
                <h4 className="font-semibold mb-2">AI Interpretation</h4>
                <p className="text-sm text-muted-foreground">
                  This {object.type} appears to handle{' '}
                  {object.type === 'package' && 'batch data processing operations'}
                  {object.type === 'procedure' && 'data validation and business rules'}
                  {object.type === 'function' && 'calculations and data transformations'}
                  {object.type === 'table' && 'persistent data storage'}
                  {object.type === 'view' && 'aggregated data queries'}
                  {object.type === 'trigger' && 'automated data change tracking'}
                  {object.type === 'file' && 'reference data management'}
                  . It is a key component in the data pipeline.
                </p>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="dependencies" className="flex-1 mt-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-3">
              <div>
                <h4 className="font-semibold mb-3">Direct Dependencies</h4>
                {object.dependencies && object.dependencies.length > 0 ? (
                  <div className="space-y-2">
                    {object.dependencies.map(dep => (
                      <div
                        key={dep}
                        className="flex items-center gap-2 rounded-lg border border-border p-2 text-sm"
                      >
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <span>{dep}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No dependencies</p>
                )}
              </div>

              <div>
                <h4 className="font-semibold mb-3">Used By</h4>
                <p className="text-sm text-muted-foreground">
                  Impact analysis will show which objects depend on this one
                </p>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="migration" className="flex-1 mt-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Suggested Approach</h4>
                <div className="rounded-lg bg-muted p-3 text-sm">
                  {object.type === 'package' && (
                    <p>Convert to Databricks notebook with Python functions. Consider using Delta Live Tables for data quality.</p>
                  )}
                  {object.type === 'procedure' && (
                    <p>Migrate to Python function in Databricks. Use Delta Lake for transactional operations.</p>
                  )}
                  {object.type === 'function' && (
                    <p>Convert to Python UDF or Spark SQL function. Consider performance optimization.</p>
                  )}
                  {object.type === 'table' && (
                    <p>Create as Delta table with appropriate partitioning strategy. Maintain schema compatibility.</p>
                  )}
                  {object.type === 'view' && (
                    <p>Recreate as Databricks SQL view or materialized view for performance.</p>
                  )}
                  {object.type === 'trigger' && (
                    <p>Implement using Delta Live Tables expectations or Databricks workflows.</p>
                  )}
                  {object.type === 'file' && (
                    <p>Load into Delta table or maintain in cloud storage with Unity Catalog.</p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Complexity</h4>
                <Badge variant="outline">Medium</Badge>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Considerations</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Review error handling patterns</li>
                  <li>Test with sample data</li>
                  <li>Validate business logic preservation</li>
                  <li>Consider performance implications</li>
                </ul>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};
