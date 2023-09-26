import { ClientNotExistError } from '@cosmos-kit/core'

import { CosmosCapsule } from './types'

interface LeapWindow {
  ethereum?: CosmosCapsule
}

/**
 * Detect if the wallet injecting the ethereum object is Flask.
 *
 * @returns True if the MetaMask version is Flask, false otherwise.
 */
export const isFlask = async () => {
  const provider = (window as LeapWindow).ethereum

  try {
    const clientVersion = await provider?.request({
      method: 'web3_clientVersion',
    })

    const isFlaskDetected = (clientVersion as string[])?.includes('flask')

    return Boolean(provider && isFlaskDetected)
  } catch {
    return false
  }
}

export const getCosmosSnapFromExtension: () => Promise<CosmosCapsule | undefined> = async () => {
  if (typeof window === 'undefined') {
    return void 0
  }

  const cosmosSnap = (window as LeapWindow).ethereum
  const isFlaskDetected = await isFlask()

  if (cosmosSnap && isFlaskDetected) {
    return cosmosSnap
  }

  if (document.readyState === 'complete') {
    if (cosmosSnap && isFlaskDetected) {
      return cosmosSnap
    } else {
      throw ClientNotExistError
    }
  }

  //TODO: make connection model popup 

  return new Promise((resolve, reject) => {
    const documentStateChange = (event: Event) => {
      if (event.target && (event.target as Document).readyState === 'complete') {
        if (cosmosSnap && isFlaskDetected) {
          resolve(cosmosSnap)
        } else {
          reject(ClientNotExistError.message)
        }
        document.removeEventListener('readystatechange', documentStateChange)
      }
    }

    document.addEventListener('readystatechange', documentStateChange)
  })
}
