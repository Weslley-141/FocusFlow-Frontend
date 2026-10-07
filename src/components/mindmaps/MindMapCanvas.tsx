import { useCallback, useEffect, useMemo, useState } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  ConnectionMode,
  Controls,
  MarkerType,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import type { Connection, Edge, Node } from 'reactflow';
import 'reactflow/dist/style.css';
import type { MindMapNode } from '../../types';
import { getNodeColor } from '../../utils/mindmapColors';
import type { NodeColor } from '../../utils/mindmapColors';
import { Modal } from '../ui';
import ColorPicker from './ColorPicker';
import CustomNode, { connectionState } from './CustomNode';
import type { CustomNodeData } from './CustomNode';
import NodeContextMenu from './NodeContextMenu';

interface MindMapCanvasProps {
  nodes: MindMapNode[];
  onNodeClick?: (nodeId: number) => void;
  onNodesPositionChange?: (nodeId: number, x: number, y: number) => void;
  /** child = nó de destino; parent = nó de origem da conexão. */
  onConnect?: (childId: number, parentId: number, sourceHandle?: string, targetHandle?: string) => void;
  onNodeEdit?: (nodeId: number, newContent: string) => void;
  onNodeColorChange?: (nodeId: number, color: NodeColor) => void;
  onNodeDelete?: (nodeId: number) => void;
  /** Recebe o id do nó filho da conexão a remover. */
  onEdgeDelete?: (childId: number) => void;
}

interface MenuState {
  x: number;
  y: number;
  nodeId?: number;
  edgeId?: string;
}

const nodeTypes = { custom: CustomNode };

