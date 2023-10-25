import React from "react";
import {  useClipboard, useToast } from "@chakra-ui/react";
import { ModalStep } from "../../constant";
import CopySVG from "../Icon/Copy.svg";
import Image from "next/image";

export default function SLAccountCreationDone({
  currentStep,
  recoveryShare,
}: {
  currentStep: ModalStep;
  recoveryShare?: string;
}) {
  const { onCopy } = useClipboard(recoveryShare || '');
  const toast = useToast();
  const handleDownload = () => {
    if (!recoveryShare) return;
    const element = document.createElement("a");
    const file = new Blob([recoveryShare], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "recovery.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  if (currentStep !== ModalStep.ACCOUNT_CREATION_DONE) {
    return null;
  }
  

  return (
    <>
      <div
        className="overflow-scroll mt-6 flex w-full flex-col items-center justify-center px-6"
      >
        <div className="flex flex-row gap-2" style={{
            color: "#29A874",
            fontSize: '24px',
            fontWeight: 700,
          }} >
            Your account is now ready
        </div>
        <div style={{ color: '#858585', marginTop: '5px'}} className="flex-1 gap-2 text-left w-full font-thin text-sm">
          {`Keep this recovery key safe! It's your backup to retrieve your account if you ever lose access to this device.`}
        </div>
        <div
          className="text-xs font-light"
          style={{
            marginTop: '10px',
            display: "flex",
            overflow: "auto",
            padding: "1em",
            textOverflow: "ellipsis",
            wordBreak: "break-all",
            background: '#E8E8E8',
            borderRadius: '8px'
          }}
        >
          <div>
            {recoveryShare ?? ""}
          </div>
          <div onClick={() => { 
              onCopy(); 
              toast({
                duration: 5000,
                title: "Copied",
              }); 
            }} 
            className="pl-5" style={{ fontSize: '12px', width: '60px', paddingLeft: '10px', alignSelf: 'center', cursor: 'pointer'}}
          >
              <Image alt="copy" src={CopySVG} />
          </div>
        </div>
        <button
          style={{
            display: "flex",
            bottom: "0",
            marginTop: "20px",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "1.5rem",
            borderStyle: "none",
            height: "3rem",
            fontSize: "16px",
            lineHeight: "1.25rem",
            color: "#059669",
            fontWeight: 700,
            border: "2px solid #059669",
            cursor: "pointer",
            width: "100%",
          }}
          className={"bottom-0 m-6 flex h-12 w-[calc(100%-50px)] cursor-pointer flex-row items-center justify-center rounded-3xl border-none bg-green-600 text-sm font-bold text-white-100 lg:!text-md"}
          onClick={handleDownload}
        >
          Download recovery share
        </button>
      </div>
    </>
  );
}
