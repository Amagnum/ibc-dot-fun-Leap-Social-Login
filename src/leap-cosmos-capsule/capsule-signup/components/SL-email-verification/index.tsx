import 'react-loading-skeleton/dist/skeleton.css'

import classNames from 'classnames'
import React from 'react'

import { ModalStep } from '../../constant'

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
  emailInput: string
  setEmailInput: (s: string) => void
  otpInput: string
  setOtpInput: (s: string) => void
  currentStep: ModalStep

  resendCode: () => void
  isResendButtonDisabled: boolean
  resendStatus: string
}) {
  if (currentStep !== ModalStep.EMAIL_COLLECTION && currentStep !== ModalStep.VERIFICATION_CODE) {
    return null
  }

  return (
    <>
      <div className='mb-6 mt-6 flex w-full flex-col items-start justify-center px-6'>
        <div className='mb-3 text-md font-bold text-black-100 dark:text-white-100'>Your email</div>
        <div className='flex w-full flex-row items-center justify-start gap-1 rounded-full bg-gray-100 px-4 py-3 dark:bg-gray-900'>
          <input
            value={emailInput}
            placeholder='Enter your email'
            onChange={(e) => setEmailInput(e.target.value)}
            className='w-[calc(100%-28px)] bg-gray-100 text-md font-bold text-black-100 outline-none placeholder:font-medium dark:bg-gray-900 dark:text-white-100 placeholder:dark:text-gray-500'
          />
        </div>
      </div>

      {currentStep === ModalStep.VERIFICATION_CODE && (
        <div className=' flex w-full flex-col items-start justify-center px-6'>
          <div className='mb-3 text-md font-bold text-black-100 dark:text-white-100'>
            Verification code
          </div>
          <div className='flex w-full flex-row items-center justify-start gap-1 rounded-full bg-gray-100 px-4 py-3 dark:bg-gray-900'>
            <input
              value={otpInput}
              placeholder='_ _ _ _ _ _'
              type='password'
              onChange={(e) => setOtpInput(e.target.value)}
              className='w-[calc(100%-28px)] bg-gray-100 text-md  font-bold text-black-100 outline-none placeholder:font-medium dark:bg-gray-900 dark:text-white-100 placeholder:dark:text-gray-500'
            />
          </div>
          <button
            disabled={isResendButtonDisabled}
            onClick={resendCode}
            className={classNames(
              'm-2 mb-3 flex w-full justify-end text-right text-sm text-black-100 dark:text-white-100',
              { 'opacity-30': isResendButtonDisabled },
            )}
          >
            {resendStatus}
          </button>
        </div>
      )}
    </>
  )
}
