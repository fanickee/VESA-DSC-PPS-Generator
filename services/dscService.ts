
import { 
  DrmDscConfig, 
  DrmDscRcRangeParameters,
  DSC_NUM_BUF_RANGES, 
  SDE_DSC_PPS_SIZE,
  DSC_PPS_BPC_SHIFT,
  DSC_PPS_MSB_SHIFT,
  DSC_PPS_LSB_MASK,
  createEmptyDscConfig
} from '../types';

/**
 * Encodes a DrmDscConfig into a 128-byte PPS buffer.
 */
export function encodeDscToPPS(dsc: DrmDscConfig, ppsId: number = 0): Uint8Array {
  const buf = new Uint8Array(SDE_DSC_PPS_SIZE);
  let offset = 0;

  // PPS0
  buf[offset++] = (dsc.dsc_version_minor & 0x0F) | ((dsc.dsc_version_major & 0x0F) << 4);
  // PPS1
  buf[offset++] = (ppsId & 0xFF);
  // PPS2 Reserved
  offset++;

  // PPS3
  let data = (dsc.line_buf_depth & 0x0F);
  data |= ((dsc.bits_per_component & 0x0F) << DSC_PPS_BPC_SHIFT);
  buf[offset++] = data;

  // PPS4 & 5
  let bpp = dsc.bits_per_pixel;
  if (dsc.native_422 || dsc.native_420) bpp = 2 * bpp;
  
  data = (bpp >> DSC_PPS_MSB_SHIFT) & 0x03;
  data |= ((dsc.block_pred_enable ? 1 : 0) << 5);
  data |= ((dsc.convert_rgb ? 1 : 0) << 4);
  data |= ((dsc.simple_422 ? 1 : 0) << 3);
  data |= ((dsc.vbr_enable ? 1 : 0) << 2);
  buf[offset++] = data; // PPS4
  buf[offset++] = (bpp & DSC_PPS_LSB_MASK); // PPS5

  // PPS6-7: pic_height
  buf[offset++] = (dsc.pic_height >> 8) & 0xFF;
  buf[offset++] = dsc.pic_height & 0xFF;
  
  // PPS8-9: pic_width
  buf[offset++] = (dsc.pic_width >> 8) & 0xFF;
  buf[offset++] = dsc.pic_width & 0xFF;

  // PPS10-11: slice_height
  buf[offset++] = (dsc.slice_height >> 8) & 0xFF;
  buf[offset++] = dsc.slice_height & 0xFF;

  // PPS12-13: slice_width
  buf[offset++] = (dsc.slice_width >> 8) & 0xFF;
  buf[offset++] = dsc.slice_width & 0xFF;

  // PPS14-15: slice_chunk_size
  buf[offset++] = (dsc.slice_chunk_size >> 8) & 0xFF;
  buf[offset++] = dsc.slice_chunk_size & 0xFF;

  // PPS16-17: initial_xmit_delay
  buf[offset++] = (dsc.initial_xmit_delay >> 8) & 0x03;
  buf[offset++] = dsc.initial_xmit_delay & 0xFF;

  // PPS18-19: initial_dec_delay
  buf[offset++] = (dsc.initial_dec_delay >> 8) & 0xFF;
  buf[offset++] = dsc.initial_dec_delay & 0xFF;

  // PPS20 Reserved
  offset++;

  // PPS21: initial_scale_value
  buf[offset++] = (dsc.initial_scale_value & 0x3F);

  // PPS22-23: scale_increment_interval
  buf[offset++] = (dsc.scale_increment_interval >> 8) & 0xFF;
  buf[offset++] = dsc.scale_increment_interval & 0xFF;

  // PPS24-25: scale_decrement_interval
  buf[offset++] = (dsc.scale_decrement_interval >> 8) & 0x0F;
  buf[offset++] = dsc.scale_decrement_interval & 0xFF;

  // PPS26 Reserved
  offset++;

  // PPS27: first_line_bpg_offset
  buf[offset++] = (dsc.first_line_bpg_offset & 0x1F);

  // PPS28-29: nfl_bpg_offset
  buf[offset++] = (dsc.nfl_bpg_offset >> 8) & 0xFF;
  buf[offset++] = dsc.nfl_bpg_offset & 0xFF;

  // PPS30-31: slice_bpg_offset
  buf[offset++] = (dsc.slice_bpg_offset >> 8) & 0xFF;
  buf[offset++] = dsc.slice_bpg_offset & 0xFF;

  // PPS32-33: initial_offset
  buf[offset++] = (dsc.initial_offset >> 8) & 0xFF;
  buf[offset++] = dsc.initial_offset & 0xFF;

  // PPS34-35: final_offset
  buf[offset++] = (dsc.final_offset >> 8) & 0xFF;
  buf[offset++] = dsc.final_offset & 0xFF;

  // PPS36: flatness_min_qp
  buf[offset++] = (dsc.flatness_min_qp & 0x1F);
  // PPS37: flatness_max_qp
  buf[offset++] = (dsc.flatness_max_qp & 0x1F);

  // PPS38-39: rc_model_size
  buf[offset++] = (dsc.rc_model_size >> 8) & 0xFF;
  buf[offset++] = dsc.rc_model_size & 0xFF;

  // PPS40: rc_edge_factor
  buf[offset++] = (dsc.rc_edge_factor & 0x0F);

  // PPS41: rc_quant_incr_limit0
  buf[offset++] = (dsc.rc_quant_incr_limit0 & 0x1F);
  // PPS42: rc_quant_incr_limit1
  buf[offset++] = (dsc.rc_quant_incr_limit1 & 0x1F);

  // PPS43: rc_tgt_offset
  buf[offset++] = ((dsc.rc_tgt_offset_high & 0x0F) << 4) | (dsc.rc_tgt_offset_low & 0x0F);

  // PPS44-57: rc_buf_thresh
  for (let i = 0; i < DSC_NUM_BUF_RANGES - 1; i++) {
    buf[offset++] = (dsc.rc_buf_thresh[i] & 0xFF);
  }

  // PPS58-87: rc_range_params
  for (let i = 0; i < DSC_NUM_BUF_RANGES; i++) {
    const p = dsc.rc_range_params[i];
    // Byte 0
    let b0 = (p.range_min_qp & 0x1F) << 3;
    b0 |= ((p.range_max_qp >> 2) & 0x07);
    buf[offset++] = b0;
    // Byte 1
    let b1 = (p.range_max_qp & 0x03) << 6;
    b1 |= (p.range_bpg_offset & 0x3F); // Signed value encoded as bits
    buf[offset++] = b1;
  }

  // PPS88-93: DSC 1.2 specific
  if (dsc.dsc_version_minor >= 0x02) {
    let nativeData = 0;
    if (dsc.native_422) nativeData = 0x01;
    else if (dsc.native_420) nativeData = 0x02;
    buf[offset++] = nativeData; // PPS88
    buf[offset++] = dsc.second_line_bpg_offset; // PPS89

    buf[offset++] = (dsc.nsl_bpg_offset >> 8) & 0xFF; // PPS90
    buf[offset++] = dsc.nsl_bpg_offset & 0xFF; // PPS91

    buf[offset++] = (dsc.second_line_offset_adj >> 8) & 0xFF; // PPS92
    buf[offset++] = dsc.second_line_offset_adj & 0xFF; // PPS93
  }

  return buf;
}

