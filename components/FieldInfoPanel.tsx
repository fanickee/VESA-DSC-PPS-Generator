
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { DSC_FIELD_DEFINITIONS } from '../services/dscDefinitions';

interface FieldInfoPanelProps {
  fieldKeys: string[];
  language: 'en' | 'zh';
}

const FieldInfoPanel: React.FC<FieldInfoPanelProps> = ({ fieldKeys, language }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  // State for content transition
  // We store the keys and selection state locally to display them while fading out
  const [displayedState, setDisplayedState] = useState(() => {
    const valid = (fieldKeys || []).filter(key => DSC_FIELD_DEFINITIONS[key]);
    return {
      keys: valid,
      hasSelection: fieldKeys && fieldKeys.length > 0
    };
  });
  
  const [opacity, setOpacity] = useState(1);
  
  // State for height transition
  const contentRef = useRef<HTMLDivElement>(null);
  const [panelHeight, setPanelHeight] = useState<number | undefined>(undefined);

  // Derived current state from incoming props
  const currentValidKeys = (fieldKeys || []).filter(key => DSC_FIELD_DEFINITIONS[key]);
  const currentHasSelection = fieldKeys && fieldKeys.length > 0;
  
  // Create simple hash strings to compare states efficiently
  const currentStateHash = `${currentValidKeys.join(',')}|${currentHasSelection}`;
  const displayedStateHash = `${displayedState.keys.join(',')}|${displayedState.hasSelection}`;

  useEffect(() => {
    // If the props match what is currently displayed, do nothing
    if (currentStateHash === displayedStateHash) return;

    // Start fade out
    setOpacity(0);

    const timer = setTimeout(() => {
      // Update content and fade in
      setDisplayedState({
        keys: currentValidKeys,
        hasSelection: currentHasSelection
      });
      setOpacity(1);
    }, 200); // 200ms matches the CSS transition duration below

    return () => clearTimeout(timer);
  }, [currentStateHash, displayedStateHash, currentValidKeys, currentHasSelection]);

  // Measure content height whenever displayed content changes
  useLayoutEffect(() => {
    if (contentRef.current) {
      // Calculate total height: content height + 40px for the header
      const newHeight = contentRef.current.offsetHeight + 40;
      setPanelHeight(newHeight);
    }
  }, [displayedState, language]);

  const renderContent = () => {
    const { keys, hasSelection } = displayedState;

    if (!hasSelection) {
      return (
        <div className="h-24 flex items-center justify-center text-slate-400 text-sm">
          {language === 'en' ? 'Select a configuration field or PPS byte to view details.' : '选择配置字段或 PPS 字节以查看详情。'}
        </div>
      );
    }

    if (keys.length === 0) {
      return (
        <div className="h-24 flex items-center justify-center text-slate-400 text-sm">
          {language === 'en' ? 'No description available for this field.' : '此字段无可用描述。'}
        </div>
      );
    }

    return (
      <div className="max-w-7xl mx-auto divide-y divide-slate-100">
        {keys.map((key) => {
          const info = DSC_FIELD_DEFINITIONS[key];
          return (
            <div key={key} className="p-4 flex flex-col md:flex-row gap-4">
              <div className="flex-shrink-0 md:w-64">
                <h3 className="text-lg font-bold text-blue-700 break-words">{info.label}</h3>
                <div className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded inline-block mt-1 border border-slate-200">
                  {info.pps}
                </div>
              </div>
              <div className="flex-grow">
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {info.description[language]}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_15px_rgba(0,0,0,0.1)] z-50 flex flex-col transition-all duration-300 ease-in-out ${
        isExpanded ? 'max-h-[50vh]' : 'max-h-10'
      }`}
      style={{
        height: panelHeight ? `${panelHeight}px` : undefined
      }}
    >
      <div 
        className="h-10 flex-shrink-0 bg-slate-50 border-b border-slate-200 flex items-center justify-between px-4 cursor-pointer hover:bg-slate-100 select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
          <i className="fa-solid fa-circle-info text-blue-500"></i>
          {language === 'en' ? 'Field Details' : '字段详情'}
          {displayedState.keys.length > 0 && <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[10px]">{displayedState.keys.length}</span>}
        </span>
        <button 
          className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
          aria-label={isExpanded ? "Collapse panel" : "Expand panel"}
        >
          <i className={`fa-solid ${isExpanded ? 'fa-chevron-down' : 'fa-chevron-up'}`}></i>
        </button>
      </div>

      <div className="overflow-y-auto bg-white flex-grow">
        <div 
          ref={contentRef}
          className="transition-opacity duration-200 ease-in-out"
          style={{ opacity: opacity }}
        >
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default FieldInfoPanel;
