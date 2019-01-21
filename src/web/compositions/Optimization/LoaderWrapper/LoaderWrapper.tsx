import React from 'react'
import { Fade } from '@material-ui/core'

import { LoaderInnerWrapper, LoaderWrapper } from '../Optimization.styles'
import { Loading } from '@storybook/components'
import { TypographyWithCustomColor } from '@storybook/styles/StyledComponents/TypographyWithCustomColor'

interface Props {
  textColor?: string
  open?: boolean
}

const LoaderWrapperComponent = ({
  textColor = 'white',
  open = false,
}: Props) => {
  return (
    <Fade in={open} mountOnEnter unmountOnExit>
      <LoaderWrapper>
        <LoaderInnerWrapper>
          <Loading size={94} margin={'0 0 2rem 0'} />{' '}
          <TypographyWithCustomColor textColor={textColor} variant="h6">
            Optimizing portfolio...
          </TypographyWithCustomColor>
          <TypographyWithCustomColor
            style={{ marginTop: '2rem' }}
            textColor={textColor}
            variant="h6"
          >
            We are working on improving the speed of this model
          </TypographyWithCustomColor>
        </LoaderInnerWrapper>
      </LoaderWrapper>
    </Fade>
  )
}

export default LoaderWrapperComponent