/**
 * Decodes a 128-byte PPS buffer into a DrmDscConfig structure.
 */
export function decodePPSToDsc(buf: Uint8Array): DrmDscConfig {
  const dsc = createEmptyDscConfig();
  let offset = 0;

  // PPS0
  const v = buf[offset++];
  dsc.dsc_version_minor = v & 0x0F;
  dsc.dsc_version_major = (v >> 4) & 0x0F;
  
  // Skip PPS1-2
  offset += 2;

  // PPS3
  const p3 = buf[offset++];
  dsc.line_buf_depth = p3 & 0x0F;
  dsc.bits_per_component = (p3 >> DSC_PPS_BPC_SHIFT) & 0x0F;

  // PPS4-5
  const p4 = buf[offset++];
  const p5 = buf[offset++];
  dsc.block_pred_enable = ((p4 >> 5) & 0x01) === 1;
  dsc.convert_rgb = ((p4 >> 4) & 0x01) === 1;
  dsc.simple_422 = ((p4 >> 3) & 0x01) === 1;
  dsc.vbr_enable = ((p4 >> 2) & 0x01) === 1;
  
  let bpp_raw = ((p4 & 0x03) << DSC_PPS_MSB_SHIFT) | p5;

  // PPS6-15
  dsc.pic_height = (buf[offset++] << 8) | buf[offset++];
  dsc.pic_width = (buf[offset++] << 8) | buf[offset++];
  dsc.slice_height = (buf[offset++] << 8) | buf[offset++];
  dsc.slice_width = (buf[offset++] << 8) | buf[offset++];
  dsc.slice_chunk_size = (buf[offset++] << 8) | buf[offset++];

  // PPS16-17
  dsc.initial_xmit_delay = ((buf[offset++] & 0x03) << 8) | buf[offset++];

  // PPS18-19
  dsc.initial_dec_delay = (buf[offset++] << 8) | buf[offset++];

  // Skip PPS20
  offset++;

  // PPS21
  dsc.initial_scale_value = buf[offset++] & 0x3F;

  // PPS22-23
  dsc.scale_increment_interval = (buf[offset++] << 8) | buf[offset++];

  // PPS24-25
  dsc.scale_decrement_interval = ((buf[offset++] & 0x0F) << 8) | buf[offset++];

  // Skip PPS26
  offset++;

  // PPS27
  dsc.first_line_bpg_offset = buf[offset++] & 0x1F;

  // PPS28-29
  dsc.nfl_bpg_offset = (buf[offset++] << 8) | buf[offset++];
  
  // PPS30-31
  dsc.slice_bpg_offset = (buf[offset++] << 8) | buf[offset++];

  // PPS32-33
  dsc.initial_offset = (buf[offset++] << 8) | buf[offset++];

  // PPS34-35
  dsc.final_offset = (buf[offset++] << 8) | buf[offset++];

  // PPS36-37
  dsc.flatness_min_qp = buf[offset++] & 0x1F;
  dsc.flatness_max_qp = buf[offset++] & 0x1F;

  // PPS38-39
  dsc.rc_model_size = (buf[offset++] << 8) | buf[offset++];

  // PPS40
  dsc.rc_edge_factor = buf[offset++] & 0x0F;

  // PPS41-42
  dsc.rc_quant_incr_limit0 = buf[offset++] & 0x1F;
  dsc.rc_quant_incr_limit1 = buf[offset++] & 0x1F;

  // PPS43
  const p43 = buf[offset++];
  dsc.rc_tgt_offset_high = (p43 >> 4) & 0x0F;
  dsc.rc_tgt_offset_low = p43 & 0x0F;

  // PPS44-57
  for (let i = 0; i < DSC_NUM_BUF_RANGES - 1; i++) {
    dsc.rc_buf_thresh[i] = buf[offset++];
  }

  // PPS58-87
  for (let i = 0; i < DSC_NUM_BUF_RANGES; i++) {
    const b0 = buf[offset++];
    const b1 = buf[offset++];
    let bpg = b1 & 0x3F;
    // Sign extension for 6-bit signed integer
    if (bpg > 31) bpg -= 64;
    
    dsc.rc_range_params[i] = {
      range_min_qp: (b0 >> 3) & 0x1F,
      range_max_qp: ((b0 & 0x07) << 2) | ((b1 >> 6) & 0x03),
      range_bpg_offset: bpg
    };
  }

  // PPS88+ (DSC 1.2)
  if (dsc.dsc_version_minor >= 0x02) {
    const p88 = buf[offset++];
    dsc.native_422 = (p88 & 0x01) === 1;
    dsc.native_420 = (p88 & 0x02) === 2;
    dsc.second_line_bpg_offset = buf[offset++];
    dsc.nsl_bpg_offset = (buf[offset++] << 8) | buf[offset++];
    dsc.second_line_offset_adj = (buf[offset++] << 8) | buf[offset++];
  }

  // Re-calculate logical BPP (bits_per_pixel) based on PPS bits
  if (dsc.native_422 || dsc.native_420) {
    dsc.bits_per_pixel = bpp_raw / 2;
  } else {
    dsc.bits_per_pixel = bpp_raw;
  }

  return dsc;
}

