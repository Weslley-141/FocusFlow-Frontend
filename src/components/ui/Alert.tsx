import type { ReactNode } from 'react';
import { CircleAlert, CircleCheckBig, CircleX, Info, X } from 'lucide-react';

interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: ReactNode;
  onClose?: () => void;
}

const styles = {
  info: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', icon: <Info size={20} className="text-blue-600" /> },
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    icon: <CircleCheckBig size={20} className="text-green-600" />,
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-800',
    icon: <CircleAlert size={20} className="text-yellow-600" />,
  },
  error: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', icon: <CircleX size={20} className="text-red-600" /> },
};

export default function Alert({ type = 'info', title, children, onClose }: AlertProps) {
  const s = styles[type];
  return (
    <div className={`${s.bg} ${s.border} border rounded-lg p-4`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">{s.icon}</div>
        <div className="flex-1">
          {title && <h3 className={`font-semibold ${s.text} mb-1`}>{title}</h3>}
          <div className={s.text}>{children}</div>
        </div>
        {onClose && (
          <button onClick={onClose} className={`flex-shrink-0 ${s.text} hover:opacity-70`}>
            <X size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
