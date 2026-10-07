import { useEffect, useRef } from 'react';
import { Palette, Trash2 } from 'lucide-react';

interface NodeContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onDelete?: () => void;
  onChangeColor?: () => void;
  showColorOption?: boolean;
}

export default function NodeContextMenu({ x, y, onClose, onDelete, onChangeColor, showColorOption = true }: NodeContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [onClose]);

  return (
    <div
      ref={ref}
      style={{ position: 'fixed', left: x, top: y, zIndex: 1000 }}
      className="bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[160px]"
    >
      {showColorOption && onChangeColor && (
        <button
          onClick={() => {
            onChangeColor();
            onClose();
          }}
          className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-left text-sm text-gray-700"
        >
          <Palette size={16} />
          <span>Mudar Cor</span>
        </button>
      )}
      {onDelete && (
        <button
          onClick={() => {
            onDelete();
            onClose();
          }}
          className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 text-left text-sm text-red-600"
        >
          <Trash2 size={16} />
          <span>Deletar</span>
        </button>
      )}
    </div>
  );
}
