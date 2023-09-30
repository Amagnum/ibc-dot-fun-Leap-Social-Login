import { ArrowDownTrayIcon } from "@heroicons/react/20/solid";
import React from "react";

import { ModalStep } from "../../constant";

export default function SLAccountCreationDone({
  currentStep,
  recoveryShare,
}: {
  currentStep: ModalStep;
  recoveryShare?: string;
}) {
  const handleDownload = () => {
    if (!recoveryShare) return;
    const element = document.createElement("a");
    const file = new Blob([recoveryShare], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "recovery.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  // const { onCopy, hasCopied } = useClipboard(recoveryShare ?? '')

  if (currentStep !== ModalStep.ACCOUNT_CREATION_DONE) {
    return null;
  }

  return (
    <>
      <div
        style={{ marginBottom: "1.5rem" }}
        className="overflow-scroll mt-6 flex w-full flex-col items-center justify-center px-6"
      >
        <div className="flex flex-row gap-2">
          <div className="mb-6 text-md font-bold text-black-100 dark:text-white-100">
            Save Your Recovery Share
          </div>
          <button onClick={handleDownload}>
            <ArrowDownTrayIcon className="w-6 h-6" />
          </button>
        </div>
        <div
          style={{
            display: "flex",
            overflow: "auto",
            padding: "1.5rem",
            flexDirection: "row",
            flexWrap: "wrap",
            fontWeight: 700,
            textOverflow: "ellipsis",
            wordBreak: "break-all",
          }}
        >
          {recoveryShare ?? ""}
        </div>
      </div>
    </>
  );
}
