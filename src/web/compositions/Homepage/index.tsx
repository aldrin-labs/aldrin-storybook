import React from 'react'

import {
  MainContainer,
  CardContainer,
  WhiteButton,
  Header,
  HeaderContainer,
  Description,
  Socials,
  ButtonContainer,
} from './styles'
import { RowContainer, Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import { Text } from '../../compositions/Addressbook/index'

import SvgIcon from '@sb/components/SvgIcon'

import Banner from '@icons/Banner.svg'
import ArrowCard from '@icons/arrows.svg'
import PoolCard from '@icons/Pool.svg'
import WalletCard from '@icons/walletCard.svg'
import Candies from '../../../icons/candies.svg'
import ChartCard from '@icons/chart.svg'
import Alameda from '@icons/alamedaLight.svg'
import Serum from '@icons/Logo&Serum.svg'
import { CCAIProviderURL } from '@sb/dexUtils/utils'

export const Homepage = () => {
  return (
    <MainContainer>
      <RowContainer>
        <CardContainer
          style={{ marginTop: '3rem', minHeight: '20rem' }}
          width={'calc(100% - 5.5rem)'}
        >
          <img src={Banner} width={'100%'} />
          {/* //bottom={'6rem'} right={'16rem'}{' '}
          position={'relative'} */}
          <ButtonContainer>
            <WhiteButton needHover={true} padding={'0 3rem'}>
              Learn More{' '}
              <svg
                width="20"
                height="8"
                viewBox="0 0 20 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19.3536 4.35355C19.5488 4.15829 19.5488 3.84171 19.3536 3.64645L16.1716 0.464466C15.9763 0.269204 15.6597 0.269204 15.4645 0.464466C15.2692 0.659728 15.2692 0.976311 15.4645 1.17157L18.2929 4L15.4645 6.82843C15.2692 7.02369 15.2692 7.34027 15.4645 7.53553C15.6597 7.7308 15.9763 7.7308 16.1716 7.53553L19.3536 4.35355ZM0 4.5H19V3.5H0V4.5Z"
                  fill="#F8FAFF"
                />
              </svg>
            </WhiteButton>
          </ButtonContainer>
        </CardContainer>
      </RowContainer>
      <RowContainer align={'flex-start'} style={{ marginTop: '1.5rem' }}>
        <Row
          direction={'column'}
          height={'60%'}
          width={'calc((98.5% - 4rem) / 3)'}
        >
          <CardContainer style={{ paddingRight: '1.5rem' }}>
            <HeaderContainer>
              <Header fontSize={'6rem'}>DEX</Header>
              <Description fontSize={'2.25rem'} width={'75%'}>
                One of the fastest DEXs in the world, built on the Serum and
                Solana technology. User-friendly DeFi experience with low fees.
              </Description>
              <WhiteButton
                needHover={true}
                style={{ marginBottom: '-1rem' }}
                width={'18rem'}
                padding={'0 3rem'}
                href={'/chart'}
              >
                {' '}
                Trade Now{' '}
                <svg
                  width="20"
                  height="8"
                  viewBox="0 0 20 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19.3536 4.35355C19.5488 4.15829 19.5488 3.84171 19.3536 3.64645L16.1716 0.464466C15.9763 0.269204 15.6597 0.269204 15.4645 0.464466C15.2692 0.659728 15.2692 0.976311 15.4645 1.17157L18.2929 4L15.4645 6.82843C15.2692 7.02369 15.2692 7.34027 15.4645 7.53553C15.6597 7.7308 15.9763 7.7308 16.1716 7.53553L19.3536 4.35355ZM0 4.5H19V3.5H0V4.5Z"
                    fill="#F8FAFF"
                  />
                </svg>
              </WhiteButton>
            </HeaderContainer>
            <SvgIcon src={Candies} width={'100%'} height={'100%'} />
          </CardContainer>
        </Row>
        <Row
          height={'60%'}
          direction={'column'}
          width={'calc((100% - 4rem) / 3)'}
          style={{ paddingRight: '1.5rem' }}
        >
          {' '}
          <CardContainer
            style={{ marginBottom: '1.5rem', marginTop: '0.1rem' }}
          >
            {' '}
            <SvgIcon src={WalletCard} width={'100%'} height={'100%'} />
            <HeaderContainer align={'center'} direction={'row'}>
              <RowContainer justify={'end'} height={'100%'}>
                <Header style={{ marginTop: '0.8rem' }}>Wallet</Header>
                <Description>
                  Hold and trade the top cryptocurrencies on{' '}
                  <strong>CCAI  Wallet™</strong>.
                </Description>
              </RowContainer>
              <WhiteButton
                needHover={true}
                width={'30rem'}
                padding={'0 2rem'}
                href={`${CCAIProviderURL}`}
              >
                Go to Wallet{' '}
                <svg
                  width="20"
                  height="8"
                  viewBox="0 0 20 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19.3536 4.35355C19.5488 4.15829 19.5488 3.84171 19.3536 3.64645L16.1716 0.464466C15.9763 0.269204 15.6597 0.269204 15.4645 0.464466C15.2692 0.659728 15.2692 0.976311 15.4645 1.17157L18.2929 4L15.4645 6.82843C15.2692 7.02369 15.2692 7.34027 15.4645 7.53553C15.6597 7.7308 15.9763 7.7308 16.1716 7.53553L19.3536 4.35355ZM0 4.5H19V3.5H0V4.5Z"
                    fill="#F8FAFF"
                  />
                </svg>
              </WhiteButton>
            </HeaderContainer>
          </CardContainer>
          <CardContainer>
            <SvgIcon src={ChartCard} width={'100%'} height={'100%'} />
            <HeaderContainer align={'center'} direction={'row'}>
              <RowContainer justify={'end'} height={'100%'}>
                <Header style={{ marginTop: '0.8rem' }}>Analytics</Header>
                <Description style={{ marginBottom: '1rem' }}>
                  Transparent analysis of all markets on Serum in simple charts.
                </Description>
              </RowContainer>
              <WhiteButton
                needHover={true}
                width={'30rem'}
                padding={'0 2rem'}
                href={'/analytics'}
              >
                View Analytics{' '}
                <svg
                  width="20"
                  height="8"
                  viewBox="0 0 20 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19.3536 4.35355C19.5488 4.15829 19.5488 3.84171 19.3536 3.64645L16.1716 0.464466C15.9763 0.269204 15.6597 0.269204 15.4645 0.464466C15.2692 0.659728 15.2692 0.976311 15.4645 1.17157L18.2929 4L15.4645 6.82843C15.2692 7.02369 15.2692 7.34027 15.4645 7.53553C15.6597 7.7308 15.9763 7.7308 16.1716 7.53553L19.3536 4.35355ZM0 4.5H19V3.5H0V4.5Z"
                    fill="#F8FAFF"
                  />
                </svg>
              </WhiteButton>
            </HeaderContainer>
          </CardContainer>
        </Row>
        <Row
          height={'60%'}
          direction={'column'}
          width={'calc(((100% - 4rem) / 3) - 1.7rem)'}
        >
          {' '}
          <CardContainer
            style={{ marginBottom: '1.5rem', marginTop: '0.1rem' }}
          >
            {' '}
            <SvgIcon src={ArrowCard} width={'100%'} height={'100%'} />
            <HeaderContainer align={'center'} direction={'row'}>
              <RowContainer justify={'end'} height={'100%'}>
                <Header>Swap</Header>
                <Description style={{ marginBottom: '-1rem' }}>
                  Low-fee and instant Swaps. Made possible by Solana.
                </Description>
              </RowContainer>
              <WhiteButton
                style={{ cursor: 'auto' }}
                needHover={false}
                width={'30rem'}
                padding={'0 2rem'}
              >
                Coming Soon
              </WhiteButton>
            </HeaderContainer>
          </CardContainer>
          <CardContainer>
            {' '}
            <SvgIcon src={PoolCard} width={'100%'} height={'100%'} />
            <HeaderContainer align={'center'} direction={'row'}>
              <RowContainer justify={'end'} height={'100%'}>
                <Header>Pools</Header>
                <Description style={{ marginBottom: '-1rem' }}>
                  Provide liquidity and earn a fees.
                </Description>
              </RowContainer>
              <WhiteButton
                style={{ cursor: 'auto' }}
                needHover={false}
                width={'30rem'}
                padding={'0 2rem'}
              >
                Coming Soon
              </WhiteButton>
            </HeaderContainer>
          </CardContainer>
        </Row>
      </RowContainer>
      <RowContainer justify={'space-between'}>
        <Row
          width={'31%'}
          height={'7rem'}
          justify={'space-around'}
          style={{ marginLeft: '2rem' }}
        >
          <Text fontSize={'1.7rem'}>In partnership with</Text>
          <SvgIcon src={Alameda} height={'auto'} width={'40%'} />
          <SvgIcon src={Serum} height={'auto'} width={'17%'} />
        </Row>
        <Socials justify={'space-around'} width={'20%'}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://twitter.com/CCAI_Official"
          >
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g filter="url(#filter0_d)">
                <path
                  d="M32 20C25.3732 20 20 25.3732 20 32C20 38.6268 25.3732 44 32 44C38.6268 44 44 38.6268 44 32C44 25.3732 38.6268 20 32 20ZM37.767 29.0455C37.775 29.1714 37.775 29.3027 37.775 29.4313C37.775 33.3634 34.7804 37.8929 29.308 37.8929C27.6205 37.8929 26.0563 37.4027 24.7384 36.5589C24.9795 36.5857 25.2098 36.5964 25.4563 36.5964C26.8491 36.5964 28.1295 36.125 29.15 35.3268C27.8429 35.3 26.7446 34.4429 26.3696 33.2643C26.8277 33.3313 27.2402 33.3313 27.7116 33.2107C27.0386 33.074 26.4336 32.7084 25.9995 32.1762C25.5654 31.644 25.329 30.9779 25.3304 30.2911V30.2536C25.7241 30.4759 26.1875 30.6125 26.6723 30.6313C26.2648 30.3596 25.9305 29.9916 25.6992 29.5599C25.4679 29.1282 25.3468 28.646 25.3464 28.1562C25.3464 27.6018 25.4911 27.0955 25.7509 26.6562C26.498 27.5759 27.4302 28.3281 28.487 28.8638C29.5437 29.3996 30.7014 29.707 31.8848 29.7661C31.4643 27.7438 32.975 26.1071 34.7911 26.1071C35.6482 26.1071 36.4196 26.4661 36.9634 27.0446C37.6357 26.9188 38.2786 26.667 38.8518 26.3295C38.6295 27.0179 38.1634 27.5991 37.5446 27.9661C38.1446 27.9018 38.7232 27.7357 39.2589 27.5027C38.8545 28.0973 38.3482 28.625 37.767 29.0455Z"
                  fill="#406EDC"
                />
              </g>
              <defs>
                <filter
                  id="filter0_d"
                  x="0"
                  y="0"
                  width="64"
                  height="64"
                  filterUnits="userSpaceOnUse"
                  color-interpolation-filters="sRGB"
                >
                  <feFlood flood-opacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  />
                  <feOffset />
                  <feGaussianBlur stdDeviation="10" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0.8125 0 0 0 0 0.832812 0 0 0 0 1 0 0 0 0.41 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow"
                    result="shape"
                  />
                </filter>
              </defs>
            </svg>{' '}
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://t.me/CryptocurrenciesAi"
          >
            {' '}
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g filter="url(#filter0_d)">
                <path
                  d="M31.625 20C25.2028 20 20 25.2035 20 31.625C20 38.0465 25.2035 43.25 31.625 43.25C38.0472 43.25 43.25 38.0465 43.25 31.625C43.25 25.2035 38.0465 20 31.625 20ZM37.3348 27.9643L35.4268 36.9552C35.2858 37.5928 34.9062 37.7472 34.3768 37.4473L31.4705 35.3053L30.0688 36.6553C29.9143 36.8097 29.783 36.941 29.483 36.941L29.6892 33.983L35.075 29.117C35.3098 28.9108 35.0232 28.7937 34.7135 29L28.0573 33.1903L25.1885 32.2948C24.5653 32.0982 24.551 31.6715 25.3197 31.3715L36.5278 27.0493C37.0483 26.8618 37.5028 27.176 37.334 27.9635L37.3348 27.9643Z"
                  fill="#406EDC"
                />
              </g>
              <defs>
                <filter
                  id="filter0_d"
                  x="0"
                  y="0"
                  width="63.25"
                  height="63.25"
                  filterUnits="userSpaceOnUse"
                  color-interpolation-filters="sRGB"
                >
                  <feFlood flood-opacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  />
                  <feOffset />
                  <feGaussianBlur stdDeviation="10" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0.8125 0 0 0 0 0.832812 0 0 0 0 1 0 0 0 0.41 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow"
                    result="shape"
                  />
                </filter>
              </defs>
            </svg>
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://discord.gg/2EaKvrs"
          >
            <svg
              width="64"
              height="65"
              viewBox="0 0 64 65"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g filter="url(#filter0_d)">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M44 32.25C44 38.8774 38.6274 44.25 32 44.25C25.3726 44.25 20 38.8774 20 32.25C20 25.6226 25.3726 20.25 32 20.25C38.6274 20.25 44 25.6226 44 32.25ZM30 32.0833C29.908 32.0833 29.8333 32.158 29.8333 32.25C29.8333 32.342 29.908 32.4167 30 32.4167C30.092 32.4167 30.1667 32.342 30.1667 32.25C30.1667 32.158 30.092 32.0833 30 32.0833ZM28.8333 32.25C28.8333 31.6057 29.3557 31.0833 30 31.0833C30.6443 31.0833 31.1667 31.6057 31.1667 32.25C31.1667 32.8943 30.6443 33.4167 30 33.4167C29.3557 33.4167 28.8333 32.8943 28.8333 32.25ZM33.8333 32.25C33.8333 32.158 33.908 32.0833 34 32.0833C34.092 32.0833 34.1667 32.158 34.1667 32.25C34.1667 32.342 34.092 32.4167 34 32.4167C33.908 32.4167 33.8333 32.342 33.8333 32.25ZM34 31.0833C33.3557 31.0833 32.8333 31.6057 32.8333 32.25C32.8333 32.8943 33.3557 33.4167 34 33.4167C34.6443 33.4167 35.1667 32.8943 35.1667 32.25C35.1667 31.6057 34.6443 31.0833 34 31.0833ZM32 29.25C31.1475 29.25 30.2804 29.4042 29.1374 29.7308C28.8718 29.8066 28.5951 29.6529 28.5192 29.3874C28.4434 29.1218 28.5971 28.8451 28.8626 28.7692C29.2942 28.6459 29.6962 28.5438 30.0803 28.4637L29.6795 27.4618C28.9472 27.571 28.2693 27.7727 27.5979 28.2303C27.0061 30.024 26.6864 31.5725 26.562 32.8004C26.4339 34.0652 26.5186 34.9367 26.6838 35.3873C26.8777 35.7896 27.1619 36.2309 27.4918 36.5655C27.7975 36.8755 28.0909 37.0434 28.3495 37.077C28.3657 37.0624 28.3854 37.0433 28.4085 37.0192C28.5094 36.9136 28.6326 36.7539 28.7534 36.5645C28.8733 36.3765 28.9814 36.1738 29.0578 35.9874C29.0731 35.9501 29.0865 35.9149 29.0982 35.882C28.9104 35.8359 28.7209 35.7855 28.5293 35.7308C28.2638 35.6549 28.11 35.3782 28.1859 35.1126C28.2618 34.8471 28.5385 34.6934 28.804 34.7692C31.0476 35.4103 32.9524 35.4103 35.196 34.7692C35.4615 34.6934 35.7382 34.8471 35.8141 35.1126C35.89 35.3782 35.7362 35.6549 35.4707 35.7308C35.2824 35.7846 35.096 35.8342 34.9114 35.8796C34.9228 35.9083 34.9358 35.9388 34.9503 35.971C35.034 36.156 35.1527 36.3582 35.2846 36.5466C35.4172 36.7359 35.5529 36.8969 35.6645 37.0044C35.6992 37.0378 35.7277 37.0622 35.7494 37.0793C36.0419 37.051 36.3652 36.8747 36.6943 36.5569C37.0417 36.2214 37.3399 35.7802 37.543 35.3791C37.7147 34.9325 37.8039 34.0657 37.6696 32.8029C37.5391 31.5774 37.2039 30.0309 36.583 28.2388C35.8641 27.7739 35.1055 27.5698 34.3213 27.4597L33.9197 28.4637C34.3037 28.5438 34.7058 28.6459 35.1374 28.7692C35.4029 28.8451 35.5566 29.1218 35.4808 29.3874C35.4049 29.6529 35.1282 29.8066 34.8626 29.7308C33.7196 29.4042 32.8525 29.25 32 29.25ZM30.0833 36.0864C31.3824 36.3049 32.6234 36.3045 33.9226 36.0854C33.9564 36.1891 33.9969 36.2895 34.0392 36.3832C34.1535 36.6357 34.3056 36.8918 34.4654 37.1201C34.6245 37.3474 34.8013 37.5614 34.9709 37.7247C35.055 37.8057 35.1479 37.8845 35.2449 37.9464C35.3269 37.9986 35.479 38.0833 35.6667 38.0833C36.353 38.0833 36.9438 37.7061 37.3889 37.2763C37.8414 36.8393 38.2057 36.2895 38.4471 35.8071C38.4534 35.7947 38.4591 35.782 38.4642 35.7691C38.7325 35.0987 38.8055 34.0277 38.6639 32.6971C38.5203 31.347 38.149 29.6699 37.4715 27.7503C37.4367 27.6515 37.3717 27.5662 37.2858 27.5064C36.2138 26.7596 35.0874 26.5298 34.053 26.4195C33.8303 26.3957 33.6189 26.523 33.5358 26.731L32.908 28.3003C32.6021 28.267 32.3017 28.25 32 28.25C31.6982 28.25 31.3979 28.267 31.0919 28.3003L30.4642 26.731C30.3808 26.5224 30.1686 26.3951 29.9453 26.4197C28.9316 26.5311 27.9045 26.764 26.8802 27.5131C26.7967 27.5741 26.7343 27.6594 26.7013 27.7574C26.0567 29.6761 25.7036 31.3516 25.5671 32.6996C25.4325 34.0287 25.5023 35.0952 25.756 35.7613C25.7608 35.7739 25.7661 35.7862 25.7719 35.7984C26.0012 36.2797 26.3479 36.8297 26.7798 37.2676C27.2027 37.6965 27.7735 38.0833 28.4453 38.0833C28.64 38.0833 28.7933 37.9908 28.8716 37.9372C28.9654 37.8728 29.0534 37.7918 29.1315 37.71C29.2894 37.5448 29.4516 37.3295 29.5966 37.1021C29.7423 36.8735 29.8801 36.6179 29.983 36.3668C30.0196 36.2776 30.0542 36.1832 30.0833 36.0864ZM35.7945 37.11C35.7946 37.1102 35.7922 37.1091 35.7872 37.1061C35.792 37.1083 35.7945 37.1098 35.7945 37.11ZM28.2991 37.1164C28.298 37.1172 28.2973 37.1176 28.2973 37.1178C28.2973 37.118 28.2997 37.1167 28.3049 37.1132C28.3023 37.1146 28.3004 37.1157 28.2991 37.1164Z"
                  fill="#406EDC"
                />
              </g>
              <defs>
                <filter
                  id="filter0_d"
                  x="0"
                  y="0.25"
                  width="64"
                  height="64"
                  filterUnits="userSpaceOnUse"
                  color-interpolation-filters="sRGB"
                >
                  <feFlood flood-opacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  />
                  <feOffset />
                  <feGaussianBlur stdDeviation="10" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0.8125 0 0 0 0 0.832812 0 0 0 0 1 0 0 0 0.41 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow"
                    result="shape"
                  />
                </filter>
              </defs>
            </svg>
          </a>
        </Socials>
      </RowContainer>
    </MainContainer>
  )
}
