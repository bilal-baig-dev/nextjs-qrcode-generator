export interface QRPreset {
  id: string;
  name: string;
  pattern: {
    type: "dots" | "squares" | "rounded" | "classy" | "elegant" | "custom";
    moduleSize?: number;
    cornerRadius?: number;
    customPattern?: string;
  };
  cornerStyle: {
    type: "square" | "rounded" | "dots" | "extraRound";
    radius?: number;
  };
  frame?: {
    style: "classic" | "rounded" | "shadow" | "minimal" | "none";
    padding?: number;
  };
}
export interface QRCodeOptions {
  text: string;
  width?: number;
  height?: number;
  colorDark?: string;
  colorLight?: string;
  preset: QRPreset;
  margin?: number;
  frameText?: string;
  frameColor?: string;
  errorCorrectionLevel?: "L" | "M" | "Q" | "H";
}
