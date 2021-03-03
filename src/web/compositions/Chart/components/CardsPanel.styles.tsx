import styled from "styled-components";

export const Row = styled.div`
  display: flex;
  flex-wrap: ${(props) => props.wrap || "wrap"};
  justify-content: ${(props) => props.justify || "center"};
  flex-direction: ${(props) => props.direction || "row"};
  align-items: ${(props) => props.align || "center"};
  text-align: center;
`;

export const Text16Green = styled.span`
  font-family: Monaco;
  font-style: normal;
  font-weight: normal;
  font-size: 1.6rem;
  color: #cce7d4;
  text-shadow: 0px 0px 4px rgba(226, 253, 231, 0.49);
`

export const Text12Green = styled(Text16Green)`
  font-size: 1.2rem;
`

export const TextGreenWithGradient = styled(Text16Green)`
  background: linear-gradient(180deg, #e2fde7 0%, #afcda3 100%);
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
`

export const NavbarText16GreenWithGradient = styled(TextGreenWithGradient)`
  text-shadow: 0px 0px 4px rgba(237, 255, 236, 0.7);
`
