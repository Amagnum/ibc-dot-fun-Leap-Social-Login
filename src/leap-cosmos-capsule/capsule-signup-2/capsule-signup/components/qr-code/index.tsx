export * from './qr-code'

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

import { Images } from "../../../../capsule-signup/images";


const fQRCodeStyling = async (options: Options): Promise<QRCodeStyling | null> => {
  //Only do this on the client
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const QRCodeStylingLib = await import('qr-code-styling').then(m=>m.default);
    const qrCodeStyling: QRCodeStyling = new QRCodeStylingLib(options)
    return qrCodeStyling
  }
  return null
}

export type QrCodeProps = {
  data: string;
  height: number;
  width: number;
} & Options;

function QrCode(QrCodeProps: QrCodeProps): ReactElement {
  const options = {
    width: QrCodeProps.width,
    height: QrCodeProps.height,
    image: Images.Misc.LeapQrIcon,
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

  // const qrCode = useQRCodeStyling(options)
  const [qrCode, setQrCode] = useState<QRCodeStyling | null>();

  useEffect(() => {
    const fn = async () => {
      if (qrCode) return;
      const finalC = await fQRCodeStyling(options);
      console.log("finalC", finalC);
      setQrCode(finalC);
    };
    fn();
  });

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      qrCode?.append(ref.current);
    }
  }, [qrCode, ref]);

  useEffect(() => {
    qrCode?.update({ data: QrCodeProps.data })
  }, [QrCodeProps, qrCode])

  console.log('qrCode', qrCode)

  return (
    <>
      {qrCode && (
        <div
          ref={ref}
          style={{
            height: QrCodeProps.height,
            width: QrCodeProps.width,
          }}
        />
      )}
    </>
  );
}

export default QrCode;
