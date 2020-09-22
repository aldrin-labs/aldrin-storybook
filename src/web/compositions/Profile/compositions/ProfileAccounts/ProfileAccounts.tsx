import React, { useState } from 'react'
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons'
import { getPortfolioAssetsData } from '@core/utils/Overview.utils'
import TransferPopup from '@sb/compositions/Chart/components/TransferPopup'
import { useSnackbar } from 'notistack'
import {
  IProps,
  PortfolioData,
} from '@core/containers/Profile/ProfileAccounts/ProfileAccounts.types'
import {
  MainContainer,
  StatisticContainer,
  ContentContainer,
  GridBlock,
  PortfoliosBlock,
  SummaryAccountsBlock,
  CurrentPortfolioBlock,
  PortfoliosValue,
  PortfolioValues,
  PortfolioValuesBlock,
  AccountsValue,
  AccountsChartBlock,
  GridTitle,
  GreenValue,
  BigNumberValue,
  ChangePortfolioBlock,
  CreatePortfolioButton,
  ChangePortfolioArrowsBlock,
  ChangePortfolioArrow,
  GreyValue,
  PortfolioName,
  StyledAddIcon,
  Typography,
} from './ProfileAccounts.styles'
import { combineTableData } from '@core/utils/PortfolioTableUtils.ts'

import ProfileAccountsTable from './ProfileAccountsTable'
import { formatValue, countAllPortfoliosValue } from './ProfileAccounts.utils'

import PopupStart from '@sb/components/Onboarding/PopupStart/PopupStart'
import CreatePortfolio from '@sb/components/CreatePortfolio/CreatePortfolio'
import PortfolioSelectorPopup from '@sb/components/PortfolioSelectorPopup/PortfolioSelectorPopup'
import { ComingSoonBlock } from '@sb/compositions/Profile/compositions/ProfileRouter/ProfileRouter'

