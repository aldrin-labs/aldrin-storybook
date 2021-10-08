import * as React from 'react'
import { withRouter } from 'react-router-dom'
import { MenuList, Theme } from '@material-ui/core'

import { ENDPOINTS } from '@sb/dexUtils/connection'

import {
  StyledDropdown,
  StyledPaper,
  StyledMenuItem,
} from '@sb/components/Dropdown/Dropdown.styles'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'

const WalletStatusButton = ({
  connection,
  theme,
}: {
  connection: string
  theme: Theme
}) => (
  <BtnCustom
    borderWidth="0"
    height="3.5rem"
    btnColor={theme.palette.dark.main}
    btnWidth="14rem"
  >
    {connection}
    <ExpandMoreIcon fontSize="small" style={{ marginLeft: '.5rem' }} />
  </BtnCustom>
)

@withRouter
export default class NetworkDropdown extends React.PureComponent<{
  theme: Theme
  setEndpoint: (endpoint: string) => void
  endpoint: { name: string; endpoint: string }
}> {
  render() {
    const { theme, setEndpoint, endpoint, isWalletConnected } = this.props

    const currentConnectionEndpoint = {
      value: endpoint,
      label: (
        ENDPOINTS.find((a) => a.endpoint === endpoint) || { name: 'Loading' }
      ).name,
    }

    return (
      <StyledDropdown
        theme={theme}
        style={{ borderRight: theme.palette.border.new }}
      >
        <WalletStatusButton
          connection={currentConnectionEndpoint.label}
          theme={theme}
        />

        <StyledPaper
          style={{
            display:
              currentConnectionEndpoint.label === endpoint.name ? 'none' : '',
          }}
          theme={theme}
          isWalletConnected={isWalletConnected}
          customActiveRem="26rem"
          customNotActiveRem="20rem"
        >
          <MenuList style={{ padding: 0 }}>
            {ENDPOINTS.map((endpoint) => (
              <StyledMenuItem
                theme={theme}
                disableRipple
                disableGutters
                key={`${endpoint.name}`}
              >
                <BtnCustom
                  btnWidth="100%"
                  height="4rem"
                  border="none"
                  borderWidth="0"
                  borderRadius="0"
                  btnColor={
                    currentConnectionEndpoint.label === endpoint.name
                      ? '#AAF2C9'
                      : '#ECF0F3'
                  }
                  fontSize="1.2rem"
                  padding="1rem"
                  textTransform="capitalize"
                  style={{ justifyContent: 'flex-start' }}
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
