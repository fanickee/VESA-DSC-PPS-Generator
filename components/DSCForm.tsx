
import React, { useState } from 'react';
import { DrmDscConfig, DSC_NUM_BUF_RANGES } from '../types';

interface InputFieldProps {
  label: string;
  field: keyof DrmDscConfig;
  value: any;
  type?: string;
  step?: number;
  min?: number;
  max?: number;
  isDiff: boolean;
  isActive: boolean;
  onChange: (key: keyof DrmDscConfig, value: any) => void;
  onFocus: (field: string) => void;
  onBlur: () => void;
  onMouseEnter: (field: string) => void;
  onMouseLeave: () => void;
}

const InputField: React.FC<InputFieldProps> = ({ 
  label, field, value, type = 'number', step = 1, min, max, 
  isDiff, isActive, onChange, onFocus, onBlur, onMouseEnter, onMouseLeave 
}) => {
  return (
    <div 
      onMouseEnter={() => onMouseEnter(field as string)}
      onMouseLeave={onMouseLeave}
      className={`flex flex-col p-2 border rounded transition-all duration-200 ${isActive ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-300' : isDiff ? 'border-red-500 bg-red-50' : 'border-slate-200 hover:border-slate-300'}`}
    >
      <label className={`text-[10px] font-bold mb-1 uppercase tracking-tight ${isActive ? 'text-blue-600' : 'text-slate-500'}`}>{label}</label>
      {type === 'checkbox' ? (
        <input 
          type="checkbox" 
          checked={!!value} 
          onChange={(e) => onChange(field, e.target.checked)}
          onFocus={() => onFocus(field as string)}
          onBlur={onBlur}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
      ) : (
        <input 
          type="number" 
          value={value as number} 
          step={step}
          min={min}
          max={max}
          onChange={(e) => onChange(field, parseFloat(e.target.value) || 0)}
          onFocus={() => onFocus(field as string)}
          onBlur={onBlur}
          className="text-sm bg-transparent border-none focus:outline-none focus:ring-0 w-full font-mono"
        />
      )}
    </div>
  );
};

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
  const [focusedField, setFocusedField] = useState<string | null>(null);

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

  const handleFieldEnter = (field: string) => {
    if (!focusedField) onHoverField?.(field);
  };

  const handleFieldLeave = () => {
    if (!focusedField) onHoverField?.(null);
  };

  const handleFieldFocus = (field: string) => {
    setFocusedField(field);
    onHoverField?.(field);
  };

  const handleFieldBlur = () => {
    setFocusedField(null);
    onHoverField?.(null);
  };

  const renderInput = (label: string, field: keyof DrmDscConfig, type: string = 'number', step: number = 1, min?: number, max?: number) => (
    <InputField
      key={field}
      label={label}
      field={field}
      value={config[field]}
      type={type}
      step={step}
      min={min}
      max={max}
      isDiff={highlightKeys.includes(field)}
      isActive={activeFields.includes(field)}
      onChange={handleChange}
      onFocus={handleFieldFocus}
      onBlur={handleFieldBlur}
      onMouseEnter={handleFieldEnter}
      onMouseLeave={handleFieldLeave}
    />
  );

  const isThreshDiff = highlightKeys.includes('rc_buf_thresh');
  const isRangesDiff = highlightKeys.includes('rc_range_params');

  // Logic to show DSC 1.2 fields if version >= 2 OR if any of those fields are actively selected in Hex Viewer
  const dsc12Fields = ['second_line_bpg_offset', 'nsl_bpg_offset', 'second_line_offset_adj', 'native_422', 'native_420'];
  const showDsc12 = config.dsc_version_minor >= 2 || activeFields.some(f => dsc12Fields.includes(f));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      <style>{`
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { 
          -webkit-appearance: none; 
          margin: 0; 
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>

      {/* General Settings */}
      <div className="col-span-full border-b pb-1 mb-2 font-bold text-slate-800 text-xs uppercase tracking-widest">General Settings</div>
      {renderInput("Major Version", "dsc_version_major")}
      {renderInput("Minor Version", "dsc_version_minor")}
      {renderInput("BPC (8/10/12/14)", "bits_per_component")}
      {renderInput("BPP (Logical * 16)", "bits_per_pixel")}
      {renderInput("Pic Width", "pic_width")}
      {renderInput("Pic Height", "pic_height")}
      {renderInput("Slice Width", "slice_width")}
      {renderInput("Slice Height", "slice_height")}
      {renderInput("Line Buf Depth", "line_buf_depth")}
      {renderInput("Native 422", "native_422", "checkbox")}
      {renderInput("Native 420", "native_420", "checkbox")}
      {renderInput("Convert RGB", "convert_rgb", "checkbox")}
      {renderInput("Simple 422", "simple_422", "checkbox")}
      {renderInput("VBR Enable", "vbr_enable", "checkbox")}
      {renderInput("Block Pred Enable", "block_pred_enable", "checkbox")}

      {/* RC Settings */}
      <div className="col-span-full border-b pb-1 mb-2 mt-4 font-bold text-slate-800 text-xs uppercase tracking-widest">Rate Control Settings</div>
      {renderInput("RC Model Size", "rc_model_size")}
      {renderInput("RC Edge Factor", "rc_edge_factor")}
      {renderInput("RC Quant Incr Limit 0", "rc_quant_incr_limit0")}
      {renderInput("RC Quant Incr Limit 1", "rc_quant_incr_limit1")}
      {renderInput("RC Tgt Offset Low", "rc_tgt_offset_low")}
      {renderInput("RC Tgt Offset High", "rc_tgt_offset_high")}
      {renderInput("Initial Offset", "initial_offset")}
      {renderInput("Final Offset", "final_offset")}
      {renderInput("Initial Scale Value", "initial_scale_value")}
      {renderInput("Scale Incr Interval", "scale_increment_interval")}
      {renderInput("Scale Decr Interval", "scale_decrement_interval")}
      {renderInput("Initial Xmit Delay", "initial_xmit_delay")}
      {renderInput("Initial Dec Delay", "initial_dec_delay")}
      {renderInput("First Line BPG Offset", "first_line_bpg_offset")}
      {renderInput("NFL BPG Offset", "nfl_bpg_offset")}
      {renderInput("Slice BPG Offset", "slice_bpg_offset")}
      {renderInput("Flatness Min QP", "flatness_min_qp")}
      {renderInput("Flatness Max QP", "flatness_max_qp")}
      {renderInput("Slice Chunk Size", "slice_chunk_size")}

      {/* DSC 1.2 Settings */}
      {showDsc12 && (
        <>
          <div className="col-span-full border-b pb-1 mb-2 mt-4 font-bold text-slate-800 text-xs uppercase tracking-widest">
            DSC 1.2 Specific Settings
            {config.dsc_version_minor < 2 && <span className="ml-2 text-xs text-orange-500 normal-case font-normal">(Visible due to selection)</span>}
          </div>
          {renderInput("2nd Line BPG Offset", "second_line_bpg_offset")}
          {renderInput("NSL BPG Offset", "nsl_bpg_offset")}
          {renderInput("2nd Line Offset Adj", "second_line_offset_adj")}
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
                onMouseEnter={() => handleFieldEnter(fieldKey)}
                onMouseLeave={handleFieldLeave}
                className={`flex flex-col border p-2 rounded transition-all ${isActive ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 bg-white hover:border-slate-400'}`}
              >
                <span className={`text-[9px] mb-1 font-mono ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>T{idx+1}</span>
                <input 
                  type="number" 
                  value={val} 
                  onChange={(e) => handleThreshChange(idx, parseInt(e.target.value) || 0)}
                  onFocus={() => handleFieldFocus(fieldKey)}
                  onBlur={handleFieldBlur}
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
                  onMouseEnter={() => handleFieldEnter(fieldKey)}
                  onMouseLeave={handleFieldLeave}
                  className={`transition-colors ${isActive ? 'bg-blue-50' : 'even:bg-slate-50/50'}`}
                >
                  <td className={`p-2 border border-slate-200 font-bold ${isActive ? 'text-blue-600' : ''}`}>#{idx}</td>
                  <td className="p-2 border border-slate-200">
                    <input 
                      type="number" 
                      value={range.range_min_qp} 
                      onChange={(e) => handleRangeChange(idx, 'range_min_qp', parseInt(e.target.value) || 0)}
                      onFocus={() => handleFieldFocus(fieldKey)}
                      onBlur={handleFieldBlur}
                      className={`w-full bg-transparent outline-none ${isActive ? 'font-bold' : ''}`}
                    />
                  </td>
                  <td className="p-2 border border-slate-200">
                    <input 
                      type="number" 
                      value={range.range_max_qp} 
                      onChange={(e) => handleRangeChange(idx, 'range_max_qp', parseInt(e.target.value) || 0)}
                      onFocus={() => handleFieldFocus(fieldKey)}
                      onBlur={handleFieldBlur}
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
                      onFocus={() => handleFieldFocus(fieldKey)}
                      onBlur={handleFieldBlur}
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
    