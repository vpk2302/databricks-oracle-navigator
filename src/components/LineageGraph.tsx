import { useCallback, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { mockObjects, mockLineage, ObjectType } from '@/lib/mockData';

interface LineageGraphProps {
  selectedObjectId?: string;
  onNodeClick?: (nodeId: string) => void;
}

const objectTypeColors: Record<ObjectType, string> = {
  package: 'hsl(var(--node-package))',
  procedure: 'hsl(var(--node-procedure))',
  function: 'hsl(var(--node-function))',
  table: 'hsl(var(--node-table))',
  view: 'hsl(var(--node-view))',
  trigger: 'hsl(var(--node-trigger))',
  file: 'hsl(var(--node-file))',
};

export const LineageGraph = ({ selectedObjectId, onNodeClick }: LineageGraphProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const buildGraph = useCallback(() => {
    // If an object is selected, show its lineage
    const relevantObjects = selectedObjectId
      ? getLineageObjects(selectedObjectId)
      : mockObjects.slice(0, 8); // Show subset by default

    const graphNodes: Node[] = relevantObjects.map((obj, index) => {
      const isSelected = obj.id === selectedObjectId;
      const color = objectTypeColors[obj.type];
      
      return {
        id: obj.id,
        data: { 
          label: (
            <div className="px-3 py-2">
              <div className="font-semibold text-sm">{obj.name}</div>
              <div className="text-xs opacity-75 capitalize">{obj.type}</div>
            </div>
          )
        },
        position: { x: (index % 3) * 250, y: Math.floor(index / 3) * 150 },
        style: {
          background: isSelected ? color : `${color}20`,
          color: 'hsl(var(--foreground))',
          border: `2px solid ${color}`,
          borderRadius: '8px',
          fontWeight: isSelected ? 'bold' : 'normal',
          boxShadow: isSelected ? `0 0 20px ${color}60` : 'none',
        },
      };
    });

    const graphEdges: Edge[] = mockLineage
      .filter(edge => 
        relevantObjects.some(obj => obj.id === edge.source) &&
        relevantObjects.some(obj => obj.id === edge.target)
      )
      .map(edge => ({
        id: `${edge.source}-${edge.target}`,
        source: edge.source,
        target: edge.target,
        type: 'smoothstep',
        animated: true,
        label: edge.type,
        labelStyle: { 
          fill: 'hsl(var(--muted-foreground))', 
          fontSize: 10,
          fontWeight: 500,
        },
        labelBgStyle: { 
          fill: 'hsl(var(--background))',
          fillOpacity: 0.8,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: 'hsl(var(--primary))',
        },
        style: {
          stroke: 'hsl(var(--primary))',
          strokeWidth: 2,
        },
      }));

    setNodes(graphNodes);
    setEdges(graphEdges);
  }, [selectedObjectId, setNodes, setEdges]);

  const getLineageObjects = (objectId: string): typeof mockObjects => {
    const object = mockObjects.find(obj => obj.id === objectId);
    if (!object) return [];

    const upstream = new Set<string>([objectId]);
    const downstream = new Set<string>([objectId]);

    // Get upstream dependencies
    const findUpstream = (id: string) => {
      mockLineage
        .filter(edge => edge.target === id)
        .forEach(edge => {
          if (!upstream.has(edge.source)) {
            upstream.add(edge.source);
            findUpstream(edge.source);
          }
        });
    };

    // Get downstream dependencies
    const findDownstream = (id: string) => {
      mockLineage
        .filter(edge => edge.source === id)
        .forEach(edge => {
          if (!downstream.has(edge.target)) {
            downstream.add(edge.target);
            findDownstream(edge.target);
          }
        });
    };

    findUpstream(objectId);
    findDownstream(objectId);

    const allRelated = new Set([...upstream, ...downstream]);
    return mockObjects.filter(obj => allRelated.has(obj.id));
  };

  useEffect(() => {
    buildGraph();
  }, [buildGraph]);

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      onNodeClick?.(node.id);
    },
    [onNodeClick]
  );

  return (
    <div className="h-full w-full bg-background">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        fitView
        attributionPosition="bottom-left"
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
        <Controls className="bg-card border border-border rounded-lg" />
      </ReactFlow>
    </div>
  );
};
