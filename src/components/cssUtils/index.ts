import styled from 'styled-components'
import { fade } from '@material-ui/core/styles/colorManipulator'
import { ILegendContainer } from './types'

export const customAquaScrollBar = `
  &::-webkit-scrollbar {
    width: 3px;
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(45, 49, 54, 0.1);
  }

  &::-webkit-scrollbar-thumb {
    background: #4ed8da;
  }`

//  https://stackoverflow.com/questions/21646738/convert-hex-to-rgba
export const hexToRgbAWithOpacity = (hex, opacity) => {
  var c
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('')
    if (c.length == 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]]
    }
    c = '0x' + c.join('')
    return (
      'rgba(' +
      [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') +
      `,${opacity})`
    )
  }
  throw new Error('Bad Hex')
}

export const LegendContainer = styled.div`
  border-radius: 5px;
  position: absolute;
  background-color: ${(props: ILegendContainer) => fade(props.backgroundColor, 0.8)};
  top: 0px;
  left: 10%;
  color: ${(props: ILegendContainer) => props.textColor};
  transition: ${(props: ILegendContainer) => props.transition};
`
