
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { DrmDscConfig, createEmptyDscConfig, SDE_DSC_PPS_SIZE } from './types';
import { 
  encodeDscToPPS, 
  decodePPSToDsc, 
  compareDscConfigs, 
  hexToBuffer,
  FIELD_TO_PPS_MAP,
  PPS_BYTE_TO_FIELDS
} from './services/dscService';
import '@fortawesome/fontawesome-free/css/all.min.css';
import DSCForm from './components/DSCForm';
import HexViewer from './components/HexViewer';
import FieldInfoPanel from './components/FieldInfoPanel';

const App: React.FC = () => {
  const [config, setConfig] = useState<DrmDscConfig>(createEmptyDscConfig());
  const [ppsBuffer, setPpsBuffer] = useState<Uint8Array>(new Uint8Array(SDE_DSC_PPS_SIZE));

  // Language State
  const [language, setLanguage] = useState<'en' | 'zh'>('en');

  // Highlighting State
  const [activeField, setActiveField] = useState<string | null>(null);
  const [hoveredByteIdx, setHoveredByteIdx] = useState<number | null>(null);
  const [selectedByteIdx, setSelectedByteIdx] = useState<number | null>(null);

  // States for Feature 3: Comparison
  const [compareMode, setCompareMode] = useState(false);
  const [configB, setConfigB] = useState<DrmDscConfig>(createEmptyDscConfig());
  const [ppsBufferB, setPpsBufferB] = useState<Uint8Array>(new Uint8Array(SDE_DSC_PPS_SIZE));
  // Selected byte index for Config B hex viewer
  const [selectedByteIdxB, setSelectedByteIdxB] = useState<number | null>(null);

  // Quick Import States
  const [isPasting, setIsPasting] = useState(false);
  const [pasteValue, setPasteValue] = useState('');
  const [isPastingB, setIsPastingB] = useState(false);
  const [pasteValueB, setPasteValueB] = useState('');

  // Sync buffer whenever config changes
  useEffect(() => {
    const encoded = encodeDscToPPS(config);
    setPpsBuffer(encoded);
  }, [config]);

  // Sync buffer B whenever config B changes
  useEffect(() => {
    if (compareMode) {
      const encoded = encodeDscToPPS(configB);
      setPpsBufferB(encoded);
    }
  }, [configB, compareMode]);

  // Decode buffer to config
  const handleBufferChange = useCallback((newBuf: Uint8Array) => {
    const finalBuf = new Uint8Array(SDE_DSC_PPS_SIZE);
    finalBuf.set(newBuf.slice(0, SDE_DSC_PPS_SIZE));
    setPpsBuffer(finalBuf);
    const decoded = decodePPSToDsc(finalBuf);
    setConfig(decoded);
  }, []);

  const handleBufferBChange = useCallback((newBuf: Uint8Array) => {
    const finalBuf = new Uint8Array(SDE_DSC_PPS_SIZE);
    finalBuf.set(newBuf.slice(0, SDE_DSC_PPS_SIZE));
    setPpsBufferB(finalBuf);
    const decoded = decodePPSToDsc(finalBuf);
    setConfigB(decoded);
  }, []);

  const differences = useMemo(() => {
    if (!compareMode) return [];
    return compareDscConfigs(config, configB);
  }, [config, configB, compareMode]);

  const exportCHeader = () => {
    const bytesText = Array.from(ppsBuffer).map((b: number) => `0x${b.toString(16).padStart(2, '0').toUpperCase()}`).join(', ');
    const headerContent = `/* Generated VESA DSC PPS buffer */\nconst uint8_t dsc_pps_payload[128] = {\n\t${bytesText}\n};`;
    const fileBlob = new Blob([headerContent], { type: 'text/plain' });
    const downloadUrl = URL.createObjectURL(fileBlob);
    const linkElement = document.createElement('a');
    linkElement.href = downloadUrl;
    linkElement.download = 'dsc_pps_config.h';
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
    URL.revokeObjectURL(downloadUrl);
  };

  const handleQuickImport = () => {
    const importedBuf = hexToBuffer(pasteValue);
    if (importedBuf.length > 0) {
      handleBufferChange(importedBuf);
      setIsPasting(false);
      setPasteValue('');
    }
  };

  const handleQuickImportB = () => {
    const importedBuf = hexToBuffer(pasteValueB);
    if (importedBuf.length > 0) {
      handleBufferBChange(importedBuf);
      setIsPastingB(false);
      setPasteValueB('');
    }
  };

  const detectedByteCount = useMemo(() => hexToBuffer(pasteValue).length, [pasteValue]);
  const detectedByteCountB = useMemo(() => hexToBuffer(pasteValueB).length, [pasteValueB]);

  // Highlighting Logic: Byte -> Fields (Priority: Selected > Hover)
  // Returns string[] of active fields
  const activeFieldsFromByte = useMemo(() => {
    const idx = selectedByteIdx ?? selectedByteIdxB ?? hoveredByteIdx;
    if (idx === null) return [];
    return PPS_BYTE_TO_FIELDS[idx] || [];
  }, [hoveredByteIdx, selectedByteIdx, selectedByteIdxB]);

  // Combined Active Fields (from hover on form OR from byte selection)
  const allActiveFields = useMemo(() => {
    const fields = new Set<string>();
    if (activeField) fields.add(activeField);
    activeFieldsFromByte.forEach(f => fields.add(f));
    return Array.from(fields);
  }, [activeField, activeFieldsFromByte]);

  // Highlighting Logic: Field -> Bytes
  const highlightedBytes = useMemo(() => {
    if (activeField) {
      return FIELD_TO_PPS_MAP[activeField] || [];
    }
    return [];
  }, [activeField]);

  // Determine which fields to show info for
  // Priority: 
  // 1. Hovered Form Field (Single)
  // 2. Selected Byte (Multiple)
  // 3. Hovered Byte (Multiple)
  const currentInfoFields = useMemo(() => {
    if (activeField) return [activeField];
    if (activeFieldsFromByte.length > 0) return activeFieldsFromByte;
    return [];
  }, [activeField, activeFieldsFromByte]);

  return (
    <div className="bg-slate-50 min-h-screen pb-48">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              VESA DSC <span className="text-blue-600">PPS Generator</span>
            </h1>
            <p className="text-slate-500 mt-1">Configure, Encode, Decode, and Compare VESA Display Stream Compression PPS Payloads.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              <i className="fa-solid fa-language mr-2"></i> {language === 'en' ? '中文' : 'English'}
            </button>
            <button 
              onClick={() => setCompareMode(!compareMode)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${compareMode ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-200 hover:bg-slate-300'}`}
            >
              <i className="fa-solid fa-code-compare mr-2"></i> {compareMode ? 'Disable Comparison' : 'Enable Comparison'}
            </button>
            <button 
              onClick={() => exportCHeader()}
              className="hidden px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium shadow-md transition-colors"
            >
              <i className="fa-solid fa-download mr-2"></i>Export C Header
            </button>
          </div>
        </header>

        {/* Comparison Status */}
        {compareMode && (
          <div className="mb-8 w-full transition-all animate-in fade-in zoom-in duration-300">
            {differences.length > 0 ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center shadow-sm w-full">
                <h3 className="text-red-800 font-extrabold text-xl mb-4 flex items-center justify-center">
                  <i className="fa-solid fa-triangle-exclamation mr-3 text-2xl"></i>
                  Found {differences.length} Differences
                </h3>
                <div className="flex justify-center">
                  <ul className="text-sm text-red-700 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-2 max-w-5xl text-left font-mono">
                    {differences.map(key => (
                      <li key={key} className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-red-400 rounded-full mr-2"></span>
                        {key}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center shadow-sm w-full">
                <p className="text-emerald-800 font-extrabold text-xl flex items-center justify-center">
                  <i className="fa-solid fa-circle-check mr-3 text-2xl"></i>
                  Configs A and B are identical!
                </p>
              </div>
            )}
          </div>
        )}

        <div className={`grid gap-8 ${compareMode ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1'}`}>
          {/* Config A Side */}
          <section className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden sticky top-1 z-30">
              <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
                <h2 className="font-bold text-slate-700">Config A (Master)</h2>
                <button 
                  onClick={() => setIsPasting(!isPasting)}
                  className={`text-xs px-2 py-1 rounded border transition-colors ${isPasting ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'}`}
                >
                  <i className="fa-solid fa-paste mr-1"></i> Quick Import Hex
                </button>
              </div>

              {isPasting && (
                <div className="p-4 bg-blue-50 border-b border-blue-100 animate-in fade-in slide-in-from-top-2">
                  <textarea 
                    autoFocus
                    value={pasteValue}
                    onChange={(e) => setPasteValue(e.target.value)}
                    placeholder="Paste PPS Hex string..."
                    className="w-full h-24 p-2 text-xs font-mono bg-white border border-blue-200 rounded"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-[10px] font-bold text-slate-500">{detectedByteCount} / 128 bytes</span>
                    <div className="flex gap-2">
                      <button onClick={() => setIsPasting(false)} className="text-xs px-2 py-1 text-slate-500">Cancel</button>
                      <button onClick={handleQuickImport} className="text-xs px-3 py-1 bg-blue-600 text-white rounded">Import</button>
                    </div>
                  </div>
                </div>
              )}

              <HexViewer 
                buffer={ppsBuffer} 
                onChange={handleBufferChange} 
                diffBuffer={compareMode ? ppsBufferB : undefined} 
                highlightIndices={highlightedBytes}
                onHoverByte={setHoveredByteIdx}
                onSelect={(idx) => { setSelectedByteIdx(idx); setSelectedByteIdxB(null); }}
              />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-200 px-4 py-3">
                <h2 className="font-bold text-slate-700 uppercase tracking-tight text-xs">drm_dsc_config Settings (A)</h2>
              </div>
              <DSCForm 
                config={config} 
                onChange={setConfig} 
                highlightKeys={compareMode ? differences : []} 
                activeFields={allActiveFields}
                onHoverField={setActiveField}
              />
            </div>
          </section>

          {/* Config B Side */}
          {compareMode && (
            <section className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden sticky top-1 z-30">
                <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
                  <h2 className="font-bold text-slate-700 text-blue-600">Config B (Target)</h2>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setIsPastingB(!isPastingB)}
                      className="text-xs px-2 py-1 rounded border bg-white border-slate-300 text-slate-600 hover:bg-slate-50"
                    >
                      Import B
                    </button>
                    <button onClick={() => setConfigB({ ...config })} className="text-[10px] px-2 py-1 bg-slate-200 rounded hover:bg-slate-300">Clone A</button>
                  </div>
                </div>
                
                {isPastingB && (
                  <div className="p-4 bg-blue-50 border-b border-blue-100 animate-in fade-in slide-in-from-top-2">
                    <textarea 
                      autoFocus
                      value={pasteValueB}
                      onChange={(e) => setPasteValueB(e.target.value)}
                      placeholder="Paste Config B PPS Hex..."
                      className="w-full h-24 p-2 text-xs font-mono bg-white border border-blue-200 rounded"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-[10px] font-bold text-slate-500">{detectedByteCountB} / 128 bytes</span>
                      <button onClick={handleQuickImportB} className="text-xs px-3 py-1 bg-blue-600 text-white rounded font-medium">Apply B</button>
                    </div>
                  </div>
                )}

                <HexViewer 
                  buffer={ppsBufferB} 
                  onChange={handleBufferBChange} 
                  diffBuffer={ppsBuffer} 
                  highlightIndices={highlightedBytes}
                  onHoverByte={setHoveredByteIdx}
                  onSelect={(idx) => { setSelectedByteIdxB(idx); setSelectedByteIdx(null); }}
                />
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 px-4 py-3">
                  <h2 className="font-bold text-slate-700 uppercase tracking-tight text-xs">Comparison Details (B)</h2>
                </div>
                <DSCForm 
                  config={configB} 
                  onChange={setConfigB} 
                  highlightKeys={differences} 
                  activeFields={allActiveFields}
                  onHoverField={setActiveField}
                />
              </div>
            </section>
          )}
        </div>

        <footer className="mt-12 pt-8 border-t border-slate-200 text-center text-slate-400 text-sm">
          <p>Bidirectional PPS Mapping Engine v2.0 • VESA DSC 1.1/1.2 Compliant</p>
        </footer>
      </div>
      
      {/* Field Info Panel */}
      <FieldInfoPanel fieldKeys={currentInfoFields} language={language} />
    </div>
  );
};

export default App;
