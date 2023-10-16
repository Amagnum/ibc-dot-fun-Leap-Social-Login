/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import {
  Button,
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
          size={'xs'}
        >
          <ModalOverlay />
          <ModalContent
            backgroundColor={"brand.background"}
            borderRadius={"3xl"}
            // w="584px"
            // h="544px"
            // maxW={`${Math.min(584, window?.innerWidth ?? 584)}px`}
            // maxH="544px"
            // minH="544px"
          >
            {/* <div className="relative z-[3]"> */}
            <ModalBody>
              <VStack>
                <div className="mt-1" />

                <div className="flex w-full flex-row items-center justify-between">
                  <div className="flex flex-row text-center gap-x-2">
                    <div className="text-md font-bold text-black">
                      Your Wallet:
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
                    width: "100%",
                  }}
                />

                <Button onClick={onCopy}>
                  {hasCopied ? "Copied!" : "Copy address"}
                </Button>
                <QRCode
                  data={address ?? ""}
                  height={Math.min(350, window?.innerWidth ?? 350)}
                  width={Math.min(350, window?.innerWidth ?? 350)}
                />
              </VStack>
            </ModalBody>
            {/* </div> */}
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
