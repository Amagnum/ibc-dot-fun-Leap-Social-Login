import {QrCode} from '@leapwallet/leap-ui'
import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'

import { capsuleState } from '@/leap-cosmos-capsule/atoms'

import { ModalStep } from '../../constant'
import { LoaderAnimation } from '../loader/Loader'


export default function SLBiometricVerification({
  currentStep,
  webAuthURLForCreate,
  webAuthURLForLogin,
}: {
  currentStep: ModalStep
  webAuthURLForCreate?: string
  webAuthURLForLogin?: string
}) {
  const hotLink =
    currentStep === ModalStep.BIOMETRIC_CREATION
      ? webAuthURLForCreate ?? ''
      : webAuthURLForLogin ?? ''

  const [shortLoginLink, setShortLoginLink] = useState<string>('')
  const [capsule, setCapsule] = useRecoilState(capsuleState)

  useEffect(() => {
    if (currentStep !== ModalStep.BIOMETRIC_LOGIN) {
      setShortLoginLink('')
    }
    async function shortenUrl() {
      const upload = await import("@usecapsule/web-sdk/dist/transmission/transmissionUtils").then(m=>m.upload);
      const url = await upload(hotLink, capsule)
      // @ts-ignore
      setShortLoginLink(capsule.getShortUrl(url))
    }
    // eslint-disable-next-line no-constant-condition
    if (hotLink) {
      shortenUrl()
    } else {
      setShortLoginLink(hotLink ?? '')
    }
  }, [hotLink])

  if (
    (currentStep !== ModalStep.BIOMETRIC_CREATION && currentStep !== ModalStep.BIOMETRIC_LOGIN) ||
    !hotLink ||
    shortLoginLink === ''
  ) {
    return (
      <>
        {hotLink ? (
          <div className='mb-6 mt-6 flex w-full flex-col items-center justify-center px-6'>
            <div className='overflow-hidden rounded-3xl px-6 pb-6'>
              <div className='overflow-hidden rounded-[30px]'>
                <LoaderAnimation color={'#FFFFFF'} />
              </div>
            </div>
          </div>
        ) : null}
      </>
    )
  }

  return (
    <>
      {currentStep === ModalStep.BIOMETRIC_CREATION && (
        <div className='mb-6 mt-6 flex w-full flex-col items-center justify-center px-6'>
          <div className='mb-6 text-md font-bold text-black-100 dark:text-white-100'>
            Create a passkey to authenticate without having to enter your username or password by
            scanning/clicking the QR code below.
          </div>
          <div
            className='overflow-hidden rounded-3xl px-6 pb-6'
            onClick={() => {
              window.open(shortLoginLink, 'popup', 'popup=true,width=400,height=500')
            }}
          >
            <div className='overflow-hidden rounded-[30px]'>
              {shortLoginLink && <QrCode data={shortLoginLink ?? ''} height={350} width={350} />}
            </div>
          </div>
        </div>
      )}

      {currentStep === ModalStep.BIOMETRIC_LOGIN && (
        <div className='mb-6 mt-6 flex w-full flex-col items-center justify-center px-6'>
          <div className='mb-6 text-md font-bold text-black-100 dark:text-white-100'>
            Verify with a passkey to authenticate without having to enter your username or password
            by scanning/clicking the QR code below.
          </div>
          <div className='overflow-hidden rounded-3xl px-6 pb-6'>
            <div
              className='overflow-hidden rounded-[30px]'
              onClick={() => {
                window.open(shortLoginLink, 'popup', 'popup=true,width=400,height=500')
              }}
            >
              {shortLoginLink && <QrCode data={shortLoginLink ?? ''} height={350} width={350} />}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
