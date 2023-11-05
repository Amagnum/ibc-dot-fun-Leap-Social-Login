
import Capsule from '@usecapsule/web-sdk'
import { CapsuleModal } from '@usecapsule/web-sdk/dist/modal/CapsuleModal'
import React, { useEffect } from 'react'
import { useRecoilState } from 'recoil'

import { newTheme } from './theme'

export default function CapsuleModalView({capsule, showCapsuleModal, setShowCapsuleModal}:{capsule: Capsule, showCapsuleModal: boolean, setShowCapsuleModal: Function}) {

  useEffect(()=>{
    const fn = async()=>{
      if(!(await capsule?.isSessionActive())){
        //
      }
    }
    fn();
  })


  return (
      !capsule?(<></>): <CapsuleModal
      theme={newTheme}
      capsule={capsule}
      isOpen={showCapsuleModal}
      onClose={function (): void {
        if(Object.values(capsule?.getWallets()).length>0){
            setShowCapsuleModal(false)
        }
      }}
      appName={'LEAP_WALLET'}
    />
  )
}
