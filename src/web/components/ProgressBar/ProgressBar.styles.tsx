import styled from 'styled-components'
import LinearProgress from '@material-ui/core/LinearProgress';

export const LinearProgressCustom = styled(LinearProgress)`
    color: ${props => props.color || 'black'};
    height: ${props => props.height};
`