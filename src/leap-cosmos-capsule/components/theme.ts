import { extendTheme, Theme } from '@chakra-ui/react'

export const lightColors = {
  background: '#dfdfe2',
  backgroundLight: '#c2c2cb',
  button: '#4484bd',
  text: '#000000',
  buttonText: '#dfdfe2',
  selectedButton: '#325576',
  frameColor: '#0a243b',
}

export const darkColors = {
  background: '#031e2a',
  backgroundLight: '#062734',
  button: '#21465c',
  text: '#c3c8cb',
  buttonText: '#c3c8cb',
  selectedButton: '#294a61',
  frameColor: '#c3c8cb',
}

export const themeFactory = (colors: typeof lightColors) =>
  extendTheme({
    colors: {
      brand: {
        ...colors,
      },
    },
    components: {
      Text: {
        defaultProps: {
          color: 'brand.text',
        },
        baseStyle: {
          textColor: 'brand.text',
        },
      },
      Button: {
        defaultProps: {
          // colorScheme: 'teal',
          backgroundColor: 'brand.buttonText',
        },
        baseStyle: {
          background: 'brand.button',
          backgroundColor: 'brand.button',
          _hover: {
            background: 'brand.selectedButton',
            backgroundColor: 'brand.selectedButton',
          },

          color: 'brand.buttonText',
          textColor: 'brand.text',
        },
      },
      Input: {
        baseStyle: {
          borderColor: 'brand.frameColor',
          textColor: 'brand.text',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '5px',
        },
      },
    },
  }) as Theme

export const lightTheme = themeFactory(lightColors)
export const darkTheme = themeFactory(darkColors)

export const newTheme = extendTheme({
  colors: {
    brand: {
      background: '#080B0F',
      content: '#FFFFFF',
      dimmed: '#E5E5E5',
      dimmed2: '#C8C8C8',
      text: '#E5E5E5',
      addressColor: '#E5E5E5',
      contentSecondary: '#39393A',
    },
  },
  components: {
    Text: {
      baseStyle: {
        color: 'brand.text',
        fontSize: 'm',
      },
      defaultProps: {
        fontSize: '40px',
      },
    },
  },
  fontSizes: {
    l: '24px',
    ml: '22px',
    m: '16px',
    s: '14px',
    xs: '12px',
  },
}) as Theme
