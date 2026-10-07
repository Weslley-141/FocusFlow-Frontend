import { NODE_COLORS } from '../../utils/mindmapColors';
import type { NodeColor } from '../../utils/mindmapColors';

interface ColorPickerProps {
  currentColor: string;
  onColorSelect: (color: NodeColor) => void;
}

export default function ColorPicker({ currentColor, onColorSelect }: ColorPickerProps) {
  return (
    <div className="p-3">
      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-medium">Escolha uma cor:</p>
      <div className="grid grid-cols-4 gap-2">
        {NODE_COLORS.map((c) => (
          <button key={c.name} onClick={() => onColorSelect(c)} className="group relative" title={c.name}>
            <div
              style={{ backgroundColor: c.bg, borderColor: c.border }}
              className={`w-8 h-8 rounded border-2 transition-transform hover:scale-110 ${
                currentColor === c.bg ? 'ring-2 ring-blue-500 ring-offset-2' : ''
              }`}
            />
            {currentColor === c.bg && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-lg">✓</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