export default function MindMapCanvas({
  nodes,
  onNodeClick,
  onNodesPositionChange,
  onConnect,
  onNodeEdit,
  onNodeColorChange,
  onNodeDelete,
  onEdgeDelete,
}: MindMapCanvasProps) {
  const [menu, setMenu] = useState<MenuState | null>(null);
  const [colorOpen, setColorOpen] = useState(false);
  const [colorNodeId, setColorNodeId] = useState<number | null>(null);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [selectedEdges, setSelectedEdges] = useState<string[]>([]);

  const flowNodes = useMemo<Node<CustomNodeData>[]>(
    () =>
      nodes.map((n) => {
        const palette = getNodeColor(n.backgroundColor);
        return {
          id: String(n.id),
          position: { x: n.positionX, y: n.positionY },
          type: 'custom',
          data: {
            label: n.content,
            backgroundColor: n.backgroundColor && n.backgroundColor !== '#ffffff' ? n.backgroundColor : palette.bg,
            textColor: n.backgroundColor && n.backgroundColor !== '#ffffff' ? n.textColor || palette.text : palette.text,
            borderColor: palette.border,
            onEdit: (content: string) => onNodeEdit?.(n.id, content),
            onContextMenu: (e) => setMenu({ x: e.clientX, y: e.clientY, nodeId: n.id }),
          },
        };
      }),
    [nodes, onNodeEdit],
  );

  // O id da aresta é "<pai>-<filho>"; guardamos o filho por aresta para removê-la depois.
  const flowEdges = useMemo<Edge[]>(
    () =>
      nodes
        .filter((n) => n.parentId)
        .map((n) => ({
          id: `${n.parentId}-${n.id}`,
          source: String(n.parentId),
          target: String(n.id),
          sourceHandle: n.sourceHandle ?? null,
          targetHandle: n.targetHandle ?? null,
          type: 'smoothstep',
          animated: false,
          style: { stroke: '#94A3B8', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#94A3B8' },
        })),
    [nodes],
  );

  const [rfNodes, setRfNodes, onNodesChange] = useNodesState<CustomNodeData>(flowNodes);
  const [rfEdges, setRfEdges, onEdgesChange] = useEdgesState(flowEdges);

  useEffect(() => setRfNodes(flowNodes), [flowNodes, setRfNodes]);
  useEffect(() => setRfEdges(flowEdges), [flowEdges, setRfEdges]);

  const handleDragStop = useCallback(
    (_: unknown, node: Node) => onNodesPositionChange?.(Number(node.id), Math.round(node.position.x), Math.round(node.position.y)),
    [onNodesPositionChange],
  );

  const handleConnect = useCallback(
    (conn: Connection) => {
      if (conn.source && conn.target && onConnect) {
        const sourceHandle = connectionState.sourceHandle;
        const targetHandle = conn.targetHandle ?? undefined;
        connectionState.sourceHandle = undefined;
        onConnect(Number(conn.target), Number(conn.source), sourceHandle, targetHandle);
      }
    },
    [onConnect],
  );

  const handleSelection = useCallback(({ nodes: ns, edges: es }: { nodes: Node[]; edges: Edge[] }) => {
    setSelectedNodes(ns.map((n) => n.id));
    setSelectedEdges(es.map((e) => e.id));
  }, []);

  const edgeChildId = (edgeId: string) => Number(edgeId.split('-')[1]);

  // Delete/Backspace remove os nós ou conexões selecionados (com confirmação).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Delete' && e.key !== 'Backspace') return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
      if (selectedNodes.length > 0 && onNodeDelete) {
        selectedNodes.forEach((id) => {
          if (window.confirm('Tem certeza que deseja deletar este nó?')) onNodeDelete(Number(id));
        });
      }
      if (selectedEdges.length > 0 && onEdgeDelete) {
        selectedEdges.forEach((id) => {
          if (window.confirm('Tem certeza que deseja remover esta conexão?')) onEdgeDelete(edgeChildId(id));
        });
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [selectedNodes, selectedEdges, onNodeDelete, onEdgeDelete]);

  const handleMenuDelete = () => {
    if (menu?.nodeId && onNodeDelete) {
      if (window.confirm('Tem certeza que deseja deletar este nó?')) onNodeDelete(menu.nodeId);
    } else if (menu?.edgeId && onEdgeDelete) {
      if (window.confirm('Tem certeza que deseja remover esta conexão?')) onEdgeDelete(edgeChildId(menu.edgeId));
    }
    setMenu(null);
  };

  const handleMenuColor = () => {
    if (menu?.nodeId) {
      setColorNodeId(menu.nodeId);
      setColorOpen(true);
    }
    setMenu(null);
  };

  const handleColorSelect = (color: NodeColor) => {
    if (colorNodeId !== null) onNodeColorChange?.(colorNodeId, color);
    setColorOpen(false);
    setColorNodeId(null);
  };

  if (nodes.length === 0) {
    return (
      <div className="w-full h-[600px] bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-2">🧠 Mapa Mental Vazio</p>
          <p className="text-gray-400 text-sm">Adicione o primeiro nó para começar</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full h-[600px] bg-gray-50 rounded-lg border">
        <ReactFlow
          nodes={rfNodes}
          edges={rfEdges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={(_, node) => onNodeClick?.(Number(node.id))}
          onNodeDragStop={handleDragStop}
          onConnect={handleConnect}
          onSelectionChange={handleSelection}
          onPaneContextMenu={(e) => {
            e.preventDefault();
            setMenu(null);
          }}
          onEdgeContextMenu={(e, edge) => {
            e.preventDefault();
            setMenu({ x: e.clientX, y: e.clientY, edgeId: edge.id });
          }}
          connectionMode={ConnectionMode.Loose}
          deleteKeyCode={null}
          fitView
          attributionPosition="bottom-left"
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
          <Controls />
        </ReactFlow>
      </div>

      {menu && (
        <NodeContextMenu
          x={menu.x}
          y={menu.y}
          onClose={() => setMenu(null)}
          onDelete={handleMenuDelete}
          onChangeColor={menu.nodeId ? handleMenuColor : undefined}
          showColorOption={!!menu.nodeId}
        />
      )}

      <Modal
        isOpen={colorOpen}
        onClose={() => {
          setColorOpen(false);
          setColorNodeId(null);
        }}
        title="Escolher Cor do Nó"
        size="sm"
      >
        <ColorPicker
          currentColor={nodes.find((n) => n.id === colorNodeId)?.backgroundColor || '#3B82F6'}
          onColorSelect={handleColorSelect}
        />
      </Modal>
    </>
  );
}
