/* eslint-disable no-unused-vars */
import 'react-loading-skeleton/dist/skeleton.css'

import React, { useEffect } from 'react'
import { capsule } from 'leap-cosmos-capsule/snap'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { showCapsuleModelState } from 'atoms/capsule'
import { userApprovedPromptsState } from 'atoms/login'
import { useInitAccounts } from 'hooks/wallet/useGetAccounts'
import { useWallet, useWalletClient } from '@cosmos-kit/react'
import HorizontalDivider from 'components/divider'
import SLHeader from './components/SL-header'
import classNames from 'classnames'
import SLEmailVerification from './components/SL-email-verification'
import { ModalStep } from './constant'
import useCapsule from './hooks/useCapsule'
import SLBiometricVerification from './components/SL-biometric-verification'
import SLCreatingNewWallet from './components/SL-creating-new-wallet'
import SLAccountCreationDone from './components/SL-account-creation-done'
const STORAGE_PREFIX = '@CAPSULE/'

export default function CustomCapsuleModalView() {
  const [showCapsuleModal, setShowCapsuleModal] = useRecoilState(showCapsuleModelState)
  const setUserApprovedPrompts = useSetRecoilState(userApprovedPromptsState)
  const { client: walletClient, status, message } = useWalletClient()
  const { mainWallet: { walletStatus, walletName } = {}, mainWallet } = useWallet()
  const initAccounts = useInitAccounts()

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
  } = useCapsule()

  const disableContinue = false

  console.log(percentKeygenDone)

  // initialize wallet in leap repo
  useEffect(() => {
    console.log(currentStep, capsule, walletClient)
    if (currentStep === ModalStep.LOGIN_DONE) {
      const fn = async () => {
        if (await capsule.isSessionActive()) {
          if (Object.values(capsule.getWallets()).length > 0 && walletClient) {
            setShowCapsuleModal(false)
            setUserApprovedPrompts(true)
            initAccounts(
              walletClient,
              walletName,
              async () => {
                //
              },
              {
                always: () => {
                  //
                },
              },
            )
          }
        }
      }
      fn()
    }
  }, [currentStep])

  return (
    <div className='relative z-[3]'>
      {showCapsuleModal && (
        <div
          className={
            'fixed left-0 top-0 z-[2] flex h-screen w-screen items-center justify-center bg-black-80 p-2 dark:bg-black-80'
          }
          onClick={() => {
            setShowCapsuleModal(false)
            if (currentStep === ModalStep.ACCOUNT_CREATION_DONE) {
              setCurrentStep(ModalStep.LOGIN_DONE)
            }
          }}
        >
          <div
            className={'z-[3] flex max-w-full flex-col items-center justify-center'}
            onClick={(event) => event.stopPropagation()}
          >
            <div className='absolute z-[2] h-[544px] max-h-[623px] w-[584px] max-w-[90vw] overflow-y-scroll rounded-3xl bg-gray-50 dark:bg-gray-950'>
              <SLHeader
                onClose={() => {
                  setShowCapsuleModal(false)
                  if (currentStep === ModalStep.ACCOUNT_CREATION_DONE) {
                    setCurrentStep(ModalStep.LOGIN_DONE)
                  }
                }}
              />
              <HorizontalDivider />
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
              <SLAccountCreationDone currentStep={currentStep} recoveryShare={recoveryShare} />

              {(currentStep === ModalStep.LOGIN_DONE ||
                currentStep === ModalStep.ACCOUNT_CREATION_DONE) && (
                <div className='m-6 flex flex-row items-center justify-center'>
                  <div className='material-icons-round text-xxl text-green-500'>check_circle</div>
                </div>
              )}

              <div className='mb-6 text-md font-bold text-red-600 dark:text-red-600'>{error}</div>

              {currentStep !== ModalStep.BIOMETRIC_CREATION &&
                currentStep !== ModalStep.BIOMETRIC_LOGIN && (
                  <button
                    className={classNames(
                      'absolute bottom-0 m-6 mt-[97px] flex h-12 w-[calc(100%-50px)] cursor-pointer flex-row items-center justify-center rounded-3xl border-none bg-green-500 text-sm font-bold dark:text-white-100 lg:!text-md',
                      { 'opacity-30': disableContinue },
                    )}
                    onClick={async () => {
                      switch (currentStep) {
                        case ModalStep.EMAIL_COLLECTION:
                          await onEmailEnter()
                          break
                        case ModalStep.VERIFICATION_CODE: // Wallet not created
                          await verifyCode()
                          break
                        case ModalStep.ACCOUNT_CREATION_DONE: // Wallet not created
                          setCurrentStep(ModalStep.LOGIN_DONE)
                          break
                        case ModalStep.LOGIN_DONE:
                          location.reload()
                          break
                        default:
                          break
                      }
                    }}
                    disabled={disableContinue}
                  >
                    {'Continue'}
                  </button>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
