
import React, { useState } from 'react';

interface HexViewerProps {
  buffer: Uint8Array;
  onChange?: (buffer: Uint8Array) => void;
  diffBuffer?: Uint8Array;
  highlightIndices?: number[];
  onHoverByte?: (index: number | null) => void;
  onSelect?: (index: number | null) => void;
}

const HexViewer: React.FC<HexViewerProps> = ({ 
  buffer, 
  onChange, 
  diffBuffer, 
  highlightIndices = [], 
  onHoverByte,
  onSelect
}) => {
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState('');

  const startEdit = (idx: number) => {
    if (!onChange) return;
    setEditingIdx(idx);
    setInputValue(buffer[idx].toString(16).padStart(2, '0'));
    onSelect?.(idx);
  };

  const handleInput = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      submitEdit();
    } else if (e.key === 'Escape') {
      setEditingIdx(null);
      onSelect?.(null);
    }
  };

  const submitEdit = () => {
    // If we are not editing, do nothing
    if (editingIdx === null) return;
    
    // Check if we need to update value
    if (onChange) {
      const val = parseInt(inputValue, 16);
      if (!isNaN(val) && val >= 0 && val <= 255) {
        const newBuf = new Uint8Array(buffer);
        newBuf[editingIdx] = val;
        onChange(newBuf);
      }
    }
    
    setEditingIdx(null);
    onSelect?.(null);
  };

  const rows = [];
  for (let i = 0; i < buffer.length; i += 16) {
    rows.push(Array.from(buffer.slice(i, i + 16)));
  }

  return (
    <div className="bg-slate-900 text-slate-300 p-3 rounded-b-lg font-mono text-xs shadow-inner relative group">
      <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
        {rows.map((row, rowIdx) => (
          <React.Fragment key={rowIdx}>
            <div className="text-slate-500 border-r border-slate-700 pr-2 flex items-center h-6 select-none">
              {(rowIdx * 16).toString(16).padStart(3, '0').toUpperCase()}
            </div>
            <div className="grid grid-cols-16 gap-x-1">
              {row.map((byte, byteIdx) => {
                const totalIdx = rowIdx * 16 + byteIdx;
                const isDifferent = diffBuffer && diffBuffer[totalIdx] !== byte;
                const isEditing = editingIdx === totalIdx;
                const isHighlighted = highlightIndices.includes(totalIdx);

                return (
                  <div
                    key={byteIdx}
                    onMouseEnter={() => onHoverByte?.(totalIdx)}
                    onMouseLeave={() => onHoverByte?.(null)}
                    onClick={() => startEdit(totalIdx)}
                    title={`PPS ${totalIdx}`}
                    className={`
                      relative cursor-pointer rounded transition-all duration-75 
                      flex items-center justify-center h-6 w-full
                      ${isDifferent ? 'bg-red-900/50 text-red-400' : 'hover:bg-slate-800 hover:text-white'}
                      ${isEditing ? 'ring-2 ring-blue-500 bg-white text-black z-10' : ''}
                      ${isHighlighted ? 'bg-blue-600 text-white ring-1 ring-blue-300' : ''}
                    `}
                  >
                    {isEditing ? (
                      <input
                        autoFocus
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value.slice(0, 2))}
                        onKeyDown={handleInput}
                        onBlur={submitEdit}
                        className="bg-transparent w-full h-full text-center focus:outline-none p-0 m-0 uppercase font-bold caret-black"
                      />
                    ) : (
                      <span className="leading-none pt-[1px] select-none">
                        {byte.toString(16).padStart(2, '0').toUpperCase()}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </React.Fragment>
        ))}
      </div>
      <style>{`
        .grid-cols-16 {
          grid-template-columns: repeat(16, minmax(0, 1fr));
        }
      `}</style>
    </div>
  );
};

export default HexViewer;
