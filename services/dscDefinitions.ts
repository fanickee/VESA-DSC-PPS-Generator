
export interface FieldDescription {
  en: string;
  zh: string;
}

export interface FieldDefinition {
  label: string;
  pps: string;
  description: FieldDescription;
}

export const DSC_FIELD_DEFINITIONS: Record<string, FieldDefinition> = {
  dsc_version_major: {
    label: "dsc_version_major",
    pps: "PPS0[7:4] (4 bits)",
    description: {
      en: "Major version of DSC.\n0x1 = Encoder implements DSC.",
      zh: "DSC 主版本号。\n0x1 = 编码器实现 DSC。"
    }
  },
  dsc_version_minor: {
    label: "dsc_version_minor",
    pps: "PPS0[3:0] (4 bits)",
    description: {
      en: "Minor version of DSC.\n0x1 = Bitstream is DSC v1.1 compatible.\n0x2 = Bitstream is DSC v1.2 compatible.\nNote: DSC v1.0 is deprecated and no longer supported.",
      zh: "DSC 次版本号。\n0x1 = 比特流兼容 DSC v1.1。\n0x2 = 比特流兼容 DSC v1.2。\n注意：DSC v1.0 已弃用，不再支持。"
    }
  },
  pps_identifier: {
    label: "pps_identifier",
    pps: "PPS1[7:0] (8 bits)",
    description: {
      en: "Application-specific identifier that may be used to differentiate between different PPS tables.\nIf PPS transmission is not defined by an application specification, the value should be 0x00 (see Section 4.1.2).",
      zh: "特定于应用程序的标识符，可用于区分不同的 PPS 表。\n如果应用程序规范未定义 PPS 传输，则该值应为 0x00（参见第 4.1.2 节）。"
    }
  },
  line_buf_depth: {
    label: "linebuf_depth",
    pps: "PPS3[3:0] (4 bits)",
    description: {
      en: "Line buffer bit depth used to generate the bitstream. If a component’s bit depth (after color space conversion; see Section 6.1) is greater than this value, the line storage rounds the reconstructed values to this number of bits.\n0x0 = 16 bits (allowed only when dsc_version_minor = 0x2).\n0x8 = 8 bits.\n0x9 = 9 bits.\n0xA = 10 bits.\n0xB = 11 bits.\n0xC = 12 bits.\n0xD = 13 bits.\n0xE = 14 bits (allowed only when dsc_version_minor = 0x2).\n0xF = 15 bits (allowed only when dsc_version_minor = 0x2).\nAll other encodings are RESERVED.",
      zh: "用于生成比特流的行缓冲位深度。如果分量的位深度（颜色空间转换后；参见第 6.1 节）大于此值，则行存储会将重建值舍入到此位数。\n0x0 = 16 位（仅当 dsc_version_minor = 0x2 时允许）。\n0x8 = 8 位。\n0x9 = 9 位。\n0xA = 10 位。\n0xB = 11 位。\n0xC = 12 位。\n0xD = 13 位。\n0xE = 14 位（仅当 dsc_version_minor = 0x2 时允许）。\n0xF = 15 位（仅当 dsc_version_minor = 0x2 时允许）。\n所有其他编码均为保留。"
    }
  },
  bits_per_component: {
    label: "bits_per_component",
    pps: "PPS3[7:4] (4 bits)",
    description: {
      en: "Number of bits per component for the original pixels of the encoded picture.\n0x0 = 16 bpc (allowed only when dsc_version_minor = 0x2).\n0x8 = 8 bpc.\n0xA = 10 bpc.\n0xC = 12 bpc.\n0xE = 14 bpc (allowed only when dsc_version_minor = 0x2).\nAll other encodings are RESERVED.",
      zh: "编码图像原始像素的每分量位数 (BPC)。\n0x0 = 16 bpc（仅当 dsc_version_minor = 0x2 时允许）。\n0x8 = 8 bpc。\n0xA = 10 bpc。\n0xC = 12 bpc。\n0xE = 14 bpc（仅当 dsc_version_minor = 0x2 时允许）。\n所有其他编码均为保留。"
    }
  },
  bits_per_pixel: {
    label: "bits_per_pixel",
    pps: "PPS4[1:0] (High) | PPS5[7:0] (Low) (10 bits)",
    description: {
      en: "Target bpp rate that is used by the encoder, in steps of 1/16 of a bit per pixel. Only values greater than or equal to 6.0 are allowed.\nWhen vbr_enable = 0 (CBR mode), this value shall be less than or equal to the sustained rate that would apply if MPP is always selected with QP = 0, which is a function of bits_per_component, convert_rgb, and rc_range_parameters[0].\nWhen native_422 or native_420 = 1, this value shall be programmed to double the target bpp rate.\nNote: The maximum supported PPS value is 63.9375.",
      zh: "编码器使用的目标 bpp 率，步长为 1/16 比特/像素。仅允许大于或等于 6.0 的值。\n当 vbr_enable = 0 (CBR 模式) 时，此值应小于或等于在 QP = 0 时始终选择 MPP 所适用的持续速率，这是 bits_per_component、convert_rgb 和 rc_range_parameters[0] 的函数。\n当 native_422 或 native_420 = 1 时，此值应编程为目标 bpp 率的两倍。\n注意：支持的最大 PPS 值为 63.9375。"
    }
  },
  vbr_enable: {
    label: "vbr_enable",
    pps: "PPS4[2] (1 bit)",
    description: {
      en: "0 = VBR mode is disabled (CBR mode).\n1 = VBR mode is enabled, if the mode is supported by the transport and decoder (see Section 3.7.2).",
      zh: "0 = 禁用 VBR 模式 (CBR 模式)。\n1 = 启用 VBR 模式，如果传输和解码器支持该模式（参见第 3.7.2 节）。"
    }
  },
  simple_422: {
    label: "simple_422",
    pps: "PPS4[3] (1 bit)",
    description: {
      en: "Indicates whether a decoder creates a reconstructed 4:2:2 picture by dropping samples using the method described in Annex B.\nsimple_422 = 0 when native_422 or native_420 = 1.\n0 = Decoder does not drop samples to reconstruct a 4:2:2 picture.\n1 = Decoder drops samples to reconstruct a 4:2:2 picture.",
      zh: "指示解码器是否通过丢弃样本来创建重建的 4:2:2 图像（使用附录 B 中描述的方法）。\n当 native_422 或 native_420 = 1 时，simple_422 = 0。\n0 = 解码器不丢弃样本来重建 4:2:2 图像。\n1 = 解码器丢弃样本来重建 4:2:2 图像。"
    }
  },
  convert_rgb: {
    label: "convert_rgb",
    pps: "PPS4[4] (1 bit)",
    description: {
      en: "Indicates whether DSC color space conversion is active.\n0 = Color space is YCbCr.\n1 = Encoder converts RGB to YCoCg-R, and decoder converts YCoCg-R to RGB.",
      zh: "指示 DSC 颜色空间转换是否处于活动状态。\n0 = 颜色空间为 YCbCr。\n1 = 编码器将 RGB 转换为 YCoCg-R，解码器将 YCoCg-R 转换为 RGB。"
    }
  },
  block_pred_enable: {
    label: "block_pred_enable",
    pps: "PPS4[5] (1 bit)",
    description: {
      en: "0 = BP is not used to code any groups within the picture.\n1 = Decoder shall select between BP and MMAP, using the method defined in Section 6.4.4.1.",
      zh: "0 = 图片内的任何组都不使用块预测 (BP) 编码。\n1 = 解码器应使用第 6.4.4.1 节中定义的方法在 BP 和 MMAP 之间进行选择。"
    }
  },
  pic_height: {
    label: "pic_height",
    pps: "PPS6[7:0] (High) | PPS7[7:0] (Low) (16 bits)",
    description: {
      en: "Picture size, in units of pixels. pic_height is the number of pixel rows within the raster. pic_height and pic_width should be close to integer multiples of slice_height and slice_width, respectively.",
      zh: "图片大小，以像素为单位。pic_height 是光栅内的像素行数。pic_width 是光栅内的像素列数。pic_height 和 pic_width 应分别接近 slice_height 和 slice_width 的整数倍。"
    }
  },
  pic_width: {
    label: "pic_width",
    pps: "PPS8[7:0] (High) | PPS9[7:0] (Low) (16 bits)",
    description: {
      en: "Picture size, in units of pixels. pic_width is the number of pixel columns within the raster. pic_height and pic_width should be close to integer multiples of slice_height and slice_width, respectively.",
      zh: "图片大小，以像素为单位。pic_width 是光栅内的像素列数。pic_height 和 pic_width 应分别接近 slice_height 和 slice_width 的整数倍。"
    }
  },
  slice_height: {
    label: "slice_height",
    pps: "PPS10[7:0] (High) | PPS11[7:0] (Low) (16 bits)",
    description: {
      en: "Size of each slice, in units of pixels. All slices that comprise a single picture have an identical size. If the pic_height is not evenly divisible by the slice_height, lines consisting of midpoint-valued samples are added to the bottommost slice(s) so that these slices are the same height as the other slices.\nslice_height shall be a multiple of 2 when native_420 = 1.",
      zh: "每个切片的大小，以像素为单位。构成单张图片的所有切片具有相同的大小。如果 pic_height 不能被 slice_height 整除，则由中点值样本组成的行将被添加到最底部的切片中，以便这些切片与其他切片高度相同。\n当 native_420 = 1 时，slice_height 应为 2 的倍数。"
    }
  },
  slice_width: {
    label: "slice_width",
    pps: "PPS12[7:0] (High) | PPS13[7:0] (Low) (16 bits)",
    description: {
      en: "Size of each slice, in units of pixels. All slices that comprise a single picture have an identical size. If the pic_width is not evenly divisible by the slice_width, the rightmost column of pixels is replicated to pad the rightmost slices to be the same width as the other slices. The transport allocates transmission time for transmitting the compressed bits that correspond to any replicated pixels.\nslice_width shall be a multiple of 2 when simple_422, native_422, or native_420 = 1.",
      zh: "每个切片的大小，以像素为单位。构成单张图片的所有切片具有相同的大小。如果 pic_width 不能被 slice_width 整除，则复制最右边的像素列以填充最右边的切片，使其与其他切片宽度相同。传输层分配传输时间用于传输对应于任何复制像素的压缩位。\n当 simple_422、native_422 或 native_420 = 1 时，slice_width 应为 2 的倍数。"
    }
  },
  slice_chunk_size: {
    label: "chunk_size",
    pps: "PPS14[7:0] (High) | PPS15[7:0] (Low) (16 bits)",
    description: {
      en: "Size, in units of bytes, of the chunks that are used for slice multiplexing (see Section 4.2.2). Maximum chunks size when vbr_enable = 1 (VBR mode).\nValue shall be programmed as follows:\n• When native_422 = 0 and native_420 = 0: ceil(bits_per_pixel * slice_width / 8) bytes\n• When native_422 or native_420 = 1: ceil(bits_per_pixel * (slice_width >> 1) / 8) bytes",
      zh: "用于切片复用的块的大小，以字节为单位（参见第 4.2.2 节）。当 vbr_enable = 1 (VBR 模式) 时的最大块大小。\n值应编程如下：\n• 当 native_422 = 0 且 native_420 = 0 时：ceil(bits_per_pixel * slice_width / 8) 字节\n• 当 native_422 或 native_420 = 1 时：ceil(bits_per_pixel * (slice_width >> 1) / 8) 字节"
    }
  },
  initial_xmit_delay: {
    label: "initial_xmit_delay",
    pps: "PPS16[1:0] (High) | PPS17[7:0] (Low) (10 bits)",
    description: {
      en: "Initial transmission delay. Number of pixel times that the encoder waits before transmitting data from its rate buffer.\nWhen native_422 or native_420 = 1, the units are container pixel times.",
      zh: "初始传输延迟。编码器在从其速率缓冲器传输数据之前等待的像素时间数。\n当 native_422 或 native_420 = 1 时，单位是容器像素时间。"
    }
  },
  initial_dec_delay: {
    label: "initial_dec_delay",
    pps: "PPS18[7:0] (High) | PPS19[7:0] (Low) (16 bits)",
    description: {
      en: "Initial decoding delay. Number of pixel times that the decoder accumulates data in its rate buffer before starting to decode and output pixels.\nWhen native_422 or native_420 = 1, the units are container pixel times.",
      zh: "初始解码延迟。解码器在开始解码和输出像素之前在其速率缓冲器中累积数据的像素时间数。\n当 native_422 或 native_420 = 1 时，单位是容器像素时间。"
    }
  },
  initial_scale_value: {
    label: "initial_scale_value",
    pps: "PPS21[5:0] (6 bits)",
    description: {
      en: "Initial rcXformScale factor value used at the start of a slice (see Section 6.8.2).",
      zh: "在切片开始时使用的初始 rcXformScale 因子值（参见第 6.8.2 节）。"
    }
  },
  scale_increment_interval: {
    label: "scale_increment_interval",
    pps: "PPS22[7:0] (High) | PPS23[7:0] (Low) (16 bits)",
    description: {
      en: "Number of group times between increments of the rcXformScale factor at the end of a slice (see Section 6.8.2).",
      zh: "切片末尾 rcXformScale 因子增量之间的组时间数（参见第 6.8.2 节）。"
    }
  },
  scale_decrement_interval: {
    label: "scale_decrement_interval",
    pps: "PPS24[3:0] (High) | PPS25[7:0] (Low) (12 bits)",
    description: {
      en: "Number of group times between decrements of the rcXformScale factor at the start of a slice (see Section 6.8.2).",
      zh: "切片开始时 rcXformScale 因子减量之间的组时间数（参见第 6.8.2 节）。"
    }
  },
  first_line_bpg_offset: {
    label: "first_line_bpg_offset",
    pps: "PPS27[4:0] (5 bits)",
    description: {
      en: "Number of additional bits that are allocated for each group on the first line of a slice.",
      zh: "为切片第一行上的每个组分配的额外位数。"
    }
  },
  nfl_bpg_offset: {
    label: "nfl_bpg_offset",
    pps: "PPS28[7:0] (High) | PPS29[7:0] (Low) (16 bits)",
    description: {
      en: "Number of bits (including fractional bits) that are de-allocated for each group, for groups after the first line of a slice. If the first line has an additional bit budget, the additional bits that are allocated come out of the budget for coding the remainder of the slice. Therefore, the value shall be programmed to first_line_bpg_offset / (slice_height – 1), and then rounded up to 16 fractional bits.",
      zh: "为切片第一行之后的组取消分配的位数（包括小数位）。如果第一行有额外的位预算，则分配的额外位来自于编码切片其余部分的预算。因此，该值应编程为 first_line_bpg_offset / (slice_height – 1)，然后向上舍入到 16 位小数位。"
    }
  },
  slice_bpg_offset: {
    label: "slice_bpg_offset",
    pps: "PPS30[7:0] (High) | PPS31[7:0] (Low) (16 bits)",
    description: {
      en: "Number of bits (including fractional bits) that are de-allocated for each group to enforce the slice constraint (i.e., the final buffer model fullness cannot exceed the initial transmission delay times bits per group), while allowing a programmable initial_offset. If the initial rate control (RC) model condition is not completely full, the difference between the initial RC model offset and size (initial_offset and rc_model_size, respectively) shall be accounted for. The slice_bpg_offset parameter provides a means to resolve this difference. This parameter also allows the RC algorithm to account for bits that might be lost to SSM at the end of a slice. The value shall be programmed to (rc_model_size – initial_offset + numExtraMuxBits) / groupsTotal, and then rounded up to 16 fractional bits. numExtraMuxBits and groupsTotal are described in Table E-1.",
      zh: "为每个组取消分配的位数（包括小数位），以强制执行切片约束（即，最终缓冲区模型填充度不能超过初始传输延迟乘以每组位数），同时允许可编程的 initial_offset。如果初始速率控制 (RC) 模型条件未完全填满，则应考虑初始 RC 模型偏移和大小（分别为 initial_offset 和 rc_model_size）之间的差异。slice_bpg_offset 参数提供了一种解决此差异的方法。此参数还允许 RC 算法考虑切片末尾可能因 SSM 而丢失的位。该值应编程为 (rc_model_size – initial_offset + numExtraMuxBits) / groupsTotal，然后向上舍入到 16 位小数位。numExtraMuxBits 和 groupsTotal 在表 E-1 中描述。"
    }
  },
  initial_offset: {
    label: "initial_offset",
    pps: "PPS32[7:0] (High) | PPS33[7:0] (Low) (16 bits)",
    description: {
      en: "Initial value for rcXformOffset, which is initial_offset – rc_model_size at the start of a slice (see Section 6.8.2).",
      zh: "rcXformOffset 的初始值，在切片开始时为 initial_offset – rc_model_size（参见第 6.8.2 节）。"
    }
  },
  final_offset: {
    label: "final_offset",
    pps: "PPS34[7:0] (High) | PPS35[7:0] (Low) (16 bits)",
    description: {
      en: "Maximum end-of-slice value for rcXformOffset, which is final_offset – rc_model_size (see Section 6.8.2). To ensure HRD compliance, the final_offset parameter value shall be equal to rc_model_size – initial_xmit_delay * bits_per_pixel + numExtraMuxBits. numExtraMuxBits is described in Table E-1.",
      zh: "rcXformOffset 的最大切片结束值，即 final_offset – rc_model_size（参见第 6.8.2 节）。为确保 HRD 合规性，final_offset 参数值应等于 rc_model_size – initial_xmit_delay * bits_per_pixel + numExtraMuxBits。numExtraMuxBits 在表 E-1 中描述。"
    }
  },
  flatness_min_qp: {
    label: "flatness_min_qp",
    pps: "PPS36[4:0] (5 bits)",
    description: {
      en: "Minimum QP at which flatness is signaled and the flatness QP is adjusted.",
      zh: "发出平坦度信号并调整平坦度 QP 的最小 QP。"
    }
  },
  flatness_max_qp: {
    label: "flatness_max_qp",
    pps: "PPS37[4:0] (5 bits)",
    description: {
      en: "Maximum QP at which flatness is signaled and the flatness QP is adjusted.",
      zh: "发出平坦度信号并调整平坦度 QP 的最大 QP。"
    }
  },
  rc_model_size: {
    label: "rc_model_size",
    pps: "PPS38[7:0] (High) | PPS39[7:0] (Low) (16 bits)",
    description: {
      en: "Number of bits within the “RC model,” which is defined in Section 6.8.2.",
      zh: "“RC 模型”中的位数，定义见第 6.8.2 节。"
    }
  },
  rc_edge_factor: {
    label: "rc_edge_factor",
    pps: "PPS40[3:0] (4 bits)",
    description: {
      en: "Compared to the ratio of current activity vs. previous activity to determine the presence of an “edge,” which in turn determines whether the QP is incremented in the short-term RC (see Section 6.8.4). (Here, activity is a measure of the hypothetical number of bits that might have been needed to code a unit, had the size prediction been perfect.)",
      zh: "与当前活动与先前活动的比率进行比较，以确定是否存在“边缘”，进而确定是否在短期 RC 中增加 QP（参见第 6.8.4 节）。（此处，活动是对如果大小预测完美则编码单元可能需要的假设位数的度量。）"
    }
  },
  rc_quant_incr_limit0: {
    label: "rc_quant_incr_limit0",
    pps: "PPS41[4:0] (5 bits)",
    description: {
      en: "QP threshold that is used in the short-term RC (see Section 6.8.4).",
      zh: "短期 RC 中使用的 QP 阈值（参见第 6.8.4 节）。"
    }
  },
  rc_quant_incr_limit1: {
    label: "rc_quant_incr_limit1",
    pps: "PPS42[4:0] (5 bits)",
    description: {
      en: "QP threshold that is used in the short-term RC (see Section 6.8.4).",
      zh: "短期 RC 中使用的 QP 阈值（参见第 6.8.4 节）。"
    }
  },
  rc_tgt_offset_high: {
    label: "rc_tgt_offset_hi",
    pps: "PPS43[7:4] (4 bits)",
    description: {
      en: "Upper end of the variability range around the target bits per group that is allowed by the short-term RC (see Section 6.8.4).",
      zh: "短期 RC 允许的每组目标位周围的可变范围上限（参见第 6.8.4 节）。"
    }
  },
  rc_tgt_offset_low: {
    label: "rc_tgt_offset_lo",
    pps: "PPS43[3:0] (4 bits)",
    description: {
      en: "Lower end of the variability range around the target bits per group that is allowed by the short-term RC (see Section 6.8.4).",
      zh: "短期 RC 允许的每组目标位周围的可变范围下限（参见第 6.8.4 节）。"
    }
  },
  native_420: {
    label: "native_420",
    pps: "PPS88[1] (1 bit)",
    description: {
      en: "native_420 = 0 when any of the following conditions exist:\n• dsc_version_minor = 1\n• simple_422 or native_422 = 1\n0 = Native 4:2:0 mode is not used.\n1 = Native 4:2:0 mode is used.",
      zh: "当存在以下任何条件时，native_420 = 0：\n• dsc_version_minor = 1\n• simple_422 或 native_422 = 1\n0 = 不使用原生 4:2:0 模式。\n1 = 使用原生 4:2:0 模式。"
    }
  },
  native_422: {
    label: "native_422",
    pps: "PPS88[0] (1 bit)",
    description: {
      en: "native_422 = 0 when any of the following conditions exist:\n• dsc_version_minor = 1\n• simple_422 or native_420 = 1\n0 = Native 4:2:2 mode is not used.\n1 = Native 4:2:2 mode is used.",
      zh: "当存在以下任何条件时，native_422 = 0：\n• dsc_version_minor = 1\n• simple_422 或 native_420 = 1\n0 = 不使用原生 4:2:2 模式。\n1 = 使用原生 4:2:2 模式。"
    }
  },
  second_line_bpg_offset: {
    label: "second_line_bpg_offset",
    pps: "PPS89[4:0] (5 bits)",
    description: {
      en: "Additional bits/group budget for the second line of a slice in Native 4:2:0 mode (see Section 6.8.2).\nsecond_line_bpg_offset = 0 when either of the following conditions exist:\n• dsc_version_minor = 1\n• native_420 = 0",
      zh: "原生 4:2:0 模式下切片第二行的每组附加位预算（参见第 6.8.2 节）。\n当存在以下任一条件时，second_line_bpg_offset = 0：\n• dsc_version_minor = 1\n• native_420 = 0"
    }
  },
  nsl_bpg_offset: {
    label: "nsl_bpg_offset",
    pps: "PPS90[7:0] (High) | PPS91[7:0] (Low) (16 bits)",
    description: {
      en: "Number of bits (including fractional bits) that are de-allocated for each group that is not in the second line of a slice. If the second line has an additional bit budget, the additional bits that are allocated shall come out of the budget for coding the remainder of the slice. Therefore, the value shall be programmed to second_line_bpg_offset / (slice_height – 1), and then rounded up to 16 fractional bits.\nnsl_bpg_offset = 0 when either of the following conditions exist:\n• dsc_version_minor = 1\n• native_420 = 0",
      zh: "为不在切片第二行中的每个组取消分配的位数（包括小数位）。如果第二行有额外的位预算，则分配的额外位应来自编码切片其余部分的预算。因此，该值应编程为 second_line_bpg_offset / (slice_height – 1)，然后向上舍入到 16 位小数位。\n当存在以下任一条件时，nsl_bpg_offset = 0：\n• dsc_version_minor = 1\n• native_420 = 0"
    }
  },
  second_line_offset_adj: {
    label: "second_line_offset_adj",
    pps: "PPS92[7:0] (High) | PPS93[7:0] (Low) (16 bits)",
    description: {
      en: "Used as an offset adjustment for the second line in Native 4:2:0 mode (see Section 6.8.2).\nsecond_line_offset_adj = 0 when either of the following conditions exist:\n• dsc_version_minor = 1\n• native_420 = 0",
      zh: "用作原生 4:2:0 模式下第二行的偏移调整（参见第 6.8.2 节）。\n当存在以下任一条件时，second_line_offset_adj = 0：\n• dsc_version_minor = 1\n• native_420 = 0"
    }
  },
  rc_buf_thresh: {
    label: "rc_buf_thresh",
    pps: "PPS44 - PPS57",
    description: {
      en: "Thresholds in the “RC model” for the 15 ranges defined by 14 thresholds (0 through 13, respectively) (see Section 6.8.3). Six 0s are appended to the lsb of each threshold value.",
      zh: "“RC 模型”中由 14 个阈值（分别为 0 到 13）定义的 15 个范围的阈值（参见第 6.8.3 节）。每个阈值的最低有效位附加六个 0。"
    }
  },
  rc_range_params: {
    label: "rc_range_parameters",
    pps: "PPS58 - PPS87",
    description: {
      en: "Parameters that correspond to each of the 15 ranges (0 through 14, respectively) within the RC model (see Section 6.8.3). Table 4-3 defines the specific parameters for each range.",
      zh: "对应于 RC 模型内 15 个范围（分别为 0 到 14）的参数（参见第 6.8.3 节）。表 4-3 定义了每个范围的具体参数。"
    }
  }
};