const ProfileAccounts = ({
  currentPortfolioData,
  allPortfoliosData,
  portfolioAccountsData,
  selectPortfolioMutation,
  getTelegramUsername,
  getPortfolioAssets,
  portfolioKeys,
  updateWithdrawalSettings,
  updateDepositSettings,
}: IProps) => {
  const showFuturesTransfer = (result) => {
    if (result.status === 'OK' && result.data && result.data.tranId) {
      enqueueSnackbar('Funds transfered!', {
        variant: 'success',
        // action: <CloseButton />,
      })
    } else {
      enqueueSnackbar('Something went wrong during transfering funds', {
        variant: 'error',
      })
    }
  }
  const [transferFromSpotToFutures, setTransferFromSpotToFutures] = useState(
    false
  )
  const [open, togglePopup] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState('')
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(false)
  const [creatingAdditionalAccount, setCreatingAdditionalAccount] = useState(
    false
  )
  const currentPortfolioIndex = allPortfoliosData.findIndex(
    (portfolio: PortfolioData) => portfolio._id === currentPortfolioData._id
  )

  const telegramUsernameConnected = !!getTelegramUsername.getTelegramUsername
    .telegramUsername

  const prevPortfolioId =
    currentPortfolioIndex === 0
      ? allPortfoliosData[allPortfoliosData.length - 1]._id
      : allPortfoliosData[currentPortfolioIndex - 1]._id

  const nextPortfolioId =
    currentPortfolioIndex === allPortfoliosData.length - 1
      ? allPortfoliosData[0]._id
      : allPortfoliosData[currentPortfolioIndex + 1]._id

  const spotAssets = getPortfolioAssets.myPortfolios[0].portfolioAssets.filter(
    (asset) => asset.assetType === 0
  )

  const futuresAssets = getPortfolioAssets.myPortfolios[0].portfolioAssets.filter(
    (asset) => asset.assetType === 1
  )

  const {
    portfolioAssetsMap: portfolioAssetsMapFutures,
  } = getPortfolioAssetsData(futuresAssets, 'USDT')
  const { portfolioAssetsMap } = getPortfolioAssetsData(spotAssets, 'USDT')

  // const portfolioAssets = getPortfolioAssetsData(filteredData, baseCoin)

  return (
    <MainContainer>
      <ContentContainer>
        {/* current portfolio info */}
        <CurrentPortfolioBlock>
          <ChangePortfolioBlock>
            <PortfolioValues>
              {/* switch between portfolios */}
              <ChangePortfolioArrowsBlock>
                {/* prev portfolio */}
                <ChangePortfolioArrow
                  onClick={() =>
                    selectPortfolioMutation({
                      variables: {
                        inputPortfolio: {
                          id: nextPortfolioId,
                        },
                      },
                    })
                  }
                >
                  <KeyboardArrowUp />
                </ChangePortfolioArrow>
                {/* next portfolio */}
                <ChangePortfolioArrow
                  onClick={() =>
                    selectPortfolioMutation({
                      variables: {
                        inputPortfolio: {
                          id: prevPortfolioId,
                        },
                      },
                    })
                  }
                >
                  <KeyboardArrowDown />
                </ChangePortfolioArrow>
              </ChangePortfolioArrowsBlock>

              {/* current portfolio values */}
              <PortfolioValuesBlock>
                <PortfolioName>{currentPortfolioData.name}</PortfolioName>
                <GreyValue>{`${portfolioAccountsData.length} ${
                  portfolioAccountsData.length === 1 ? 'account' : 'accounts'
                }`}</GreyValue>
                <GreenValue>
                  {formatValue(currentPortfolioData.portfolioValue)}
                </GreenValue>
              </PortfolioValuesBlock>
            </PortfolioValues>
            {/* edit portfolio name */}
            <PortfolioSelectorPopup
              isPortfolio
              needPortalMask
              dotsColor={'#7284A0'}
              data={currentPortfolioData}
            />
          </ChangePortfolioBlock>
          <CreatePortfolio
            baseCoin={'USDT'}
            existCustomButton
            CustomButton={({ handleClick }: { handleClick: () => void }) => (
              <CreatePortfolioButton onClick={handleClick}>
                <StyledAddIcon />
                <Typography>create new portfolio</Typography>
              </CreatePortfolioButton>
            )}
          />
        </CurrentPortfolioBlock>

        {/* account table */}
        <GridBlock height={'86%'}>
          <ProfileAccountsTable
            setCreatingAdditionalAccount={setCreatingAdditionalAccount}
            telegramUsernameConnected={telegramUsernameConnected}
            accounts={portfolioAccountsData}
            portfolioAssetsMapFutures={portfolioAssetsMapFutures}
            portfolioAssetsMap={portfolioAssetsMap}
            setTransferFromSpotToFutures={setTransferFromSpotToFutures}
            togglePopup={togglePopup}
            setSelectedAccount={setSelectedAccount}
            updateWithdrawalSettings={updateWithdrawalSettings}
            updateDepositSettings={updateDepositSettings}
          />
        </GridBlock>
      </ContentContainer>
      <StatisticContainer>
        {/* total portfolios */}
        <PortfoliosBlock>
          <GridTitle>total portfolios</GridTitle>
          <PortfoliosValue>
            <GreenValue>
              {formatValue(countAllPortfoliosValue(allPortfoliosData))}
            </GreenValue>
            <BigNumberValue>{allPortfoliosData.length}</BigNumberValue>
          </PortfoliosValue>
        </PortfoliosBlock>

        {/* summary accounts */}
        <SummaryAccountsBlock height={'42%'}>
          <GridTitle>summary accounts</GridTitle>
          <AccountsValue>
            <BigNumberValue>{portfolioAccountsData.length}</BigNumberValue>
          </AccountsValue>
          {/* <AccountsChartBlock>
            <GridTitle>chart soon</GridTitle>
          </AccountsChartBlock> */}
        </SummaryAccountsBlock>

        {/* temporary empty block */}
        {/* <GridBlock height={'44%'}>
          <ComingSoonBlock />
        </GridBlock> */}
      </StatisticContainer>
      {creatingAdditionalAccount && (
        <PopupStart
          open={true}
          creatingAdditionalAccount={true}
          completeOnboarding={() => {
            setCreatingAdditionalAccount(false)
          }}
        />
      )}
      <TransferPopup
        open={open}
        handleClose={() => togglePopup(false)}
        transferFromSpotToFutures={transferFromSpotToFutures}
        haveSelectedAccount={true}
        selectedAccount={selectedAccount}
        showFuturesTransfer={showFuturesTransfer}
        isFuturesWarsKey={false}
        loading={loading}
        setLoading={setLoading}
      />{' '}
    </MainContainer>
  )
}

export default ProfileAccounts
