import React from 'react'
import styled from 'styled-components'

export const Title = styled(
  ({
    width,
    fontFamily,
    fontSize,
    color,
    textAlign,
    margin,
    style,
    maxFont,
    ...props
  }) => <span {...props} />,
)`
  width: ${(props) => props.width || 'auto'};
  font-family: ${(props) => props.fontFamily || 'Avenir Next Medium'};
  font-style: normal;
  font-weight: normal;
  font-size: ${(props) => props.fontSize || '1.4rem'};
  text-align: center;
  color: ${(props) => props.color || '#ecf0f3'};
  text-align: ${(props) => props.textAlign || 'center'};
  margin: ${(props) => props.margin || '0'};
  ${(props) => props.style};

  @media (max-width: 540px) {
    font-size: ${(props) => props.maxFont || '1.6rem'};
  }
`;

export const ColorText = styled.div`
  width: ${(props) => props.width || '100%'};
  height: ${(props) => props.height || '4.5rem'};
  margin: ${(props) => props.margin || '0'};
  font-size: 1.2rem;
  font-family: Avenir Next Medium;
  display: flex;
  color: #fff;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background: ${(props) => props.background || '#383b45'};
  border-radius: ${(props) => props.radius || '1.5rem'};
  display: flex;
  justify-content: ${(props) => props.justify || 'space-evenly'};
  flex-direction: ${(props) => props.direction || 'row'};
  align-items: ${(props) => props.align || 'center'};

  @media (max-width: 540px) {
    padding: ${(props) => (props.needBackground ? '0 2rem 0 2rem' : 'auto')};
    background: ${(props) => (props.needBackground ? 'transparent' : 'auto')};
    font-size: 1.5rem;
  }
`;