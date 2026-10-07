export interface NodeColor {
  name: string;
  bg: string;
  border: string;
  text: string;
}

export const NODE_COLORS: NodeColor[] = [
  { name: 'Azul', bg: '#3B82F6', border: '#2563EB', text: '#FFFFFF' },
  { name: 'Verde', bg: '#10B981', border: '#059669', text: '#FFFFFF' },
  { name: 'Roxo', bg: '#8B5CF6', border: '#7C3AED', text: '#FFFFFF' },
  { name: 'Laranja', bg: '#F59E0B', border: '#D97706', text: '#FFFFFF' },
  { name: 'Vermelho', bg: '#EF4444', border: '#DC2626', text: '#FFFFFF' },
  { name: 'Rosa', bg: '#EC4899', border: '#DB2777', text: '#FFFFFF' },
  { name: 'Amarelo', bg: '#FBBF24', border: '#F59E0B', text: '#000000' },
  { name: 'Cyan', bg: '#06B6D4', border: '#0891B2', text: '#FFFFFF' },
  { name: 'Indigo', bg: '#6366F1', border: '#4F46E5', text: '#FFFFFF' },
  { name: 'Teal', bg: '#14B8A6', border: '#0D9488', text: '#FFFFFF' },
  { name: 'Lime', bg: '#84CC16', border: '#65A30D', text: '#000000' },
  { name: 'Cinza', bg: '#6B7280', border: '#4B5563', text: '#FFFFFF' },
];

/** Procura a paleta pela cor de fundo; se não achar, usa o azul. */
export function getNodeColor(bg: string | null | undefined): NodeColor {
  return NODE_COLORS.find((c) => c.bg.toLowerCase() === (bg || '').toLowerCase()) || NODE_COLORS[0];
}
