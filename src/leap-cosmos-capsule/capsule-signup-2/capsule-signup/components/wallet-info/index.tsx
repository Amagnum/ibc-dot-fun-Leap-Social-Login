/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import {
  ChakraProvider,
  extendTheme,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  useClipboard,
  VStack,
} from "@chakra-ui/react";
import { InformationCircleIcon, XMarkIcon } from "@heroicons/react/20/solid";
import React, { useState } from "react";

import QRCode from "@/leap-cosmos-capsule/capsule-signup-2/capsule-signup/components/qr-code/qr-code";
import PoweredBy from "../powered";
import CopySVG from "../Icon/Copy.svg";
import Image from "next/image";

export type WalletInfoModalProps = {
  address: string;
};

export default function WalletInfoModalView({ address }: WalletInfoModalProps) {
  const [showWalletInfo, setShowWalletInfo] = useState(false);
  const { onCopy, hasCopied } = useClipboard(address);

  return (
    <>
      <button
        onClick={() => {
          setShowWalletInfo(true);
        }}
      >
        <InformationCircleIcon className="w-6 h-6" />
      </button>
      <ChakraProvider theme={newTheme} cssVarsRoot={undefined}>
        <Modal
          blockScrollOnMount={false}
          isCentered={true}
          isOpen={showWalletInfo}
          onClose={() => {
            setShowWalletInfo(false);
          }}
          size={'md'}
        >
          <ModalOverlay />
          <ModalContent
            backgroundColor={"brand.background"}
            borderRadius={"3xl"}
          >
            <ModalBody>
              <VStack>
                <div className="mt-1" />

                <div className="flex w-full flex-row items-center justify-between">
                  <div className="flex flex-row text-center gap-x-2">
                    <div className="text-md font-bold text-black">
                      Your Wallet
                    </div>
                  </div>
                  <div className="flex flex-row text-center items-center">
                    <button
                      onClick={() => {
                        setShowWalletInfo(false);
                      }}
                      className="text-xs text-gray-400 cursor-pointer px-2 ml-2"
                    >
                      <XMarkIcon className="w-6 h-6 cursor-pointer" />
                    </button>
                  </div>
                </div>
                <div
                  style={{
                    flexGrow: 1,
                    borderTopWidth: "1px",
                    borderColor: "#E5E7EB",
                    width: "100%"
                  }}
                />
                <QRCode
                  data={address ?? ""}
                  height={Math.min(350, window?.innerWidth ?? 350)}
                  width={Math.min(350, window?.innerWidth ?? 350)}
                />
                <div style={{ backgroundColor: "#E8E8E8", padding: '10px',justifyContent: "space-between", width: "100%", height: '40px' }} className="flex p-5 font-thin " >
                  <div style={{ fontSize: '12px'}}>
                    {address ?? ""}
                  </div>
                  <div onClick={onCopy} className="pl-5" style={{ fontSize: '12px'}}>
                    {
                      hasCopied ? 'Copied' : <Image alt="copy" src={CopySVG} />
                    }
                  </div>
                </div>
                
                <button
                    style={ 
                      {
                      display: "flex",
                      bottom: "0",
                      margin: "10px",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "1.5rem",
                      borderStyle: "none",
                      height: "3rem",
                      fontSize: "16px",
                      lineHeight: "1.25rem",
                      color: "#FFF",
                      fontWeight: 700,
                      backgroundColor: "#059669",
                      cursor: "pointer",
                      width: "100%",
                    }}
                    onClick={()=>setShowWalletInfo(false)}
                  >
                    Done
                  </button>

                <PoweredBy />
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </ChakraProvider>
    </>
  );
}

export const newTheme = extendTheme({
  colors: {
    brand: {
      background: "#FFF",
      content: "#FFFFFF",
      dimmed: "#E5E5E5",
      dimmed2: "#C8C8C8",
      text: "#E5E5E5",
      addressColor: "#E5E5E5",
      contentSecondary: "#39393A",
    },
  },
  components: {
    Text: {
      baseStyle: {
        color: "brand.text",
        fontSize: "m",
      },
      defaultProps: {
        fontSize: "40px",
      },
    },
  },
  fontSizes: {
    l: "24px",
    ml: "22px",
    m: "16px",
    s: "14px",
    xs: "12px",
  },
});
