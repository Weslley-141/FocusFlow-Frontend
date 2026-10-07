import { memo, useEffect, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent, MouseEvent } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';

export interface CustomNodeData {
  label: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  onEdit?: (newContent: string) => void;
  onContextMenu?: (e: MouseEvent) => void;
}

/**
 * Handle do qual o usuário começou a arrastar a conexão. Com `ConnectionMode.Loose`
 * guardamos aqui para saber o lado de saída (top/bottom/left/right) ao criar a aresta.
 */
// eslint-disable-next-line react-refresh/only-export-components
export const connectionState: { sourceHandle?: string } = { sourceHandle: undefined };

const SIDES: { id: string; position: Position }[] = [
  { id: 'top', position: Position.Top },
  { id: 'bottom', position: Position.Bottom },
  { id: 'left', position: Position.Left },
  { id: 'right', position: Position.Right },
];

function CustomNode({ data, selected }: NodeProps<CustomNodeData>) {
  const [editing, setEditing] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [value, setValue] = useState(data.label);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue(data.label);
  }, [data.label]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const save = () => {
    if (value.trim() && value.trim() !== data.label) data.onEdit?.(value.trim());
    setEditing(false);
  };

  const cancel = () => {
    setValue(data.label);
    setEditing(false);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') save();
    else if (e.key === 'Escape') cancel();
  };

  const handleStyle: CSSProperties = {
    background: '#555',
    width: 10,
    height: 10,
    opacity: hovered || selected ? 1 : 0,
    transition: 'opacity 0.15s',
  };

  return (
    <div
      onDoubleClick={(e) => {
        e.stopPropagation();
        setEditing(true);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        data.onContextMenu?.(e);
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: data.backgroundColor,
        color: data.textColor,
        border: `2px solid ${selected ? '#000000' : data.borderColor}`,
        borderRadius: '8px',
        padding: '10px 20px',
        fontSize: '14px',
        fontWeight: 500,
        minWidth: '120px',
        maxWidth: '200px',
        textAlign: 'center',
        cursor: editing ? 'text' : 'pointer',
        boxShadow: selected ? '0 0 0 2px #3B82F6' : 'none',
        transition: 'all 0.2s',
      }}
    >
      {SIDES.map((s) => (
        <Handle
          key={s.id}
          id={s.id}
          type="source"
          position={s.position}
          style={handleStyle}
          onMouseDown={() => {
            connectionState.sourceHandle = s.id;
          }}
        />
      ))}

      {editing ? (
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={save}
          className="nodrag"
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: data.textColor,
            fontSize: '14px',
            fontWeight: 500,
            textAlign: 'center',
            width: '100%',
            padding: 0,
          }}
        />
      ) : (
        <div>{data.label}</div>
      )}
    </div>
  );
}

export default memo(CustomNode);
