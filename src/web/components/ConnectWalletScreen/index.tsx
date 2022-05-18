import { Theme, withTheme } from '@material-ui/core'
import React, { ReactNode, useState } from 'react'

import { TooltipRegionBlocker } from '@sb/components'
import {
  RowContainer,
  Title,
} from '@sb/compositions/AnalyticsRoute/index.styles'
import { ConnectWalletPopup } from '@sb/compositions/Chart/components/ConnectWalletPopup/ConnectWalletPopup'

import { COLORS } from '../../../variables/variables'
import { Button } from '../Button'
import { LogoContainer } from './styles'

interface ConnectWalletContentProps {
  theme: Theme
  size?: 'button-only' | 'md' | 'sm'
  text?: ReactNode
}

// TODO: styled-components
const SIZES = {
  md: {
    icon: '8em',
    logoRowMargin: '2rem 0 4rem 0',
    btnContainerMargin: '0 0 2rem 0',
    fontSize: '1.5em',
    titleMargin: '0 0 2.4rem 0',
    btnHeight: '3em',
    btnWidth: '12em',
  },
  sm: {
    icon: '4em',
    logoRowMargin: '0rem 0 1rem 0',
    btnContainerMargin: '0',
    fontSize: '1em',
    titleMargin: '0 0 1em 0',
    btnHeight: '2.3em',
    btnWidth: '12em',
  },
  'button-only': {
    icon: '4em',
    logoRowMargin: '0rem 0 1rem 0',
    btnContainerMargin: '0',
    fontSize: '1em',
    titleMargin: '0 0 1em 0',
    btnHeight: '3em',
    btnWidth: '100%',
  },
}

