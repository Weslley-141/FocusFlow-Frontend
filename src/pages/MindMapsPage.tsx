import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Network, Plus } from 'lucide-react';
import { mindmapService } from '../services/mindmapService';
import { subjectService } from '../services/subjectService';
import { topicService } from '../services/topicService';
import { getErrorMessage } from '../utils/error';
import type { MindMap, MindMapInput, MindMapNode } from '../types';
import type { NodeColor } from '../utils/mindmapColors';
import { Alert, Button, Card, Spinner } from '../components/ui';
import MindMapCanvas from '../components/mindmaps/MindMapCanvas';
import MindMapCard from '../components/mindmaps/MindMapCard';
import MindMapFormModal from '../components/mindmaps/MindMapFormModal';
import type { TopicWithSubject } from '../components/mindmaps/MindMapFormModal';
import NodeFormModal from '../components/mindmaps/NodeFormModal';

export default function MindMapsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mapParam = searchParams.get('map');

  const [maps, setMaps] = useState<MindMap[]>([]);
  const [topics, setTopics] = useState<TopicWithSubject[]>([]);
  const [selected, setSelected] = useState<MindMap | null>(null);
  const [nodes, setNodes] = useState<MindMapNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [nodeModalOpen, setNodeModalOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<MindMapNode | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const [list, subjects] = await Promise.all([mindmapService.getAll(), subjectService.getAll()]);
      setMaps(list);
      if (subjects.length > 0) {
        const lists = await Promise.all(subjects.map((s) => topicService.getBySubjectId(s.id)));
        setTopics(lists.flatMap((ts, i) => ts.map((t) => ({ ...t, subjectName: subjects[i].name }))));
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openMap = useCallback(async (map: MindMap) => {
    try {
      const list = await mindmapService.getNodes(map.id);
      setNodes(list);
      setSelected(map);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }, []);

  // Abre o mapa indicado em /mindmaps?map=<id> (link direto ou atalho do cartão).
  useEffect(() => {
    if (mapParam && maps.length > 0) {
      const found = maps.find((m) => String(m.id) === mapParam);
      if (found) openMap(found);
    }
  }, [mapParam, maps, openMap]);

  const closeMap = () => {
    setSelected(null);
    setNodes([]);
    navigate('/mindmaps');
  };

  const handleCreateMap = async (data: MindMapInput) => {
    const created = await mindmapService.create(data);
    setMaps([created, ...maps]);
    navigate(`/mindmaps?map=${created.id}`);
    openMap(created);
  };

  const handleDeleteMap = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este mapa mental?')) return;
    try {
      setDeletingId(id);
      await mindmapService.delete(id);
      setMaps(maps.filter((m) => m.id !== id));
      if (selected?.id === id) closeMap();
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  const handleCreateNode = async (data: { content: string; parentId?: number }) => {
    if (!selected) return;
    const created = await mindmapService.createNode(selected.id, data);
    setNodes([...nodes, created]);
  };

  const handleUpdateNode = async (data: { content: string; parentId?: number }) => {
    if (!editingNode) return;
    const updated = await mindmapService.updateNode(editingNode.id, { content: data.content });
    setNodes(nodes.map((n) => (n.id === editingNode.id ? { ...n, ...updated } : n)));
    setEditingNode(null);
  };

  const handleNodeClick = (nodeId: number) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (node) {
      setEditingNode(node);
      setNodeModalOpen(true);
    }
  };

  const handlePositionChange = async (nodeId: number, x: number, y: number) => {
    try {
      await mindmapService.updateNodePosition(nodeId, { positionX: x, positionY: y });
      setNodes((prev) => prev.map((n) => (n.id === nodeId ? { ...n, positionX: x, positionY: y } : n)));
    } catch (err) {
      alert('Erro ao salvar posição: ' + getErrorMessage(err));
    }
  };

  const handleConnect = async (childId: number, parentId: number, sourceHandle?: string, targetHandle?: string) => {
    if (!selected) return;
    try {
      await mindmapService.updateNode(childId, { parentId, sourceHandle, targetHandle });
      setNodes(await mindmapService.getNodes(selected.id)); // recarrega para refletir os níveis recalculados
    } catch (err) {
      alert('Erro ao conectar nós: ' + getErrorMessage(err));
    }
  };

  const handleNodeEdit = async (nodeId: number, content: string) => {
    try {
      await mindmapService.updateNode(nodeId, { content });
      setNodes((prev) => prev.map((n) => (n.id === nodeId ? { ...n, content } : n)));
    } catch (err) {
      alert('Erro ao editar nó: ' + getErrorMessage(err));
    }
  };

  const handleColorChange = async (nodeId: number, color: NodeColor) => {
    try {
      await mindmapService.updateNode(nodeId, { backgroundColor: color.bg, textColor: color.text });
      setNodes((prev) => prev.map((n) => (n.id === nodeId ? { ...n, backgroundColor: color.bg, textColor: color.text } : n)));
    } catch (err) {
      alert('Erro ao mudar cor: ' + getErrorMessage(err));
    }
  };

  const handleNodeDelete = async (nodeId: number) => {
    try {
      await mindmapService.deleteNode(nodeId);
      setNodes((prev) => prev.filter((n) => n.id !== nodeId).map((n) => (n.parentId === nodeId ? { ...n, parentId: null } : n)));
    } catch (err) {
      alert('Erro ao deletar nó: ' + getErrorMessage(err));
    }
  };

  const handleEdgeDelete = async (childId: number) => {
    if (!selected) return;
    try {
      await mindmapService.updateNode(childId, { parentId: null });
      setNodes(await mindmapService.getNodes(selected.id));
    } catch (err) {
      alert('Erro ao remover conexão: ' + getErrorMessage(err));
    }
  };

  const closeNodeModal = () => {
    setNodeModalOpen(false);
    setEditingNode(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // ----- Editor do mapa selecionado -----
  if (selected) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={closeMap}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-6"
          >
            <ArrowLeft size={20} />
            <span>Voltar para mapas</span>
          </button>

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">{selected.title}</h1>
              {selected.description && <p className="text-gray-600 dark:text-gray-400">{selected.description}</p>}
              {selected.topicName && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">📖 {selected.topicName}</p>}
            </div>
            <Button onClick={() => setNodeModalOpen(true)}>
              <Plus size={20} className="mr-2 inline" />
              Adicionar Nó
            </Button>
          </div>

          <div className="mb-8">
            <MindMapCanvas
              nodes={nodes}
              onNodeClick={handleNodeClick}
              onNodesPositionChange={handlePositionChange}
              onConnect={handleConnect}
              onNodeEdit={handleNodeEdit}
              onNodeColorChange={handleColorChange}
              onNodeDelete={handleNodeDelete}
              onEdgeDelete={handleEdgeDelete}
            />
          </div>

          <Card className="bg-gradient-to-r from-purple-50 dark:from-purple-900/20 to-blue-50 dark:to-blue-900/20">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">🧠 Dicas de uso:</h3>
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <p><strong>• Adicionar nó:</strong> Clique em "Adicionar Nó" e escolha um pai (ou deixe vazio para nó raiz)</p>
              <p><strong>• Editar nó:</strong> Clique em um nó no canvas (ou dê dois cliques para editar o texto no próprio nó)</p>
              <p><strong>• Conectar:</strong> Arraste de um ponto de um nó até outro nó; clique com o botão direito para mudar a cor ou deletar</p>
              <p><strong>• Organização:</strong> Arraste os nós para posicioná-los; a posição é salva automaticamente</p>
            </div>
          </Card>

          <NodeFormModal
            isOpen={nodeModalOpen}
            onClose={closeNodeModal}
            onSubmit={editingNode ? handleUpdateNode : handleCreateNode}
            availableParents={nodes}
            editingNode={editingNode}
            title={editingNode ? 'Editar Nó' : 'Novo Nó'}
          />
        </div>
      </div>
    );
  }

  // ----- Lista de mapas -----
  const totalNodes = maps.reduce((sum, m) => sum + (m.nodesCount || 0), 0);

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">🧠 Mapas Mentais</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Organize conceitos visualmente de forma hierárquica</p>
          </div>
          <Button onClick={() => setMapModalOpen(true)} className="flex items-center justify-center gap-1">
            <Plus size={20} />
            Novo Mapa Mental
          </Button>
        </div>

        {error && (
          <div className="mb-6">
            <Alert type="error" onClose={load}>
              {error}. <button className="underline">Tentar novamente</button>
            </Alert>
          </div>
        )}

        <Card className="mb-8 bg-gradient-to-r from-purple-50 dark:from-purple-900/20 to-blue-50 dark:to-blue-900/20">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">🎨 O que são Mapas Mentais?</h3>
          <div className="space-y-2 text-gray-700 dark:text-gray-300">
            <p>Mapas mentais são representações visuais de informações que ajudam a:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Organizar conceitos hierarquicamente</li>
              <li>Visualizar relações entre ideias</li>
              <li>Memorizar informações de forma mais eficiente</li>
              <li>Fazer brainstorming e planejamento</li>
            </ul>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                <Network size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total de Mapas</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{maps.length}</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                <Network size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total de Nós</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalNodes}</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
                <Network size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Média de Nós</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {maps.length > 0 ? Math.round(totalNodes / maps.length) : 0}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {maps.length === 0 ? (
          <div className="text-center py-16">
            <Network size={64} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Nenhum mapa mental criado ainda</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Crie seu primeiro mapa mental para organizar conceitos visualmente</p>
            <Button onClick={() => setMapModalOpen(true)} className="flex items-center justify-center gap-2 mx-auto">
              <Plus size={20} />
              Criar Primeiro Mapa
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {maps.map((map) => (
              <div key={map.id} className="relative">
                {deletingId === map.id && (
                  <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-75 dark:bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
                    <Spinner />
                  </div>
                )}
                <MindMapCard
                  mindMap={map}
                  onClick={() => {
                    navigate(`/mindmaps?map=${map.id}`);
                    openMap(map);
                  }}
                  onEdit={() => {
                    navigate(`/mindmaps?map=${map.id}`);
                    openMap(map);
                  }}
                  onDelete={() => handleDeleteMap(map.id)}
                />
              </div>
            ))}
          </div>
        )}

        <MindMapFormModal isOpen={mapModalOpen} onClose={() => setMapModalOpen(false)} onSubmit={handleCreateMap} topics={topics} />
      </div>
    </div>
  );
}
