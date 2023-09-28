/* eslint-disable no-unused-vars */

import {
  ChakraProvider,
  extendTheme,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  VStack,
} from "@chakra-ui/react";
import { useWalletClient } from "@cosmos-kit/react";
import Capsule from "@usecapsule/web-sdk";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import { showCapsuleModelState } from "../atoms";
import SLAccountCreationDone from "./components/SL-account-creation-done";
import SLBiometricVerification from "./components/SL-biometric-verification";
import SLCreatingNewWallet from "./components/SL-creating-new-wallet";
import SLEmailVerification from "./components/SL-email-verification";
import SLHeader from "./components/SL-header";
import { ModalStep } from "./constant";
import useCapsule from "./hooks/useCapsule";

export default function CustomCapsuleModalView({
  capsule,
}: {
  capsule: Capsule;
}) {
  const [showCapsuleModal, setShowCapsuleModal] = useRecoilState(
    showCapsuleModelState,
  );
  const [CustomCapsuleModalView2, setCustomCapsuleModalView2] =
    useState<unknown>();

  useEffect(() => {
    const fn = async () => {
      const _Component = await import("@leapwallet/leap-ui/dist/components/capsule-signup").then((m) => m.default);
      setCustomCapsuleModalView2(_Component);
    };
    fn();
  });

  return (
    <>
      {!!CustomCapsuleModalView2 && (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        <CustomCapsuleModalView2
          capsule={capsule}
          showCapsuleModal={showCapsuleModal}
          setShowCapsuleModal={setShowCapsuleModal}
        />
      )}
    </>
  );
}

export function CustomCapsuleModalViewXX({ capsule }: { capsule: Capsule }) {
  const [showCapsuleModal, setShowCapsuleModal] = useRecoilState(
    showCapsuleModelState,
  );

  const { client: walletClient } = useWalletClient();

  const {
    setCurrentStep,
    emailInput,
    onEmailEnter,
    currentStep,
    error,
    isResendButtonDisabled,
    otpInput,
    resendStatus,
    resendVerificationCode,
    setEmailInput,
    setOtpInput,
    verifyCode,

    webAuthURLForCreate,
    webAuthURLForLogin,

    percentKeygenDone,

    recoveryShare,
  } = useCapsule();

  const disableContinue = false;

  console.log(percentKeygenDone);

  // initialize wallet in leap repo
  useEffect(() => {
    console.log(currentStep, capsule, walletClient);
    if (currentStep === ModalStep.LOGIN_DONE) {
      const fn = async () => {
        if (await capsule.isSessionActive()) {
          if (Object.values(capsule.getWallets()).length > 0 && walletClient) {
            setShowCapsuleModal(false);
          }
        }
      };
      fn();
    }
  }, [currentStep]);

  return (
    <ChakraProvider theme={newTheme} cssVarsRoot={undefined}>
      <Modal
        blockScrollOnMount={false}
        isCentered={true}
        isOpen={showCapsuleModal}
        onClose={() => {
          setShowCapsuleModal(false);
          if (currentStep === ModalStep.ACCOUNT_CREATION_DONE) {
            setCurrentStep(ModalStep.LOGIN_DONE);
          }
        }}
      >
        <ModalOverlay />
        <ModalContent
          backgroundColor={"brand.background"}
          width="584px"
          height="544px"
        >
          {/* <div className="relative z-[3]"> */}
          <ModalBody>
            <VStack>
              <SLHeader
                onClose={() => {
                  setShowCapsuleModal(false);
                  if (currentStep === ModalStep.ACCOUNT_CREATION_DONE) {
                    setCurrentStep(ModalStep.LOGIN_DONE);
                  }
                }}
              />
              <div className="flex-grow border-t border-2 border-gray-400" />
              <SLEmailVerification
                emailInput={emailInput}
                setEmailInput={setEmailInput}
                otpInput={otpInput}
                setOtpInput={setOtpInput}
                currentStep={currentStep}
                resendCode={resendVerificationCode}
                isResendButtonDisabled={isResendButtonDisabled}
                resendStatus={resendStatus}
              />
              <SLBiometricVerification
                currentStep={currentStep}
                webAuthURLForCreate={webAuthURLForCreate}
                webAuthURLForLogin={webAuthURLForLogin}
              />
              <SLCreatingNewWallet
                currentStep={currentStep}
                percentKeygenDone={percentKeygenDone}
              />
              <SLAccountCreationDone
                currentStep={currentStep}
                recoveryShare={recoveryShare}
              />

              {(currentStep === ModalStep.LOGIN_DONE ||
                currentStep === ModalStep.ACCOUNT_CREATION_DONE) && (
                <div className="m-6 flex flex-row items-center justify-center">
                  <div className="material-icons-round text-xxl text-green-500">
                    check_circle
                  </div>
                </div>
              )}

              <div className="mb-6 text-md font-bold text-red-600 dark:text-red-600">
                {error}
              </div>

              {currentStep !== ModalStep.BIOMETRIC_CREATION &&
                currentStep !== ModalStep.BIOMETRIC_LOGIN && (
                  <button
                    className={classNames(
                      "absolute bottom-0 m-6 mt-[97px] flex h-12 w-[calc(100%-50px)] cursor-pointer flex-row items-center justify-center rounded-3xl border-none bg-green-500 text-sm font-bold dark:text-white-100 lg:!text-md",
                      { "opacity-30": disableContinue },
                    )}
                    onClick={async () => {
                      switch (currentStep) {
                        case ModalStep.EMAIL_COLLECTION:
                          await onEmailEnter();
                          break;
                        case ModalStep.VERIFICATION_CODE: // Wallet not created
                          await verifyCode();
                          break;
                        case ModalStep.ACCOUNT_CREATION_DONE: // Wallet not created
                          setCurrentStep(ModalStep.LOGIN_DONE);
                          break;
                        case ModalStep.LOGIN_DONE:
                          location.reload();
                          break;
                        default:
                          break;
                      }
                    }}
                    disabled={disableContinue}
                  >
                    {"Continue"}
                  </button>
                )}
            </VStack>
          </ModalBody>
          {/* </div> */}
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
}

export const newTheme = extendTheme({
  colors: {
    brand: {
      background: "#080B0F",
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