// Helpers for array fields
for (let i = 0; i < 14; i++) {
  DSC_FIELD_DEFINITIONS[`rc_buf_thresh[${i}]`] = {
    label: `rc_buf_thresh[${i}]`,
    pps: `PPS${44 + i}[7:0] (8 bits)`,
    description: {
      en: `Thresholds in the “RC model” for the 15 ranges defined by 14 thresholds (0 through 13, respectively) (see Section 6.8.3). Six 0s are appended to the lsb of each threshold value.`,
      zh: `“RC 模型”中由 14 个阈值（分别为 0 到 13）定义的 15 个范围的阈值（参见第 6.8.3 节）。每个阈值的最低有效位附加六个 0。`
    }
  };
}

for (let i = 0; i < 15; i++) {
  DSC_FIELD_DEFINITIONS[`rc_range_params[${i}]`] = {
    label: `rc_range_params[${i}]`,
    pps: `PPS${58 + i * 2}[7:0] (High) | PPS${59 + i * 2}[7:0] (Low)`,
    description: {
      en: `Parameters for Range ${i}.\n\nrange_min_qp: Minimum allowable QP when the RC model has tracked to the current range.\nrange_max_qp: Maximum allowable QP when the RC model has tracked to the current range.\nrange_bpg_offset: Target bpg adjustment that is performed when the RC model has tracked to the current range.`,
      zh: `范围 ${i} 的参数。\n\nrange_min_qp: RC 模型跟踪到当前范围时允许的最小 QP。\nrange_max_qp: RC 模型跟踪到当前范围时允许的最大 QP。\nrange_bpg_offset: RC 模型跟踪到当前范围时执行的目标 bpg 调整。`
    }
  };
}
