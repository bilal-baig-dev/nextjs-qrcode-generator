import { QRCodeOptions } from "@/interface";
import { useEffect, useRef } from "react";
interface QRCodeDisplayProps {
  options: QRCodeOptions;
  svgString: string;
}
export const QRCodeDisplay = ({ options, svgString }: QRCodeDisplayProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = svgString;
      // Add frame text if specified
      if (options.frameText) {
        const textElement = document.createElement("div");
        textElement.className = "text-center mt-2 font-medium";
        textElement.style.color = options.frameColor || "#000000";
        textElement.textContent = options.frameText;
        containerRef.current.appendChild(textElement);
      }
    }
  }, [svgString, options.frameText, options.frameColor]);
  return <div ref={containerRef} className="qr-code-container flex flex-col items-center justify-center p-4" />;
};
