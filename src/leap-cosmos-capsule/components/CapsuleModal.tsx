
import { CapsuleModal } from '@usecapsule/web-sdk/dist/modal/CapsuleModal'
import React, { useEffect } from 'react'
import { useRecoilState } from 'recoil'

import { showCapsuleModelState } from '../atoms'
import { newTheme } from './theme'

export default function CapsuleModalView({capsule}:{capsule: unknown}) {
  const [showCapsuleModal, setShowCapsuleModal] = useRecoilState(showCapsuleModelState)

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
            location.reload();
        }
      }}
      appName={'LEAP_WALLET'}
    />
  )
}
