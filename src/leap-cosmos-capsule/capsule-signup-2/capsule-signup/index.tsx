/* eslint-disable react-hooks/exhaustive-deps */
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
import { CheckBadgeIcon } from "@heroicons/react/20/solid";
import Capsule from "@usecapsule/web-sdk";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { LoaderWhiteAnimation } from "./components/loader/LoaderWhite";

import SLAccountCreationDone from "./components/SL-account-creation-done";
import SLBiometricVerification from "./components/SL-biometric-verification";
import SLCreatingNewWallet from "./components/SL-creating-new-wallet";
import SLEmailVerification from "./components/SL-email-verification";
import SLHeader from "./components/SL-header";
import { ModalStep } from "./constant";
import useCapsule from "./hooks/useCapsule";

export type CapsuleModalProps = {
  capsule: Capsule;
  showCapsuleModal: boolean;
  setShowCapsuleModal: (v: boolean) => void;
  onAfterLoginSuccessful: () => void;
};

export default function CustomCapsuleModalView({
  capsule,
  showCapsuleModal,
  setShowCapsuleModal,
  onAfterLoginSuccessful,
}: CapsuleModalProps) {
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
    setError,
    percentKeygenDone,
    onReset,

    recoveryShare,
  } = useCapsule(capsule, showCapsuleModal);

  const disableContinue = false;

  console.log(percentKeygenDone);
  const [loading, setLoading] = useState(false);

  const onButtonClick = async () => {
    setLoading(true)
    switch (currentStep) {
      case ModalStep.EMAIL_COLLECTION:
        await onEmailEnter();
        setLoading(false)
        break;
      case ModalStep.VERIFICATION_CODE: // Wallet not created
        await verifyCode();
        setLoading(false)
        break;
      case ModalStep.ACCOUNT_CREATION_DONE: // Wallet not created
        setCurrentStep(ModalStep.LOGIN_DONE);
        setLoading(false)
        break;
      case ModalStep.LOGIN_DONE:
        onReset();
        setLoading(false)
        location.reload();
        break;
      default:
        setLoading(false)
        break;
    }
  }

  // initialize wallet in leap repo
  useEffect(() => {
    console.log(currentStep, capsule);
    setError("");
    setLoading(false)
    if (currentStep === ModalStep.LOGIN_DONE) {
      const fn = async () => {
        if (await capsule.isSessionActive()) {
          if (Object.values(capsule.getWallets()).length > 0) {
            setLoading(false)
            setShowCapsuleModal(false);
            onAfterLoginSuccessful();
            onReset();
          }
        }
      };
      fn();

      if (typeof window !== "undefined") {
        const d = document.documentElement;
        d.classList.remove(...["dark", "light"]);
        d.classList.add("dark");
      }
    }
  }, [currentStep]);

  // console.log('RMB',randomBytes(32).toString('hex'))
  return (
    <ChakraProvider theme={newTheme} cssVarsRoot={undefined}>
      <Modal
        blockScrollOnMount={false}
        isCentered={true}
        isOpen={showCapsuleModal}
        size={'md'}
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
          borderRadius={"3xl"}
          // w="500px"
          // h="200px"
          // maxW={`${Math.min(584, window?.innerWidth ?? 584)}px`}
          // maxH="544px"
          // minH="544px"
        >
          {/* <div className="relative z-[3]"> */}
          <ModalBody>
            <VStack>
              <div className="mt-1" />
              <SLHeader
                currentStep={currentStep}
                onBack={() => {
                  onReset();
                }}
                onClose={() => {
                  setShowCapsuleModal(false);
                  if (currentStep === ModalStep.ACCOUNT_CREATION_DONE) {
                    setCurrentStep(ModalStep.LOGIN_DONE);
                  }
                }}
              />
              <div
                style={{
                  flexGrow: 1,
                  borderTopWidth: "1px",
                  borderColor: "#E5E7EB",
                  width: "100%",
                }}
              />

              {(currentStep === ModalStep.LOGIN_DONE ||
                currentStep === ModalStep.ACCOUNT_CREATION_DONE) && (
                <div className="m-6 flex flex-row items-center justify-center">
                  <CheckBadgeIcon
                    style={{ height: "50%", width: "50%", color: "#059669" }}
                  />
                </div>
              )}

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
                capsule={capsule}
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

              { error && <div
                style={{
                  marginBottom: "1.5rem",
                  fontWeight: 700,
                  color: "#DC2626",
                }}
              >
                {error}
              </div>
              } 
              {currentStep !== ModalStep.BIOMETRIC_CREATION &&
                currentStep !== ModalStep.BIOMETRIC_LOGIN && (
                  <button
                    style={
                      loading ? {
                        display: "flex",
                        bottom: "0",
                        margin: "1.5rem",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "1.5rem",
                        borderStyle: "none",
                        height: "3rem",
                        fontSize: "0.875rem",
                        lineHeight: "1.25rem",
                        color: "#FFF",
                        fontWeight: 700,
                        backgroundColor: "#05966980",
                        width: "90%",
                      } : 
                      {
                      display: "flex",
                      bottom: "0",
                      margin: "1.5rem",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "1.5rem",
                      borderStyle: "none",
                      height: "3rem",
                      fontSize: "0.875rem",
                      lineHeight: "1.25rem",
                      color: "#FFF",
                      fontWeight: 700,
                      backgroundColor: "#059669",
                      cursor: "pointer",
                      width: "90%",
                    }}
                    className={classNames(
                      "bottom-0 m-6 flex h-12 w-[calc(100%-50px)] cursor-pointer flex-row items-center justify-center rounded-3xl border-none bg-green-600 text-sm font-bold text-white-100 lg:!text-md",
                      { "opacity-30": disableContinue },
                    )}
                    onClick={onButtonClick}
                    disabled={loading}
                  >
                    {
                      loading ? <LoaderWhiteAnimation color="white"/> : 'Continue'
                    }
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
