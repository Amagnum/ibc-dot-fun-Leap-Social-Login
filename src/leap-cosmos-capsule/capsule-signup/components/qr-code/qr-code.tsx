import QRCodeStyling, {
  CornerDotType,
  CornerSquareType,
  DotType,
  DrawType,
  ErrorCorrectionLevel,
  Mode,
  Options,
  TypeNumber,
} from "qr-code-styling";
import React, { ReactElement, useEffect, useRef, useState } from "react";

export type QrCodeProps = {
  data: string;
  height: number;
  width: number;
} & Options;

function QrCode(QrCodeProps: QrCodeProps): ReactElement {
  const options = {
    width: QrCodeProps.width,
    height: QrCodeProps.height,
    margin: 8,
    type: "svg" as DrawType,
    qrOptions: {
      typeNumber: 0 as TypeNumber,
      mode: "Byte" as Mode,
      errorCorrectionLevel: "Q" as ErrorCorrectionLevel,
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.5,
      margin: 10,
    },
    dotsOptions: {
      color: "#000",
      type: "dots" as DotType,
    },
    backgroundOptions: {
      color: "#FFF",
    },
    cornersSquareOptions: {
      color: "#000",
      type: "dot" as CornerSquareType,
    },
    cornersDotOptions: {
      color: "#000",
      type: "dot" as CornerDotType,
    },
    ...(QrCodeProps as Options),
  } as Options;

  const [qrCode] = useState<QRCodeStyling>(new QRCodeStyling(options));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      qrCode.append(ref.current);
      console.log("appending QR code");
    }
  }, [qrCode, ref]);

  console.log("QR", window, qrCode);

  if (typeof window === "undefined") return <></>;

  return (
      <div
        ref={ref}
        style={{
          height: QrCodeProps.height,
          width: QrCodeProps.width,
        }}
      />
  );
}

export default QrCode;
