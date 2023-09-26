import 'react-loading-skeleton/dist/skeleton.css'

import React from 'react'
import { ModalStep } from 'leap-cosmos-capsule/capsule-signup/constant'

import { CircularProgress } from '@chakra-ui/react'
import { LoaderAnimation } from 'components/loader/Loader'
import { Colors } from 'theme/colors'

export default function SLCreatingNewWallet({
  currentStep,
  percentKeygenDone,
}: {
  currentStep: ModalStep
  percentKeygenDone: number
}) {
  if (
    currentStep !== ModalStep.AWAITING_WALLET_CREATION &&
    currentStep !== ModalStep.AWAITING_WALLET_CREATION_AFTER_LOGIN
  ) {
    return null
  }

  return (
    <>
      <div className='mb-6 mt-6 flex w-full flex-col items-center justify-center px-6'>
        <div className='mb-6 text-md font-bold text-black-100 dark:text-white-100'>
          Creating Wallet
        </div>
        <div className='overflow-hidden rounded-3xl px-6 pb-6'>
          <div className='overflow-hidden rounded-[30px]'>
            <LoaderAnimation color={Colors.white100} />
            <CircularProgress
              size='60px'
              thickness='10px'
              color={'brand.content'}
              trackColor={'brand.contentSecondary'}
              value={percentKeygenDone}
            />
          </div>
        </div>
      </div>
    </>
  )
}
