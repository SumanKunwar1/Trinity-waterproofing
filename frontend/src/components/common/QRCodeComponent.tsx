import React from "react";
import QRCode from "react-qr-code";

interface QRCodeProps {
  value?: string; // The URL or value to encode in the QR code
  size?: number; // The size of the QR code (default is 128px)
  fgColor?: string; // The color of the QR code (default is black)
  bgColor?: string; // The background color of the QR code (default is white)
}

const QRCodeComponent: React.FC<QRCodeProps> = ({
  value,
  size = 128,
  fgColor = "#000000",
  bgColor = "#ffffff",
}) => {
  // Check if the value is valid
  const isValidValue = value && value.trim() !== "";

  return (
    <div style={{ textAlign: "center", margin: "20px" }}>
      {isValidValue ? (
        <QRCode
          value={value}
          size={size}
          fgColor={fgColor}
          bgColor={bgColor}
          style={{ width: size, height: size }}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default QRCodeComponent;
