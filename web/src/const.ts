export const TEXT_EDITOR_DEFAULTS = {
  text: "",
  fontSize: 17,
  isBold: true,
  isUppercase: false,
  isVertical: false,
  repeatCount: 20,
} as const;

export const BARCODE_EDITOR_DEFAULTS = {
  barcodeData: "123456",
} as const;

export const LABEL_SIZE_DEFAULTS = {
  width: 40,
  height: 14,
} as const;
