
import React from 'react';
import { DrmDscConfig, DSC_NUM_BUF_RANGES } from '../types';

interface DSCFormProps {
  config: DrmDscConfig;
  onChange: (config: DrmDscConfig) => void;
  highlightKeys?: string[];
  activeFields?: string[];
  onHoverField?: (key: string | null) => void;
}

const DSCForm: React.FC<DSCFormProps> = ({ 
  config, 
  onChange, 
  highlightKeys = [], 
  activeFields = [],
  onHoverField
}) => {
  const handleChange = (key: keyof DrmDscConfig, value: any) => {
    onChange({ ...config, [key]: value });
  };

  const handleRangeChange = (index: number, field: string, value: number) => {
    const newRanges = [...config.rc_range_params];
    newRanges[index] = { ...newRanges[index], [field]: value };
    onChange({ ...config, rc_range_params: newRanges });
  };

  const handleThreshChange = (index: number, value: number) => {
    const newThresh = [...config.rc_buf_thresh];
    newThresh[index] = value;
    onChange({ ...config, rc_buf_thresh: newThresh });
  };

  const InputField = ({ label, field, type = 'number', step = 1, min, max }: { label: string, field: keyof DrmDscConfig, type?: string, step?: number, min?: number, max?: number }) => {
    const isDiff = highlightKeys.includes(field);
    const isActive = activeFields.includes(field);
    
    return (
      <div 
        onMouseEnter={() => onHoverField?.(field)}
        onMouseLeave={() => onHoverField?.(null)}
        className={`flex flex-col p-2 border rounded transition-all duration-200 ${isActive ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-300' : isDiff ? 'border-red-500 bg-red-50' : 'border-slate-200 hover:border-slate-300'}`}
      >
        <label className={`text-[10px] font-bold mb-1 uppercase tracking-tight ${isActive ? 'text-blue-600' : 'text-slate-500'}`}>{label}</label>
        {type === 'checkbox' ? (
          <input 
            type="checkbox" 
            checked={!!config[field]} 
            onChange={(e) => handleChange(field, e.target.checked)}
            onFocus={() => onHoverField?.(field)}
            onBlur={() => onHoverField?.(null)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
        ) : (
          <input 
            type="number" 
            value={config[field] as number} 
            step={step}
            min={min}
            max={max}
            onChange={(e) => handleChange(field, parseFloat(e.target.value) || 0)}
            onFocus={() => onHoverField?.(field)}
            onBlur={() => onHoverField?.(null)}
            className="text-sm bg-transparent border-none focus:outline-none focus:ring-0 w-full font-mono"
          />
        )}
      </div>
    );
  };

  const isThreshDiff = highlightKeys.includes('rc_buf_thresh');
  const isRangesDiff = highlightKeys.includes('rc_range_params');

  // Logic to show DSC 1.2 fields if version >= 2 OR if any of those fields are actively selected in Hex Viewer
  const dsc12Fields = ['second_line_bpg_offset', 'nsl_bpg_offset', 'second_line_offset_adj', 'native_422', 'native_420'];
  const showDsc12 = config.dsc_version_minor >= 2 || activeFields.some(f => dsc12Fields.includes(f));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {/* General Settings */}
      <div className="col-span-full border-b pb-1 mb-2 font-bold text-slate-800 text-xs uppercase tracking-widest">General Settings</div>
      <InputField label="Major Version" field="dsc_version_major" />
      <InputField label="Minor Version" field="dsc_version_minor" />
      <InputField label="BPC (8/10/12/14)" field="bits_per_component" />
      <InputField label="BPP (Logical * 16)" field="bits_per_pixel" />
      <InputField label="Pic Width" field="pic_width" />
      <InputField label="Pic Height" field="pic_height" />
      <InputField label="Slice Width" field="slice_width" />
      <InputField label="Slice Height" field="slice_height" />
      <InputField label="Line Buf Depth" field="line_buf_depth" />
      <InputField label="Native 422" field="native_422" type="checkbox" />
      <InputField label="Native 420" field="native_420" type="checkbox" />
      <InputField label="Convert RGB" field="convert_rgb" type="checkbox" />
      <InputField label="Simple 422" field="simple_422" type="checkbox" />
      <InputField label="VBR Enable" field="vbr_enable" type="checkbox" />
      <InputField label="Block Pred Enable" field="block_pred_enable" type="checkbox" />

      {/* RC Settings */}
      <div className="col-span-full border-b pb-1 mb-2 mt-4 font-bold text-slate-800 text-xs uppercase tracking-widest">Rate Control Settings</div>
      <InputField label="RC Model Size" field="rc_model_size" />
      <InputField label="RC Edge Factor" field="rc_edge_factor" />
      <InputField label="RC Quant Incr Limit 0" field="rc_quant_incr_limit0" />
      <InputField label="RC Quant Incr Limit 1" field="rc_quant_incr_limit1" />
      <InputField label="RC Tgt Offset Low" field="rc_tgt_offset_low" />
      <InputField label="RC Tgt Offset High" field="rc_tgt_offset_high" />
      <InputField label="Initial Offset" field="initial_offset" />
      <InputField label="Final Offset" field="final_offset" />
      <InputField label="Initial Scale Value" field="initial_scale_value" />
      <InputField label="Scale Incr Interval" field="scale_increment_interval" />
      <InputField label="Scale Decr Interval" field="scale_decrement_interval" />
      <InputField label="Initial Xmit Delay" field="initial_xmit_delay" />
      <InputField label="Initial Dec Delay" field="initial_dec_delay" />
      <InputField label="First Line BPG Offset" field="first_line_bpg_offset" />
      <InputField label="NFL BPG Offset" field="nfl_bpg_offset" />
      <InputField label="Slice BPG Offset" field="slice_bpg_offset" />
      <InputField label="Flatness Min QP" field="flatness_min_qp" />
      <InputField label="Flatness Max QP" field="flatness_max_qp" />
      <InputField label="Slice Chunk Size" field="slice_chunk_size" />

      {/* DSC 1.2 Settings */}
      {showDsc12 && (
        <>
          <div className="col-span-full border-b pb-1 mb-2 mt-4 font-bold text-slate-800 text-xs uppercase tracking-widest">
            DSC 1.2 Specific Settings
            {config.dsc_version_minor < 2 && <span className="ml-2 text-xs text-orange-500 normal-case font-normal">(Visible due to selection)</span>}
          </div>
          <InputField label="2nd Line BPG Offset" field="second_line_bpg_offset" />
          <InputField label="NSL BPG Offset" field="nsl_bpg_offset" />
          <InputField label="2nd Line Offset Adj" field="second_line_offset_adj" />
        </>
      )}

      {/* Thresholds */}
      <div className={`col-span-full mt-6 p-4 rounded-xl border transition-all duration-200 ${isThreshDiff ? 'border-red-500 bg-red-50/50' : 'border-slate-200'}`}>
        <h3 className="font-bold text-slate-700 mb-3 border-b pb-2 flex items-center text-xs uppercase tracking-wider">
          RC Buffer Thresholds
          {isThreshDiff && <span className="ml-2 text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full">CHANGED</span>}
        </h3>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {config.rc_buf_thresh.map((val, idx) => {
            const fieldKey = `rc_buf_thresh[${idx}]`;
            const isActive = activeFields.includes(fieldKey);
            return (
              <div 
                key={idx} 
                onMouseEnter={() => onHoverField?.(fieldKey)}
                onMouseLeave={() => onHoverField?.(null)}
                className={`flex flex-col border p-2 rounded transition-all ${isActive ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 bg-white hover:border-slate-400'}`}
              >
                <span className={`text-[9px] mb-1 font-mono ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>T{idx+1}</span>
                <input 
                  type="number" 
                  value={val} 
                  onChange={(e) => handleThreshChange(idx, parseInt(e.target.value) || 0)}
                  onFocus={() => onHoverField?.(fieldKey)}
                  onBlur={() => onHoverField?.(null)}
                  className={`text-xs focus:outline-none border-none p-0 w-full bg-transparent font-mono font-bold ${isActive ? 'text-white placeholder-blue-300' : 'text-slate-700'}`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* RC Ranges */}
      <div className={`col-span-full mt-6 overflow-x-auto p-4 rounded-xl border transition-all duration-200 ${isRangesDiff ? 'border-red-500 bg-red-50/50' : 'border-slate-200'}`}>
        <h3 className="font-bold text-slate-700 mb-3 border-b pb-2 flex items-center text-xs uppercase tracking-wider">
          RC Range Parameters
          {isRangesDiff && <span className="ml-2 text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full">CHANGED</span>}
        </h3>
        <table className="w-full text-left text-xs border-collapse font-mono">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="p-2 border border-slate-200">R#</th>
              <th className="p-2 border border-slate-200">Min QP</th>
              <th className="p-2 border border-slate-200">Max QP</th>
              <th className="p-2 border border-slate-200">BPG Offset (Signed 6-bit)</th>
            </tr>
          </thead>
          <tbody>
            {config.rc_range_params.map((range, idx) => {
              const fieldKey = `rc_range_params[${idx}]`;
              const isActive = activeFields.includes(fieldKey);
              return (
                <tr 
                  key={idx} 
                  onMouseEnter={() => onHoverField?.(fieldKey)}
                  onMouseLeave={() => onHoverField?.(null)}
                  className={`transition-colors ${isActive ? 'bg-blue-50' : 'even:bg-slate-50/50'}`}
                >
                  <td className={`p-2 border border-slate-200 font-bold ${isActive ? 'text-blue-600' : ''}`}>#{idx}</td>
                  <td className="p-2 border border-slate-200">
                    <input 
                      type="number" 
                      value={range.range_min_qp} 
                      onChange={(e) => handleRangeChange(idx, 'range_min_qp', parseInt(e.target.value) || 0)}
                      onFocus={() => onHoverField?.(fieldKey)}
                      onBlur={() => onHoverField?.(null)}
                      className={`w-full bg-transparent outline-none ${isActive ? 'font-bold' : ''}`}
                    />
                  </td>
                  <td className="p-2 border border-slate-200">
                    <input 
                      type="number" 
                      value={range.range_max_qp} 
                      onChange={(e) => handleRangeChange(idx, 'range_max_qp', parseInt(e.target.value) || 0)}
                      onFocus={() => onHoverField?.(fieldKey)}
                      onBlur={() => onHoverField?.(null)}
                      className={`w-full bg-transparent outline-none ${isActive ? 'font-bold' : ''}`}
                    />
                  </td>
                  <td className="p-2 border border-slate-200">
                    <input 
                      type="number" 
                      min="-32"
                      max="31"
                      value={range.range_bpg_offset} 
                      onChange={(e) => handleRangeChange(idx, 'range_bpg_offset', parseInt(e.target.value) || 0)}
                      onFocus={() => onHoverField?.(fieldKey)}
                      onBlur={() => onHoverField?.(null)}
                      className={`w-full bg-transparent outline-none font-bold ${range.range_bpg_offset < 0 ? 'text-orange-600' : ''}`}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DSCForm;
