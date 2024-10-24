"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QR_PRESETS } from "@/lib/constants";
import { QRCodeOptions } from "@/interface";
import { generateQRCode } from "@/lib/qr-generator";
import { QRCodeDisplay } from "./QRCodeDisplay";

export default function QRCodeGenerator() {
  const [options, setOptions] = useState<QRCodeOptions>({
    text: "",
    width: 300,
    colorDark: "#000000",
    colorLight: "#FFFFFF",
    preset: QR_PRESETS[0],
    margin: 4,
    frameText: "SCAN ME",
    frameColor: "#000000",
    errorCorrectionLevel: "H",
  });
  const [svgString, setSvgString] = useState<string>("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const updateQRCode = async () => {
      if (!options.text) return;
      setLoading(true);
      try {
        const svg = await generateQRCode(options);
        setSvgString(svg);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    updateQRCode();
  }, [options]);
  const handleDownload = (format: "svg" | "png") => {
    if (!svgString) return;
    if (format === "svg") {
      const blob = new Blob([svgString], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "qrcode.svg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      // Convert SVG to PNG
      const svg = document.querySelector(".qr-code-container svg");
      if (!svg) return;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.onload = () => {
        canvas.width = options.width || 300;
        canvas.height = options.width || 300;
        ctx?.drawImage(img, 0, 0);
        const pngUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = pngUrl;
        link.download = "qrcode.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
      img.src = "data:image/svg+xml;base64," + btoa(svgString);
    }
  };
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>QR Code Generator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="flex justify-center">
            {loading ? <div className="animate-pulse bg-gray-200 w-[300px] h-[300px]" /> : <QRCodeDisplay options={options} svgString={svgString} />}
          </div>
          <div className="grid gap-4">
            <div>
              <Label>URL</Label>
              <Input
                value={options.text}
                onChange={(e) => setOptions((prev) => ({ ...prev, text: e.target.value }))}
                placeholder="Enter URL to encode"
              />
            </div>
            <div>
              <Label>Style Preset</Label>
              <Select
                onValueChange={(value) => {
                  const preset = QR_PRESETS.find((p) => p.id === value);
                  if (preset) {
                    setOptions((prev) => ({ ...prev, preset }));
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  {QR_PRESETS.map((preset) => (
                    <SelectItem key={preset.id} value={preset.id}>
                      {preset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Colors</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs">QR Code Color</Label>
                  <Input type="color" value={options.colorDark} onChange={(e) => setOptions((prev) => ({ ...prev, colorDark: e.target.value }))} />
                </div>
                <div>
                  <Label className="text-xs">Background Color</Label>
                  <Input type="color" value={options.colorLight} onChange={(e) => setOptions((prev) => ({ ...prev, colorLight: e.target.value }))} />
                </div>
              </div>
            </div>
            <div>
              <Label>Frame Text</Label>
              <Input
                value={options.frameText}
                onChange={(e) => setOptions((prev) => ({ ...prev, frameText: e.target.value }))}
                placeholder="Enter frame text"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={() => handleDownload("svg")}>Download SVG</Button>
              <Button onClick={() => handleDownload("png")}>Download PNG</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
