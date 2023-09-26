import 'react-loading-skeleton/dist/skeleton.css'

import React from 'react'
import Text from 'components/text'
import { Buttons } from '@leapwallet/leap-ui'

export default function SLHeader({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className='flex w-full flex-row items-center justify-between p-6'>
        <div className='text-lg font-bold text-black-100 dark:text-white-100'>
          Do you have a wallet?
        </div>
        <div className='flex flex-row'>
          <Text size='sm'>powered by capsule</Text>
          <Buttons.Cancel onClick={onClose} />
        </div>
      </div>
    </>
  )
}
