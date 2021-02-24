import * as React from 'react'
import { withRouter } from 'react-router-dom'
import { MenuList, Theme } from '@material-ui/core'

import { ENDPOINTS } from '@sb/dexUtils/connection'

import {
  StyledDropdown,
  StyledPaper,
  StyledMenuItem,
} from '@sb/components/Dropdown/Dropdown.styles'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'

import { IProps } from './NetworkDropdown.types'

const WalletStatusButton = ({ connection, theme }: { connection: string, theme: Theme }) => (
  <BtnCustom
    type="text"
    size="large"
    btnColor={theme.palette.blue.serum}
    btnWidth={'14rem'}
    height={'100%'}
  >
    {connection}
  </BtnCustom>
)

@withRouter
export default class NetworkDropdown extends React.PureComponent<{ theme: Theme, setEndpoint: (endpoint: string) => void, endpoint: {name: string, endpoint: string}}> {
  render() {
    const { theme, setEndpoint, endpoint } = this.props

    const currentConnectionEndpoint = {
      value: endpoint,
      label: ENDPOINTS.find((a) => a.endpoint === endpoint).name,
    }

    return (
      <StyledDropdown theme={theme} style={{ margin: '0 2rem' }}>
        <WalletStatusButton
          connection={currentConnectionEndpoint.label}
          theme={theme}
        />

        <StyledPaper
          style={{ display: currentConnectionEndpoint.label === endpoint.name ? 'none' : '' }}
          theme={theme}
          isWalletConnected={currentConnectionEndpoint.label === endpoint.name}
          customActiveRem={`25rem`}
          customNotActiveRem={`19rem`}
        >
          <MenuList style={{ padding: 0 }}>
            {ENDPOINTS.map((endpoint) => (
              <StyledMenuItem
                theme={theme}
                disableRipple
                disableGutters={true}
                key={`${endpoint.name}`}
              >
                <BtnCustom
                  btnWidth={'100%'}
                  height={'4rem'}
                  border="none"
                  borderWidth="0"
                  borderRadius="0"
                  btnColor={currentConnectionEndpoint.label === endpoint.name ? '#AAF2C9' : '#ECF0F3'}
                  fontSize={'1.2rem'}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    textTransform: 'none',
                    padding: '1rem',
                  }}
                  onClick={() => {
                    setEndpoint(endpoint.endpoint)
                  }}
                >
                  {/* <SvgIcon src={CCAI} width={'20%'} height={'70%'} /> */}
                  {endpoint.name}
                </BtnCustom>
              </StyledMenuItem>
            ))}
          </MenuList>
        </StyledPaper>
      </StyledDropdown>
    )
  }
}

// {this.props.items.map(({ icon, text, to, style, ...events }) => (
// <StyledMenuItem
//   theme={theme}
//   disableRipple
//   disableGutters={true}
//   key={text}
// >
//     <StyledLink
//       theme={theme}
//       to={to}
//       key={`${text}-link`}
//       onClick={this.handleClose}
//       {...events}
//     >
//       {/* {icon} */}
//       <StyledMenuItemText style={style} key={`${text}-text`}>
//         {text}
//       </StyledMenuItemText>
//     </StyledLink>
//   </StyledMenuItem>
// ))}
