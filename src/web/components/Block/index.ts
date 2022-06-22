import { COLORS } from '@variables/variables'
import styled from 'styled-components'

export interface BlockProps {
  $backgroundImage?: string
  icon?: string
  inner?: boolean
  margin?: string
}

export const Block = styled.div<BlockProps>`
  background: ${(props: BlockProps) =>
    props.inner ? props.theme.colors.gray5 : props.theme.colors.gray6};
  border-radius: 12px;
  margin: ${(props) => props.margin || '8px'};
  height: 100%;
  position: relative;
  ${({ $backgroundImage: backgroundImage }: BlockProps) =>
    backgroundImage
      ? `
    background-image: url(${backgroundImage});
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
  `
      : ''}
  ${({ icon }: BlockProps) =>
    icon
      ? `
  &:before {
    content: "";
    position: absolute;
    right: 5%;
    top: 5%;
    height: 90%;
    width: 90%;
    background: url(${icon}) right center no-repeat;
  }
  `
      : ''}
`

export const GreenBlock = styled(Block)`
  background: ${(props) => props.theme.colors.green8};
`

export interface TitleProps {
  color?: string
  margin?: string
}

export const BlockTitle = styled.h2`
  font-weight: 600;
  font-size: 1.25em;
  line-height: 150%;
  margin: 0.25rem 0 0.5rem;
  color: ${(props) => props.theme.colors.gray0};
`

export const BlockSubtitle = styled.h3<TitleProps>`
  font-weight: 600;
  font-size: 0.8em;
  line-height: 130%;
  margin: ${(props) => props.margin || '0 0 1rem'};
  white-space: nowrap;
  color: ${(props: TitleProps) => props.color || COLORS.hint};
`

export interface BlockContentProps {
  border?: true
}

export const BlockContent = styled.div<BlockContentProps>`
  padding: 16px 20px;
  position: relative;
  overflow: hidden;
  ${(props) =>
    props.border ? `border-bottom: 1px solid ${props.theme.colors.gray10}` : ''}
`

export const BlockContentStretched = styled(BlockContent)`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
`
