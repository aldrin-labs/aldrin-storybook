import styled from 'styled-components'
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt'

export const LastTradeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: calc(100% - 1.6rem);
  height: 4rem;
  margin: 0 0.8rem;
  text-align: center;
  background: #f2f4f6;
  border-radius: 0.75rem;
`

export const LastTradeValue = styled.div`
  letter-spacing: 0.075rem;
  color: ${({ fall }: { fall: boolean }) => (fall ? '#DD6956' : '#29AC80')};
  font-size: 1.6rem;
`

export const LastTradePrice = styled.span`
  font-size: 1rem;
  font-weight: bold;
  color: #16253d;
  letter-spacing: 0.075rem;
  padding-left: 1rem;
`

export const ArrowIcon = styled(ArrowRightAltIcon)`
  width: 0.5rem;
  height: 2rem;
`