/**
 * Mapping from PPS Byte Index to Config Field Name(s).
 * Maps a single byte index to one or more DrmDscConfig keys.
 */
export const PPS_BYTE_TO_FIELDS: Record<number, string[]> = {
  0: ["dsc_version_major", "dsc_version_minor"],
  // 1: pps_id not in config struct
  3: ["line_buf_depth", "bits_per_component"],
  4: ["bits_per_pixel", "block_pred_enable", "convert_rgb", "simple_422", "vbr_enable"],
  5: ["bits_per_pixel"], // low bits
  6: ["pic_height"],
  7: ["pic_height"],
  8: ["pic_width"],
  9: ["pic_width"],
  10: ["slice_height"],
  11: ["slice_height"],
  12: ["slice_width"],
  13: ["slice_width"],
  14: ["slice_chunk_size"],
  15: ["slice_chunk_size"],
  16: ["initial_xmit_delay"],
  17: ["initial_xmit_delay"],
  18: ["initial_dec_delay"],
  19: ["initial_dec_delay"],
  21: ["initial_scale_value"],
  22: ["scale_increment_interval"],
  23: ["scale_increment_interval"],
  24: ["scale_decrement_interval"],
  25: ["scale_decrement_interval"],
  27: ["first_line_bpg_offset"],
  28: ["nfl_bpg_offset"],
  29: ["nfl_bpg_offset"],
  30: ["slice_bpg_offset"],
  31: ["slice_bpg_offset"],
  32: ["initial_offset"],
  33: ["initial_offset"],
  34: ["final_offset"],
  35: ["final_offset"],
  36: ["flatness_min_qp"],
  37: ["flatness_max_qp"],
  38: ["rc_model_size"],
  39: ["rc_model_size"],
  40: ["rc_edge_factor"],
  41: ["rc_quant_incr_limit0"],
  42: ["rc_quant_incr_limit1"],
  43: ["rc_tgt_offset_high", "rc_tgt_offset_low"],
  88: ["native_422", "native_420"],
  89: ["second_line_bpg_offset"],
  90: ["nsl_bpg_offset"],
  91: ["nsl_bpg_offset"],
  92: ["second_line_offset_adj"],
  93: ["second_line_offset_adj"],
};

