interface ReviewButtonsProps {
  onReview: (quality: number) => void;
  disabled?: boolean;
}

/** 0 Novamente · 1 Difícil · 2 Bom · 3 Fácil — o backend converte para a escala SM-2 (0-5). */
export const QUALITY_OPTIONS: Record<number, { label: string; emoji: string; description: string; color: string }> = {
  0: { label: 'Novamente', emoji: '❌', description: 'Não lembrei de nada', color: 'bg-red-500 hover:bg-red-600' },
  1: { label: 'Difícil', emoji: '😥', description: 'Lembrei com muita dificuldade', color: 'bg-orange-500 hover:bg-orange-600' },
  2: { label: 'Bom', emoji: '☺️', description: 'Lembrei após pensar', color: 'bg-blue-500 hover:bg-blue-600' },
  3: { label: 'Fácil', emoji: '🥳', description: 'Lembrei perfeitamente', color: 'bg-green-500 hover:bg-green-600' },
};

export default function ReviewButtons({ onReview, disabled = false }: ReviewButtonsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {[0, 1, 2, 3].map((q) => {
        const o = QUALITY_OPTIONS[q];
        return (
          <button
            key={q}
            onClick={() => onReview(q)}
            disabled={disabled}
            className={`${o.color} text-white p-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center gap-1`}
          >
            <span className="text-3xl">{o.emoji}</span>
            <span className="font-semibold">{o.label}</span>
            <span className="text-xs opacity-90">{o.description}</span>
          </button>
        );
      })}
    </div>
  );
}
