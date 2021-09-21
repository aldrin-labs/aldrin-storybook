import styled from 'styled-components'
import { Row } from '@sb/compositions/AnalyticsRoute/index.styles'

export const LoadingScreenWithHintContainer = styled(Row)`
    width: 50%;

    @media (max-width: 600px) {
        width: 75%;
    }
`