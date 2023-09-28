
import React, {  } from 'react'

import { ModalStep } from '../../constant'

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

  // const { onCopy, hasCopied } = useClipboard(recoveryShare ?? '')

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
       
      </div>
    </>
  )
}
