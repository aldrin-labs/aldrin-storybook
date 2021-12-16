import styled from 'styled-components'
import { COLORS } from '@variables/variables'

export interface BlockProps {
  $backgroundImage?: string
  icon?: string
  inner?: boolean
}

export const Block = styled.div<BlockProps>`
  box-shadow: 0px 0px 48px rgba(0, 0, 0, 0.55);
  background: ${(props: BlockProps) =>
    props.inner ? COLORS.background : COLORS.blockBackground};
  border-radius: 12px;
  margin: 8px;
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

export interface TitleProps {
  color?: string
}

export const BlockTitle = styled.h2`
  font-weight: 600;
  font-size: 1.25em;
  line-height: 150%;
  margin: 0.25rem 0 0.5rem;
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
    props.border ? `border-bottom: 1px solid ${COLORS.background}` : ''}
`

export const BlockContentStretched = styled(BlockContent)`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
`
