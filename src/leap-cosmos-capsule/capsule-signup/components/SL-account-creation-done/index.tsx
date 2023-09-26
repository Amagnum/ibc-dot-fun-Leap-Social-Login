import 'react-loading-skeleton/dist/skeleton.css'

import React, { useEffect, useState } from 'react'
import { ModalStep } from 'leap-cosmos-capsule/capsule-signup/constant'

import { CircularProgress, useClipboard } from '@chakra-ui/react'
import Capsule from '@usecapsule/web-sdk'
import CopyWalletAddressButton from 'components/buttons/copyWalletAddress'
import { Images } from 'images'
import { Colors } from 'theme/colors'

export default function SLAccountCreationDone({
  currentStep,
  recoveryShare,
}: {
  currentStep: ModalStep
  recoveryShare?: string
}) {
  const handleDownload = () => {
    if (!recoveryShare) return
    const element = document.createElement('a')
    const file = new Blob([recoveryShare], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = 'recovery.txt'
    document.body.appendChild(element) // Required for this to work in FireFox
    element.click()
  }

  const { onCopy, hasCopied } = useClipboard(recoveryShare ?? '')

  if (currentStep !== ModalStep.ACCOUNT_CREATION_DONE) {
    return null
  }

  return (
    <>
      <div className='mb-6 mt-6 flex w-full flex-col items-center justify-center px-6'>
        <div className='mb-6 text-md font-bold text-black-100 dark:text-white-100'>
          Save Your Recovery Phrase
        </div>
        <div className='mb-6 flex flex-row flex-wrap text-ellipsis break-all p-6 text-md font-bold text-black-100 dark:text-white-100'>
          {recoveryShare ?? ''}
        </div>
        <CopyWalletAddressButton
          copyIcon={Images.Activity.Copy}
          textOnCopied={'Copied'}
          color={Colors.green600}
          title='Copy'
          onCopy={async () => {
            // copyAddressRef.current?.click()
            onCopy()
            await navigator.clipboard.writeText(recoveryShare ?? '')
          }}
        />
      </div>
    </>
  )
}
