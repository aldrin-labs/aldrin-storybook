import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

type IButtonProps = {
  active: boolean
}

export const AllocationWrapper = styled.div`
  background: #fff;
  box-sizing: border-box;
  box-shadow: 0px 0px 8px rgba(10, 19, 43, 0.1);
  border-radius: 1.5rem;
  padding-bottom: 1.6rem;
  border: 1px solid #e0e5ec;
  min-height: 100%;
  position: relative;
`

// 46rem
// @media only screen and (min-width: 1025px) and (max-width: 1400px) {
//   height: 54rem;
// }

// @media only screen and (min-width: 2245px) and (max-width: 2560px) {
//   height: 54rem;
// }

export const AllocationHeader = styled.div`
  background-color: #f2f4f6;
  text-align: center;
  padding: 1.2rem 0;
  border-radius: 1.5rem 1.5rem 0 0;

  h3 {
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 1.28rem;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin: 0;
  }
`

export const ChartWrapper = styled.div`
  padding: 3rem 0;
`

export const AllocationButtons = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 1.6rem 0 2.88rem 0;
`

export const ModeButton = styled.button`
  background-color: ${(props: IButtonProps) =>
    props.active ? '#165BE0' : '#FFFFFF'};
  color: ${(props: IButtonProps) => (props.active ? '#FFFFFF' : '#7284A0')};
  border: 1px solid
    ${(props: IButtonProps) => (props.active ? '#FFFFFF' : '#E0E5EC')};
  cursor: pointer;
  border-radius: 1.5rem;
  text-transform: uppercase;
  padding: 0.32rem 1.5rem;
  font-family: DM Sans;
  font-style: normal;
  font-size: 0.88rem;
  font-weight: bold;
  letter-spacing: 1px;
  white-space: nowrap;
  outline: none;

  @media (max-width: 1400px) {
    font-size: 0.65rem;
  }

  @media (min-width: 1921px) {
    padding: 0.32rem 1rem;
  }
`
export const NavBarLink = styled(NavLink)`
  font-family: DM Sans;
  text-transform: uppercase;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.2rem;
  padding-left: 2rem;
  padding-right: 2rem;
  height: 100%;
  display: flex;
  align-items: center;
`

export const Link = styled(NavLink)`
  border: ${(props) => props.border || '1px solid #165be0'};
  border-radius: 8px;

  display: block;
  width: fit-content;

  margin: 2rem auto 0;
  padding: 0.52rem 1.2rem;

  color: #165be0;

  text-decoration: none;
  text-transform: ${(props) => props.textTransform || 'uppercase'};

  font-family: 'DM Sans', sans-serif;
  font-style: normal;
  font-weight: bold;
  font-size: 1.2rem;
  line-height: 109.6%;
  letter-spacing: 1px;

  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
`
