import Capsule from "@usecapsule/web-sdk";
// import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";

import QRCode from "@/leap-cosmos-capsule/capsule-signup-2/capsule-signup/components/qr-code/qr-code"

import { ModalStep } from "../../constant";
import { LoaderAnimation } from "../loader/Loader";


export default function SLBiometricVerification({
  capsule,
  currentStep,
  webAuthURLForCreate,
  webAuthURLForLogin,
}: {
  capsule: Capsule;
  currentStep: ModalStep;
  webAuthURLForCreate?: string;
  webAuthURLForLogin?: string;
}) {
  const hotLink =
    currentStep === ModalStep.BIOMETRIC_CREATION
      ? webAuthURLForCreate ?? ""
      : webAuthURLForLogin ?? "";

  const [shortLoginLink, setShortLoginLink] = useState<string>("");

  useEffect(() => {
    if (currentStep !== ModalStep.BIOMETRIC_LOGIN) {
      setShortLoginLink("");
    }
    async function shortenUrl() {
      const upload = await import(
        "@usecapsule/web-sdk/dist/transmission/transmissionUtils"
      ).then((m) => m.upload);
      const url = await upload(hotLink, capsule.ctx.capsuleClient);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      setShortLoginLink(capsule?.getShortUrl(url));
    }
    // eslint-disable-next-line no-constant-condition
    if (hotLink) {
      shortenUrl();
    } else {
      setShortLoginLink(hotLink ?? "");
    }
  }, [hotLink]);

  if (
    (currentStep !== ModalStep.BIOMETRIC_CREATION &&
      currentStep !== ModalStep.BIOMETRIC_LOGIN) ||
    !hotLink ||
    shortLoginLink === ""
  ) {
    return (
      <>
        {hotLink ? (
          <div className="mb-6 mt-6 flex w-full h-full flex-col items-center justify-center">
            <div className="overflow-hidden rounded-3xl px-6 pb-6">
              <div className="overflow-hidden rounded-[30px]">
                <LoaderAnimation color={"#FFFFFF"} />
              </div>
            </div>
          </div>
        ) : null}
      </>
    );
  }

  console.log(shortLoginLink);

  return (
    <>
      {currentStep === ModalStep.BIOMETRIC_CREATION && (
        <div className="mb-6 mt-6 flex w-full flex-col items-center justify-center ">
          <div className="mb-6 text-sm font-bold text-gray-800">
            Create a passkey to authenticate without having to enter your
            username or password by scanning/clicking the QR code below.
          </div>
          <div
            className="overflow-hidden rounded-3xl px-6 pb-6"
            onClick={() => {
              window.open(
                shortLoginLink,
                "popup",
                "popup=true,width=400,height=500",
              );
            }}
          >
            <div className="overflow-hidden rounded-[30px]">
              {shortLoginLink && (
                <QRCode data={shortLoginLink ?? ""} height={350} width={350} />
              )}
            </div>
          </div>
        </div>
      )}

      {currentStep === ModalStep.BIOMETRIC_LOGIN && (
        <div className="mb-6 mt-6 flex w-full flex-col items-center justify-center">
          <div className="mb-6 text-sm font-bold text-gray-800">
            Verify with a passkey to authenticate without having to enter your
            username or password by scanning/clicking the QR code below.
          </div>
          <div className="overflow-hidden z-20 rounded-3xl px-6 pb-6">
            <div
              className="overflow-hidden rounded-[30px] hover:cursor-pointer"
              onClick={() => {
                window.open(
                  shortLoginLink,
                  "popup",
                  "popup=true,width=400,height=500",
                );
              }}
            >
              {shortLoginLink && (
                <QRCode data={shortLoginLink ?? ""} height={350} width={350} />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
