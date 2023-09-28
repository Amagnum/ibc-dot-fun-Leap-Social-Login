import classNames from "classnames";
import React from "react";

import { ModalStep } from "../../constant";

export default function SLEmailVerification({
  currentStep,
  emailInput,
  setEmailInput,
  otpInput,
  setOtpInput,
  isResendButtonDisabled,
  resendCode,
  resendStatus,
}: {
  emailInput: string;
  setEmailInput: (s: string) => void;
  otpInput: string;
  setOtpInput: (s: string) => void;
  currentStep: ModalStep;

  resendCode: () => void;
  isResendButtonDisabled: boolean;
  resendStatus: string;
}) {
  if (
    currentStep !== ModalStep.EMAIL_COLLECTION &&
    currentStep !== ModalStep.VERIFICATION_CODE
  ) {
    return null;
  }

  return (
    <>
      <div className="mb-6 mt-4 flex w-full flex-col items-start justify-center">
        <div className="mb-3 text-md font-bold text-black-100 dark:text-gray-200">
          Your email
        </div>
        <div
          style={{
            backgroundColor: "rgb(245, 245, 245)",
            marginTop: 5,
          }}
          className="p-4  flex w-full flex-row items-center justify-start gap-1 rounded-3xl bg-gray-900"
        >
          <input
            value={emailInput}
            style={{
              backgroundColor: "rgb(245, 245, 245)",
            }}
            placeholder="Enter your email"
            onChange={(e) => setEmailInput(e.target.value)}
            className="text-md w-full font-bold text-black-100 outline-none placeholder:font-medium bg-gray-200 dark:text-white-100 placeholder:dark:text-gray-500"
          />
        </div>
      </div>

      {currentStep === ModalStep.VERIFICATION_CODE && (
        <div className=" flex w-full flex-col items-start justify-center px-6">
          <div className="mb-3 text-md font-bold text-black-100 dark:text-gray-200">
            Verification code
          </div>
          <div
            style={{
              backgroundColor: "rgb(245, 245, 245)",
              marginTop: 5,
            }}
            className="p-4 flex w-full flex-row items-center justify-start gap-1 rounded-3xl bg-gray-900"
          >
            <input
              style={{
                backgroundColor: "rgb(245, 245, 245)",
              }}
              value={otpInput}
              placeholder="_ _ _ _ _ _"
              type="password"
              onChange={(e) => setOtpInput(e.target.value)}
              className="w-full  text-md  font-bold text-black-100 outline-none placeholder:font-medium bg-gray-200 dark:text-white-100 placeholder:dark:text-gray-500"
            />
          </div>
          <div style={{marginTop: 8}} className="flex flex-row justify-end mt-2">
            <div className="flex-1 "></div>
          <button
            disabled={isResendButtonDisabled}
            onClick={resendCode}
            className={classNames(
              "m-2 mb-3 flex justify-end text-right text-sm text-black-100 dark:text-white-100",
              {
                "opacity-30": isResendButtonDisabled,
              },
            )}
          >
            {resendStatus}
          </button>
          </div>
        </div>
      )}
    </>
  );
}