// Fill in dynamic arrays for PPS_BYTE_TO_FIELDS
for (let i = 0; i < 14; i++) {
  PPS_BYTE_TO_FIELDS[44 + i] = [`rc_buf_thresh[${i}]`];
}
for (let i = 0; i < 15; i++) {
  const fields = [`rc_range_params[${i}]`];
  PPS_BYTE_TO_FIELDS[58 + i * 2] = fields;
  PPS_BYTE_TO_FIELDS[59 + i * 2] = fields;
}

/**
 * Inverted Mapping: Config Field Name -> PPS Byte Indices
 */
export const FIELD_TO_PPS_MAP: Record<string, number[]> = {};

Object.entries(PPS_BYTE_TO_FIELDS).forEach(([byteIdxStr, fields]) => {
  const byteIdx = parseInt(byteIdxStr);
  fields.forEach(field => {
    if (!FIELD_TO_PPS_MAP[field]) {
      FIELD_TO_PPS_MAP[field] = [];
    }
    // Avoid duplicates if multiple bytes map to same field
    if (!FIELD_TO_PPS_MAP[field].includes(byteIdx)) {
      FIELD_TO_PPS_MAP[field].push(byteIdx);
    }
  });
});

/**
 * Legacy support / Alias for compatibility if needed.
 * But we primarily use PPS_BYTE_TO_FIELDS now.
 */
export const PPS_TO_FIELD_MAP: Record<number, string> = {};
// We don't populate this one anymore as it cannot support 1:N mapping correctly.
// The App component should assume PPS_BYTE_TO_FIELDS logic.

/**
 * Compare two configs and return list of different keys.
 */
export function compareDscConfigs(a: DrmDscConfig, b: DrmDscConfig): string[] {
  const diffs: string[] = [];
  const keys = Object.keys(a) as Array<keyof DrmDscConfig>;
  
  for (const key of keys) {
    const valA = a[key];
    const valB = b[key];
    
    if (Array.isArray(valA) && Array.isArray(valB)) {
      if (JSON.stringify(valA) !== JSON.stringify(valB)) {
        diffs.push(key);
      }
    } else if (typeof valA === 'object' && valA !== null && typeof valB === 'object' && valB !== null) {
      if (JSON.stringify(valA) !== JSON.stringify(valB)) {
        diffs.push(key);
      }
    } else if (valA !== valB) {
      diffs.push(key);
    }
  }
  
  return diffs;
}

export function bufferToHex(buf: Uint8Array): string {
  return Array.from(buf).map(b => b.toString(16).padStart(2, '0')).join(' ');
}

export function hexToBuffer(hex: string): Uint8Array {
  let cleaned = hex.replace(/0x/g, '');
  cleaned = cleaned.replace(/[^0-9a-fA-F]/g, '');
  if (cleaned.length === 0) return new Uint8Array(0);
  const resultLength = Math.floor(cleaned.length / 2);
  const result = new Uint8Array(resultLength);
  for (let i = 0; i < resultLength; i++) {
    result[i] = parseInt(cleaned.substring(i * 2, i * 2 + 2), 16);
  }
  return result;
}
