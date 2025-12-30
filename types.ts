
export const DSC_NUM_BUF_RANGES = 15;
export const SDE_DSC_PPS_SIZE = 128;
export const DSC_PPS_BPC_SHIFT = 4;
export const DSC_PPS_MSB_SHIFT = 8;
export const DSC_PPS_LSB_MASK = 0xFF;

export interface DrmDscRcRangeParameters {
  range_min_qp: number;
  range_max_qp: number;
  range_bpg_offset: number;
}

export interface DrmDscConfig {
  line_buf_depth: number;
  bits_per_component: number;
  convert_rgb: boolean;
  slice_count: number;
  slice_width: number;
  slice_height: number;
  simple_422: boolean;
  pic_width: number;
  pic_height: number;
  rc_tgt_offset_high: number;
  rc_tgt_offset_low: number;
  bits_per_pixel: number; // Target bits per pixel with 4 fractional bits
  rc_edge_factor: number;
  rc_quant_incr_limit1: number;
  rc_quant_incr_limit0: number;
  initial_xmit_delay: number;
  initial_dec_delay: number;
  block_pred_enable: boolean;
  first_line_bpg_offset: number;
  initial_offset: number;
  rc_buf_thresh: number[]; // size DSC_NUM_BUF_RANGES - 1
  rc_range_params: DrmDscRcRangeParameters[]; // size DSC_NUM_BUF_RANGES
  rc_model_size: number;
  flatness_min_qp: number;
  flatness_max_qp: number;
  initial_scale_value: number;
  scale_decrement_interval: number;
  scale_increment_interval: number;
  nfl_bpg_offset: number;
  slice_bpg_offset: number;
  final_offset: number;
  vbr_enable: boolean;
  mux_word_size: number;
  slice_chunk_size: number;
  rc_bits: number;
  dsc_version_minor: number;
  dsc_version_major: number;
  native_422: boolean;
  native_420: boolean;
  second_line_bpg_offset: number;
  nsl_bpg_offset: number;
  second_line_offset_adj: number;
}

export const createEmptyDscConfig = (): DrmDscConfig => ({
  line_buf_depth: 0,
  bits_per_component: 8,
  convert_rgb: false,
  slice_count: 1,
  slice_width: 0,
  slice_height: 0,
  simple_422: false,
  pic_width: 0,
  pic_height: 0,
  rc_tgt_offset_high: 0,
  rc_tgt_offset_low: 0,
  bits_per_pixel: 128, // 8.0 bpp
  rc_edge_factor: 0,
  rc_quant_incr_limit1: 0,
  rc_quant_incr_limit0: 0,
  initial_xmit_delay: 0,
  initial_dec_delay: 0,
  block_pred_enable: false,
  first_line_bpg_offset: 0,
  initial_offset: 0,
  rc_buf_thresh: new Array(DSC_NUM_BUF_RANGES - 1).fill(0),
  rc_range_params: Array.from({ length: DSC_NUM_BUF_RANGES }, () => ({
    range_min_qp: 0,
    range_max_qp: 0,
    range_bpg_offset: 0,
  })),
  rc_model_size: 0,
  flatness_min_qp: 0,
  flatness_max_qp: 0,
  initial_scale_value: 0,
  scale_decrement_interval: 0,
  scale_increment_interval: 0,
  nfl_bpg_offset: 0,
  slice_bpg_offset: 0,
  final_offset: 0,
  vbr_enable: false,
  mux_word_size: 0,
  slice_chunk_size: 0,
  rc_bits: 0,
  dsc_version_minor: 1,
  dsc_version_major: 1,
  native_422: false,
  native_420: false,
  second_line_bpg_offset: 0,
  nsl_bpg_offset: 0,
  second_line_offset_adj: 0,
});