const ConnectWalletContent: React.FC<ConnectWalletContentProps> = (props) => {
  const { theme, size = 'md', text = 'Connect your wallet to begin.' } = props
  const sizes = SIZES[size]
  const isButtonOnly = size === 'button-only'
  const [isConnectWalletPopupOpen, setIsConnectWalletPopupOpen] =
    useState(false)

  const [isRegionCheckIsLoading, setRegionCheckIsLoading] =
    useState<boolean>(false)
  const [isFromRestrictedRegion, setIsFromRestrictedRegion] =
    useState<boolean>(false)

  // useEffect(() => {
  //   setRegionCheckIsLoading(true)
  //   getRegionData({ setIsFromRestrictedRegion }).then(() => {
  //     setRegionCheckIsLoading(false)
  //   })
  // }, [setIsFromRestrictedRegion])

  const buttonWithModal = (
    <>
      <TooltipRegionBlocker isFromRestrictedRegion={isFromRestrictedRegion}>
        <span>
          <Button
            $padding="lg"
            type="button"
            $loading={isRegionCheckIsLoading}
            onClick={() => {
              if (isRegionCheckIsLoading || isFromRestrictedRegion) {
                return
              }
              setIsConnectWalletPopupOpen(true)
            }}
            disabled={isFromRestrictedRegion}
          >
            {!isRegionCheckIsLoading &&
              (isFromRestrictedRegion ? `Restricted region` : `Connect wallet`)}
          </Button>
        </span>
      </TooltipRegionBlocker>
      <ConnectWalletPopup
        theme={theme}
        open={isConnectWalletPopupOpen && !isFromRestrictedRegion}
        onClose={() => setIsConnectWalletPopupOpen(false)}
      />
    </>
  )

  if (isButtonOnly) {
    return <>{buttonWithModal}</>
  }

  return (
    <RowContainer style={{ fontSize: '16px' }} margin="auto 0">
      <LogoContainer margin={sizes.logoRowMargin}>
        <svg
          width={sizes.icon}
          height={sizes.icon}
          viewBox="0 0 147 137"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M126.117 75.9046L125.301 84.9312L123.863 93.8955L121.808 102.761L121.73 103.014L121.634 103.264L121.524 103.505L121.396 103.744L121.251 103.972L121.09 104.192L120.916 104.404L120.727 104.604L120.525 104.793L120.31 104.972L120.082 105.138L119.844 105.291L119.596 105.431L114.585 107.868L109.417 110.022L104.11 111.883L98.684 113.447L93.1612 114.704L87.5612 115.652L81.907 116.286L76.3202 116.585L76.22 116.603H73.3715H70.523L70.4245 116.585L64.836 116.286L59.1818 115.652L53.5835 114.704L48.059 113.447L42.6348 111.883L37.3256 110.022L32.1576 107.868L27.1474 105.431L26.901 105.291L26.6611 105.138L26.4328 104.972L26.2192 104.793L26.0156 104.604L25.8266 104.404L25.6525 104.192L25.4915 103.972L25.347 103.744L25.2188 103.505L25.1088 103.264L25.0135 103.014L24.9346 102.761L22.8796 93.8955L21.4423 84.9312L20.6258 75.9046L20.4353 66.85L20.8706 57.8019L21.9301 48.7966L23.6106 39.8669L23.6747 39.6221L23.7535 39.379L23.8209 39.2114L23.8488 39.1408L23.9605 38.9092L24.0887 38.6841L25.9301 35.8537L27.972 33.1383L30.2077 30.5478L32.6258 28.0936L33.6492 27.1819L35.2164 25.7856L37.9695 23.6353L40.8705 21.6476L43.9112 19.8357L47.0767 18.2045L50.3522 16.7622L53.7264 15.5154L57.1826 14.4673L60.7095 13.623L64.2873 12.9873L67.9062 12.5601L71.5464 12.3482H73.3715H75.1965L78.8368 12.5601L82.4557 12.9873L86.0351 13.623L89.5604 14.4673L93.0183 15.5154L96.3907 16.7622L99.6663 18.2045L102.832 19.8357L105.872 21.6476L108.773 23.6353L111.527 25.7856L113.094 27.1819L114.117 28.0936L116.535 30.5478L118.771 33.1383L120.813 35.8537L122.656 38.6841L122.782 38.9092L122.894 39.1408L122.924 39.2114L122.989 39.379L123.07 39.6221L123.134 39.8669L124.813 48.7966L125.874 57.8019L126.308 66.85L126.117 75.9046ZM146.707 57.9711L146.62 57.1958L146.485 56.4303L146.301 55.6713L146.069 54.9256L145.789 54.1962L145.462 53.4849L145.09 52.7933L144.676 52.1264L144.221 51.4841L143.724 50.8714L143.188 50.2898L142.618 49.7412L142.012 49.2286L141.375 48.7523L140.709 48.3153L139.766 47.7749L139.523 47.6155L139.293 47.443L139.073 47.2558L138.865 47.057L138.671 46.8467L138.49 46.6233L138.326 46.3901L138.175 46.1469L138.04 45.8956L137.922 45.6377L137.82 45.3732L137.097 43.4956L136.249 41.6689L135.279 39.8997L134.193 38.1946L132.994 36.5617L131.688 35.0077L130.277 33.5408L128.772 32.1675L127.178 30.8895L126.973 30.7268L126.776 30.5527L126.59 30.3687L126.418 30.1749L126.254 29.9712L126.102 29.7593L125.964 29.5392L123.949 26.354L121.723 23.3002L119.303 20.3893L116.696 17.6328L113.91 15.0439L110.962 12.6308L107.86 10.4049L104.617 8.37616L101.248 6.54947L97.7657 4.93634L94.1829 3.54004L90.5164 2.36879L86.7793 1.42587L82.9879 0.714584L79.1571 0.238205L75.3017 0H73.3715H71.4413L67.5859 0.238205L63.7551 0.714584L59.9637 1.42587L56.2266 2.36879L52.5617 3.54004L48.9773 4.93634L45.4948 6.54947L42.1256 8.37616L38.8829 10.4049L35.7814 12.6308L32.8328 15.0439L30.0484 17.6328L27.4414 20.3893L25.0201 23.3002L22.7958 26.354L20.7786 29.5392L20.6406 29.7593L20.4895 29.9712L20.3269 30.1749L20.1527 30.3687L19.9688 30.5527L19.7733 30.7268L19.5663 30.8895L17.9712 32.1675L16.4665 33.5408L15.0587 35.0077L13.7511 36.5617L12.5503 38.1946L11.4645 39.8997L10.4936 41.6689L9.64762 43.4956L8.92318 45.3732L8.82298 45.6377L8.70307 45.8956L8.56836 46.1469L8.41887 46.3901L8.25296 46.6233L8.0739 46.8467L7.87843 47.057L7.67145 47.2558L7.45132 47.443L7.2197 47.6155L6.97822 47.7749L6.03367 48.3153L5.36837 48.7523L4.731 49.2286L4.12484 49.7412L3.55646 50.2898L3.0193 50.8714L2.5232 51.4841L2.06653 52.1264L1.65257 52.7933L1.28131 53.4849L0.956057 54.1962L0.675158 54.9256L0.441896 55.6713L0.257914 56.4303L0.123211 57.1958L0.0361448 57.9711L0 58.7481L0.0115052 59.5268L1.65914 95.0635L1.70185 95.6039L1.77905 96.1427L1.88912 96.6766L2.03203 97.2006L2.2078 97.7164L2.41806 98.2207L2.65791 98.7136L2.92895 99.1883L3.22957 99.6483L3.8653 100.499L4.55195 101.312L5.28952 102.083L6.07474 102.809L6.90266 103.487L7.77165 104.116L8.92154 104.847L9.15316 105.015L9.37493 105.197L9.58355 105.391L9.77904 105.598L9.96138 105.815L10.1322 106.043L10.2833 106.282L10.423 106.528L10.5462 106.781L11.8324 109.953L13.1909 112.79C14.2012 114.607 36.9461 131.359 36.9461 131.359C36.9461 131.359 48.7539 136.745 73.3715 136.745C97.9891 136.745 109.797 131.359 109.797 131.359C109.797 131.359 132.542 114.607 133.552 112.79L134.912 109.953L136.198 106.781L136.32 106.528L136.46 106.282L136.612 106.043L136.782 105.815L136.964 105.598L137.161 105.391L137.37 105.197L137.59 105.015L137.821 104.847L138.971 104.116L139.84 103.487L140.668 102.809L141.453 102.083L142.191 101.312L142.878 100.499L143.513 99.6483L143.814 99.1883L144.085 98.7136L144.325 98.2207L144.535 97.7164L144.711 97.2006L144.854 96.6766L144.966 96.1427L145.043 95.6039L145.084 95.0635L146.731 59.5268L146.745 58.7481L146.707 57.9711Z"
            fill="#F5F5FB"
          />
          <path
            d="M100.341 75.4062H93.3938C92.5248 75.4062 91.8201 76.1126 91.8201 76.9815V81.77C91.8201 82.6423 91.4735 83.4801 90.8558 84.0978L90.4139 84.5396C89.7963 85.1573 88.9585 85.5023 88.0862 85.5023H58.6637C57.7914 85.5023 56.9536 85.1573 56.336 84.5396L55.8941 84.0978C55.2764 83.4801 54.9298 82.6423 54.9298 81.77V76.9815C54.9298 76.1126 54.2251 75.4062 53.3545 75.4062H46.4091C45.5401 75.4062 44.8337 76.1126 44.8337 76.9815V83.9269C44.8337 84.7975 45.5401 85.5023 46.4091 85.5023H51.6395C52.5118 85.5023 53.3495 85.8489 53.9672 86.4665C54.5849 87.0842 54.9298 87.922 54.9298 88.7943V93.8751C54.9298 94.823 55.7052 95.5983 56.653 95.5983H56.658H90.092H90.0953C91.0447 95.5983 91.8201 94.823 91.8201 93.8751V88.7943C91.8201 87.922 92.1651 87.0842 92.7827 86.4665C93.4004 85.8489 94.2382 85.5023 95.1104 85.5023H100.341C101.21 85.5023 101.916 84.7975 101.916 83.9269V76.9815C101.916 76.1126 101.21 75.4062 100.341 75.4062Z"
            fill="#F5F5FB"
          />
        </svg>
      </LogoContainer>
      <RowContainer margin={sizes.titleMargin}>
        {text && (
          <Title
            fontFamily="Avenir Next Demi"
            fontSize={sizes.fontSize}
            style={{ textAlign: 'center' }}
          >
            {text}
          </Title>
        )}
      </RowContainer>
      <RowContainer margin={sizes.btnContainerMargin}>
        {buttonWithModal}
      </RowContainer>
    </RowContainer>
  )
}

export const ConnectWalletInner = withTheme()(ConnectWalletContent)

export const ConnectWalletScreen = ({ theme }: { theme: Theme }) => {
  return (
    <RowContainer
      direction="column"
      height="100%"
      style={{ background: COLORS.mainBlack }}
    >
      <ConnectWalletInner />
    </RowContainer>
  )
}
