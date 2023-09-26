import { Wallet } from '@cosmos-kit/core'

export const LeapCapsuleInfo: Wallet = {
  name: 'leap-cosmos-capsule',
  prettyName: 'Connect with Google',
  logo: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg',
  mode: 'extension',
  mobileDisabled: false,
  rejectMessage: {
    source: 'Request rejected',
  },
  downloads: [
    {
      device: 'desktop',
      browser: 'chrome',
      link: 'https://chrome.google.com/webstore/detail/metamask-flask-developmen/ljfoeinjpaedjfecbmggjgodbgkmjkjk',
    },
  ],
  connectEventNamesOnWindow: ['leap_keystorechange'],
}
