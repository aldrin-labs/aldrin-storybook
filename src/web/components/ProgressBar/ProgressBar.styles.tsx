import styled from 'styled-components'
import LinearProgress from '@material-ui/core/LinearProgress';

export const LinearProgressCustom = styled(LinearProgress)`
    background-color: ${props => props.color || 'black'};
    border-radius: 10px;
    height: ${props => props.height};
`