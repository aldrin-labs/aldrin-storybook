import React from 'react'
import styled from 'styled-components'
import { RowContainer, Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import { Link } from 'react-router-dom'

export const TextContainer = styled(RowContainer)`
  position: absolute;
  justify-content: space-between;
  padding: 2rem 8rem;
  height: 100%;
`

export const BlockForText = styled(Row)`
  flex-direction: column;
  width: 90%;
`

export const MainContainer = styled.div`
  width: 100%;
  height: 100%;

  @media only screen and (max-width: 600px) {
    display: none;
  }
`
export const MainContainerForSmallScreens = styled.div`
  width: 100%;
  height: 100%;
  display: none;

  @media only screen and (max-width: 600px) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
`
export const IdoBtn = styled.button`
  background-image: linear-gradient(
    135deg,
    rgb(44, 58, 174),
    rgb(94, 182, 183)
  );
  border: none;
  border-radius: 1rem;
  width: 8rem;
  white-space: nowrap;
  height: 3.5rem;
  color: #fff;
  font-size: 1.3rem;
  outline: none;
  font-family: 'Avenir Next Bold';
  cursor: pointer;
  &:hover {
    background-image: none;
    background: #4679f4;
  }
`
export const CardContainer = styled.div`
  height: ${(props) => props.height || '30%'};
  width: ${(props) => props.width || '100%'};
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`
export const WhiteButton = styled.a`
  bottom: ${(props) => props.bottom || 'none'};
  right: ${(props) => props.right || 'none'};
  top: ${(props) => props.top || 'none'};
  display: flex;
  text-decoration: none;
  justify-content: space-around;
  align-items: center;
  position: ${(props) => props.position || 'relative'};
  background: none;
  border: 0.1rem solid #f8faff;
  border-radius: 2.3rem;
  width: ${(props) => props.width || '21rem'};
  white-space: nowrap;
  height: 4rem;
  color: #fff;
  font-size: 1.6rem;
  outline: none;
  font-family: 'Avenir Next Medium';
  cursor: pointer;
  padding: ${(props) => props.padding || '0 4rem'};

  @media only screen and (min-width: 1430px) {
    width: ${(props) => props.width || '18rem'};
  }

  &:hover {
    background: ${(props) => (props.needHover ? '#f8faff' : null)};
    color: ${(props) => (props.needHover ? '#3a475c' : null)};
    svg {
      path {
        fill: ${(props) => (props.needHover ? '#3a475c' : null)};
      }
    }
  }
`
export const Header = styled.span`
  font-family: Avenir Next Bold;
  font-size: ${(props) => props.fontSize || '4rem'};
  line-height: 20px;
  letter-spacing: -0.394236px;
  color: #f8faff;
`
export const Description = styled.span`
  font-family: Avenir Next Medium;
  font-size: ${(props) => props.fontSize || '2rem'};
  letter-spacing: -0.653846px;
  color: #f8faff;
  line-height: 3.2rem;
  width: ${(props) => props.width || '90%'};
  @media only screen and (max-width: 2190px) {
    font-size: 2.5rem;
    line-height: 3.5rem;
  }
  @media only screen and (min-width: 1230px) {
    font-size: 2rem;
    line-height: 2.8rem;
  }
  @media only screen and (min-width: 1430px) {
    font-size: 1.6rem;
    line-height: 2.2rem;
  }
  @media only screen and (min-width: 1600px) {
    font-size: 2.1rem;
    line-height: 3.2rem;
  }
  @media only screen and (min-width: 1900px) {
    font-size: 2.4rem;
    line-height: 3rem;
  }
  @media only screen and (min-width: 2200px) {
    font-size: 1.4rem;
  }
`
export const HeaderContainer = styled.div`
  position: absolute;
  height: ${(props) => props.height || '90%'};
  display: flex;
  justify-content: space-around;
  flex-direction: ${(props) => props.direction || 'column'};
  align-items: ${(props) => props.align || 'flex-start'};
  width: 83%;
`
export const Socials = styled(Row)`
  & a:hover {
    svg {
      g {
        path {
          fill: #4679f4;
        }
      }
    }
  }
`
export const ButtonContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  padding: 0 10% 3% 0;
  @media only screen and (min-width: 1000px) {
    padding: 0 9% 3% 0;
  }

  @media only screen and (min-width: 1430px) {
    padding: 0 8% 3% 0;
  }
`

export const TwitterLink = () => {
  return (
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
  )
}

export const TelegramLink = () => {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={'https://t.me/CCAI_Official'}
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
  )
}

export const DiscordLink = () => {
  return (
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
  )
}
export const BannerHeader = styled(Description)`
  @media (max-width: 3000px) {
    font-size: 3.2rem;
  }
`
export const ThinText = styled(Description)`
  @media (max-width: 3000px) {
    white-space: nowrap;
    font-family: Avenir Next Thin;
    line-height: 3rem;
    font-size: 1.8rem;
  }
`
export const NewLink = styled(Link)`
  white-space: nowrap;
  font-family: Avenir Next Demi;
  line-height: 3rem;
  text-decoration: none;
  font-size: 1.8rem;
  color: #fbf2f2;
  transition: 0.3s;

  &:hover {
    text-decoration: underline;
    transition: 0.3s;
    svg {
      path {
        fill: #366ce5;
      }
      defs {
        linearGradient {
          stop {
            stop-color: #366ce5;
          }
        }
      }
    }
  }
`
export const StyledA = styled.a`
  text-decoration: none;
  white-space: nowrap;
  font-family: Avenir Next Demi;
  line-height: 3rem;
  font-size: 1.8rem;
  color: #fbf2f2;
  transition: 0.3s;

  &:hover {
    transition: 0.3s;
    text-decoration: underline;
    svg {
      path {
        fill: #366ce5;
      }
    }
  }
`
export const LinkToTelegram = () => {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={'https://t.me/CCAI_Official'}
    >
      <svg
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="11.871" cy="11.871" r="11.871" fill="#EDF0F2" />
        <path
          d="M12 0C5.37058 0 0 5.37135 0 12C0 18.6286 5.37135 24 12 24C18.6294 24 24 18.6286 24 12C24 5.37135 18.6286 0 12 0ZM17.8939 8.22116L15.9244 17.5022C15.7788 18.1603 15.3871 18.3197 14.8405 18.0101L11.8405 15.799L10.3935 17.1925C10.2341 17.352 10.0986 17.4875 9.7889 17.4875L10.0018 14.4341L15.5613 9.4111C15.8036 9.19819 15.5079 9.07742 15.1881 9.29032L8.31716 13.6157L5.35587 12.6914C4.71252 12.4885 4.69781 12.048 5.49135 11.7383L17.0609 7.27665C17.5982 7.0831 18.0674 7.40748 17.8932 8.22039L17.8939 8.22116Z"
          fill="#406EDC"
        />
      </svg>
    </a>
  )
}

export const LinkToTwitter = () => {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href="https://twitter.com/CCAI_Official"
    >
      <svg
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="12" fill="#EDF0F2" />
        <path
          d="M12 0C5.37321 0 0 5.37321 0 12C0 18.6268 5.37321 24 12 24C18.6268 24 24 18.6268 24 12C24 5.37321 18.6268 0 12 0ZM17.767 9.04554C17.775 9.17143 17.775 9.30268 17.775 9.43125C17.775 13.3634 14.7804 17.8929 9.30804 17.8929C7.62054 17.8929 6.05625 17.4027 4.73839 16.5589C4.97946 16.5857 5.20982 16.5964 5.45625 16.5964C6.84911 16.5964 8.12946 16.125 9.15 15.3268C7.84286 15.3 6.74464 14.4429 6.36964 13.2643C6.82768 13.3313 7.24018 13.3313 7.71161 13.2107C7.03855 13.074 6.43359 12.7084 5.99951 12.1762C5.56542 11.644 5.32898 10.9779 5.33036 10.2911V10.2536C5.72411 10.4759 6.1875 10.6125 6.67232 10.6313C6.26476 10.3596 5.93051 9.99164 5.69923 9.5599C5.46794 9.12817 5.34676 8.64603 5.34643 8.15625C5.34643 7.60179 5.49107 7.09554 5.75089 6.65625C6.49795 7.5759 7.43017 8.32806 8.48696 8.86384C9.54375 9.39961 10.7014 9.70702 11.8848 9.76607C11.4643 7.74375 12.975 6.10714 14.7911 6.10714C15.6482 6.10714 16.4196 6.46607 16.9634 7.04464C17.6357 6.91875 18.2786 6.66696 18.8518 6.32946C18.6295 7.01786 18.1634 7.59911 17.5446 7.96607C18.1446 7.90179 18.7232 7.73571 19.2589 7.50268C18.8545 8.09732 18.3482 8.625 17.767 9.04554Z"
          fill="#406EDC"
        />
      </svg>
    </a>
  )
}

export const LinkToDiscord = () => {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href="https://discord.gg/2EaKvrs"
    >
      <svg
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12Z"
          fill="#406EDC"
        />
        <path
          d="M9.99998 12.6667C10.3682 12.6667 10.6666 12.3682 10.6666 12C10.6666 11.6318 10.3682 11.3333 9.99998 11.3333C9.63179 11.3333 9.33331 11.6318 9.33331 12C9.33331 12.3682 9.63179 12.6667 9.99998 12.6667Z"
          stroke="#EDF0F2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M14 12.6667C14.3682 12.6667 14.6666 12.3682 14.6666 12C14.6666 11.6318 14.3682 11.3333 14 11.3333C13.6318 11.3333 13.3333 11.6318 13.3333 12C13.3333 12.3682 13.6318 12.6667 14 12.6667Z"
          stroke="#EDF0F2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M9 9C11.3333 8.33333 12.6667 8.33333 15 9"
          stroke="#EDF0F2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M8.66663 15C11 15.6667 13 15.6667 15.3333 15"
          stroke="#EDF0F2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M14.3333 15.3333C14.3333 16 15.3333 17.3333 15.6666 17.3333C16.6666 17.3333 17.5553 16.222 18 15.3333C18.4446 14.222 18.3333 11.4447 17 7.66667C16.0286 6.99001 15 6.77334 14 6.66667L13.3333 8.33334"
          stroke="#EDF0F2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M9.66662 15.3333C9.66662 16 8.76262 17.3333 8.44529 17.3333C7.49262 17.3333 6.64662 16.222 6.22329 15.3333C5.79995 14.222 5.90595 11.4447 7.17529 7.66667C8.10062 6.99001 9.02995 6.77334 9.99995 6.66667L10.6666 8.33334"
          stroke="#EDF0F2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </a>
  )
}

export const LinkToMedium = () => {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href="https://ccaiofficial.medium.com/"
    >
      <svg
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M24.0002 12C24.0002 18.6274 18.6277 24 12.0002 24C5.37283 24 0.000244141 18.6274 0.000244141 12C0.000244141 5.37258 5.37283 0 12.0002 0C18.6277 0 24.0002 5.37258 24.0002 12Z"
          fill="#406EDC"
        />
        <path
          d="M7.42321 8.78998C7.43812 8.63535 7.38195 8.48252 7.27195 8.37845L6.1515 6.96164V6.75H9.6305L12.3196 12.9405L14.6837 6.75H18.0002V6.96164L17.0423 7.92578C16.9597 7.99186 16.9187 8.10047 16.9358 8.20797V15.292C16.9187 15.3995 16.9597 15.5081 17.0423 15.5742L17.9778 16.5384V16.75H13.272V16.5384L14.2411 15.5507C14.3364 15.4508 14.3364 15.4214 14.3364 15.2685V9.54247L11.6417 16.7265H11.2776L8.1403 9.54247V14.3573C8.11414 14.5597 8.17819 14.7635 8.31397 14.9099L9.57447 16.5148V16.7265H6.00024V16.5148L7.26075 14.9099C7.39554 14.7633 7.45585 14.5581 7.42321 14.3573V8.78998Z"
          fill="white"
        />
      </svg>
    </a>
  )
}

export const LinkToYouTube = () => {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href="https://www.youtube.com/channel/UCyUM72zWism4-LdA2J4bwew"
    >
      <svg
        width="30"
        height="30"
        viewBox="0 0 24 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12.0002" cy="12.6484" r="12" fill="#366CE5" />
        <path
          d="M18.981 8.98426C18.8125 8.3316 18.3184 7.81712 17.6918 7.64138C16.5472 7.31519 11.9684 7.31519 11.9684 7.31519C11.9684 7.31519 7.38988 7.31519 6.24522 7.62901C5.63071 7.80456 5.12458 8.3317 4.95602 8.98426C4.65479 10.1763 4.65479 12.6485 4.65479 12.6485C4.65479 12.6485 4.65479 15.1332 4.95602 16.3128C5.12476 16.9653 5.61865 17.4798 6.24531 17.6556C7.40193 17.9819 11.9686 17.9819 11.9686 17.9819C11.9686 17.9819 16.5472 17.9819 17.6918 17.668C18.3185 17.4924 18.8125 16.9779 18.9812 16.3253C19.2823 15.1332 19.2823 12.6611 19.2823 12.6611C19.2823 12.6611 19.2944 10.1763 18.981 8.98426ZM10.5107 14.9324V10.3646L14.3181 12.6485L10.5107 14.9324Z"
          fill="#EAEEF2"
        />
      </svg>
    </a>
  )
}
