import React, { useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';
 
function GraphView({nodes, edges, onNodesChange, onEdgesChange, onConnect}) {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}>
        <Background variant="dots" gap={12} size={1.25} />
      </ReactFlow>
    </div>
  )
}

export default GraphView;
