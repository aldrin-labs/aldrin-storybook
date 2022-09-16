import React from 'react'
import { useTheme } from 'styled-components'

import {
  IconContainer,
  SearchIconContainer,
  TooltipIconContainer,
} from './index.styles'

export const PlusIcon = ({ color }: { color?: string }) => {
  const theme = useTheme()
  return (
    <svg
      style={{ margin: '0 3px 2px 0' }}
      width="12"
      height="12"
      viewBox="0 0 13 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.50004 12.4163C9.47921 12.4163 11.9167 9.97884 11.9167 6.99967C11.9167 4.02051 9.47921 1.58301 6.50004 1.58301C3.52087 1.58301 1.08337 4.02051 1.08337 6.99967C1.08337 9.97884 3.52087 12.4163 6.50004 12.4163Z"
        stroke={theme.colors[color || 'blue1']}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.33337 7H8.66671"
        stroke={theme.colors[color || 'blue1']}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 9.16634V4.83301"
        stroke={theme.colors[color || 'blue1']}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export const MinusIcon = ({ color }: { color?: string }) => {
  const theme = useTheme()
  return (
    <svg
      style={{ margin: '0 3px 2px 0' }}
      width="12"
      height="12"
      viewBox="0 0 13 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.49992 12.4167C9.47909 12.4167 11.9166 9.97917 11.9166 7C11.9166 4.02084 9.47909 1.58334 6.49992 1.58334C3.52075 1.58334 1.08325 4.02084 1.08325 7C1.08325 9.97917 3.52075 12.4167 6.49992 12.4167Z"
        stroke={theme.colors[color || 'blue1']}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.33325 7H8.66659"
        stroke={theme.colors[color || 'blue1']}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export const SearchIcon = () => {
  const theme = useTheme()

  return (
    <SearchIconContainer
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="5.95007"
        cy="5.9502"
        r="4.5"
        stroke={theme.colors.gray1}
        strokeWidth="2"
      />
      <path
        d="M9.25 9.25L12.432 12.432"
        stroke={theme.colors.gray1}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SearchIconContainer>
  )
}

export const FilterIcon = ({ isActive }: { isActive: boolean }) => {
  const theme = useTheme()

  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.53862 7.60387V15.3846C5.53862 15.4896 5.56546 15.5928 5.61658 15.6844C5.66771 15.7761 5.74142 15.8531 5.8307 15.9082C5.91999 15.9634 6.0219 15.9948 6.12673 15.9994C6.23156 16.004 6.33584 15.9818 6.42966 15.9348L10.1218 14.0887C10.2239 14.0375 10.3097 13.959 10.3697 13.8618C10.4297 13.7646 10.4615 13.6527 10.4615 13.5385V7.60387L15.8606 1.00584C15.9118 0.943289 15.9503 0.871261 15.9737 0.793867C15.9971 0.716474 16.005 0.635229 15.997 0.554772C15.989 0.474315 15.9652 0.396221 15.927 0.32495C15.8889 0.253679 15.837 0.190627 15.7745 0.139392C15.7119 0.088157 15.6399 0.0497438 15.5625 0.0263453C15.4851 0.00294681 15.4039 -0.00497876 15.3234 0.00302122C15.243 0.0110212 15.1649 0.0347901 15.0936 0.0729706C15.0223 0.111151 14.9593 0.162996 14.908 0.225544L9.36983 6.99465C9.27979 7.10472 9.23065 7.24258 9.23076 7.3848V13.1582L6.76933 14.389V7.3848C6.76945 7.24258 6.72031 7.10472 6.63026 6.99465L1.91417 1.23106H11.6922C11.8554 1.23106 12.0119 1.16623 12.1273 1.05083C12.2427 0.93542 12.3075 0.778898 12.3075 0.615691C12.3075 0.452484 12.2427 0.295961 12.1273 0.180556C12.0119 0.0651514 11.8554 0.00031753 11.6922 0.00031753H0.615767C0.499194 0.000239757 0.384996 0.0332774 0.286469 0.095584C0.187942 0.157891 0.10914 0.246903 0.059236 0.352258C0.00933233 0.457613 -0.00961954 0.574976 0.00458693 0.690684C0.0187934 0.806392 0.0655737 0.915684 0.139482 1.00584L5.53862 7.60387Z"
        fill={isActive ? theme.colors.violet2 : theme.colors.white3}
      />
    </svg>
  )
}

export const TooltipIcon = ({
  color,
  margin,
}: {
  color: string
  margin?: string
}) => {
  const theme = useTheme()
  return (
    <TooltipIconContainer
      margin={margin}
      width="11"
      height="11"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11Z"
        stroke={theme.colors[color]}
      />
      <path
        d="M6 3.5H6.00583"
        stroke={theme.colors[color]}
        strokeLinecap="round"
      />
      <path
        d="M6 5.5V8"
        stroke={theme.colors[color]}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </TooltipIconContainer>
  )
}

export const CLiquidityIcon = ({ isActive }: { isActive: boolean }) => {
  const theme = useTheme()

  return (
    <IconContainer
      width="12"
      height="12"
      viewBox="0 0 13 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.1104 7.54134H2.20024C2.33242 8.58844 2.84216 9.55132 3.6338 10.2493C4.42544 10.9473 5.44458 11.3324 6.49999 11.3324C7.5554 11.3324 8.57454 10.9473 9.36618 10.2493C10.1578 9.55132 10.6676 8.58844 10.7997 7.54134H11.8901C11.6182 10.2784 9.30853 12.4163 6.49999 12.4163C3.69145 12.4163 1.38178 10.2784 1.1104 7.54134ZM1.1104 6.45801C1.38124 3.72097 3.69091 1.58301 6.49999 1.58301C9.30907 1.58301 11.6182 3.72097 11.8896 6.45801H10.7997C10.6676 5.41091 10.1578 4.44803 9.36618 3.75004C8.57454 3.05205 7.5554 2.66692 6.49999 2.66692C5.44458 2.66692 4.42544 3.05205 3.6338 3.75004C2.84216 4.44803 2.33242 5.41091 2.20024 6.45801H1.10986H1.1104ZM6.49999 8.08301C6.21267 8.08301 5.93712 7.96887 5.73396 7.76571C5.53079 7.56254 5.41666 7.28699 5.41666 6.99967C5.41666 6.71236 5.53079 6.43681 5.73396 6.23364C5.93712 6.03048 6.21267 5.91634 6.49999 5.91634C6.78731 5.91634 7.06286 6.03048 7.26602 6.23364C7.46919 6.43681 7.58332 6.71236 7.58332 6.99967C7.58332 7.28699 7.46919 7.56254 7.26602 7.76571C7.06286 7.96887 6.78731 8.08301 6.49999 8.08301Z"
        fill={isActive ? theme.colors.white1 : theme.colors.white3}
      />
    </IconContainer>
  )
}

export const LockedIcon = () => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.33334 10.1933V3.80668C1.33334 2.92001 1.84668 2.70668 2.47334 3.33335L4.20001 5.06001C4.46001 5.32001 4.88668 5.32001 5.14001 5.06001L7.52668 2.66668C7.78668 2.40668 8.21334 2.40668 8.46668 2.66668L10.86 5.06001C11.12 5.32001 11.5467 5.32001 11.8 5.06001L13.5267 3.33335C14.1533 2.70668 14.6667 2.92001 14.6667 3.80668V10.2C14.6667 12.2 13.3333 13.5333 11.3333 13.5333H4.66668C2.82668 13.5267 1.33334 12.0333 1.33334 10.1933Z"
        stroke="#ECD502"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export const WalletIcon = () => {
  const theme = useTheme()
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.5 4.5H3.5"
        stroke="#5B5A72"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 5.48495V6.51498C11 6.78998 10.78 7.01496 10.5 7.02496H9.52C8.98 7.02496 8.48502 6.62997 8.44002 6.08997C8.41002 5.77497 8.53001 5.47996 8.74001 5.27496C8.92501 5.08496 9.18001 4.97498 9.46001 4.97498H10.5C10.78 4.98498 11 5.20995 11 5.48495Z"
        fill="#14141F"
        stroke="#5B5A72"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.73999 5.27499C8.52999 5.47999 8.41 5.775 8.44 6.09C8.485 6.63 8.97999 7.02499 9.51999 7.02499H10.5V7.75C10.5 9.25 9.5 10.25 8 10.25H3.5C2 10.25 1 9.25 1 7.75V4.25C1 2.89 1.82 1.94 3.095 1.78C3.225 1.76 3.36 1.75 3.5 1.75H8C8.13 1.75 8.255 1.75499 8.375 1.77499C9.665 1.92499 10.5 2.88 10.5 4.25V4.97501H9.45999C9.17999 4.97501 8.92499 5.08499 8.73999 5.27499Z"
        stroke="#5B5A72"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export const YourPositionsIcon = ({ isActive }: { isActive: boolean }) => {
  const theme = useTheme()
  return (
    <IconContainer
      width="12"
      height="13"
      viewBox="0 0 13 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.92333 7C11.3317 7 11.9167 6.45833 11.3967 4.68166C11.0446 3.48458 10.0154 2.45541 8.81833 2.10333C7.04167 1.58333 6.5 2.16833 6.5 3.57666V5.13666C6.5 6.45833 7.04167 7 8.125 7H9.92333Z"
        stroke={isActive ? theme.colors.white1 : theme.colors.white3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.8333 8.46251C10.3295 10.9704 7.92453 12.7904 5.18911 12.3463C3.13619 12.0158 1.48411 10.3638 1.14828 8.31084C0.709525 5.58626 2.51869 3.18126 5.01578 2.67209"
        stroke={isActive ? theme.colors.white1 : theme.colors.white3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconContainer>
  )
}

export const YourPoolsIcon = ({ isActive }: { isActive: boolean }) => {
  const theme = useTheme()

  return (
    <IconContainer
      width="13"
      height="14"
      viewBox="0 0 13 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="4.0625"
        y="1.3125"
        width="4.875"
        height="4.875"
        rx="2.4375"
        stroke={isActive ? theme.colors.white1 : theme.colors.white3}
      />
      <path
        d="M11.1841 9.92156C12.2232 11.212 10.8447 12.6875 9.1878 12.6875C8.38741 12.6875 7.47219 12.6875 6.5 12.6875C5.52781 12.6875 4.61259 12.6875 3.8122 12.6875C2.15535 12.6875 0.776763 11.212 1.81593 9.92156C2.84192 8.64745 4.5572 7.8125 6.5 7.8125C8.4428 7.8125 10.1581 8.64745 11.1841 9.92156Z"
        stroke={isActive ? theme.colors.white1 : theme.colors.white3}
      />
    </IconContainer>
  )
}

export const ArrowsIcon = () => {
  return (
    <IconContainer
      width="12"
      height="12"
      viewBox="0 0 13 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.88042 11.1044L2.16125 8.39062"
        stroke="#FAFAFA"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.88037 1.89551V11.1038"
        stroke="#FAFAFA"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.11963 1.89551L10.8388 4.60926"
        stroke="#A9A9B2"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.11963 11.1038V1.89551"
        stroke="#A9A9B2"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconContainer>
  )
}

export const FlashIcon = ({ isActive }: { isActive: boolean }) => {
  const theme = useTheme()
  return (
    <IconContainer
      width="13"
      height="14"
      viewBox="0 0 13 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.29885 7.69333H4.9726V11.5933C4.9726 12.5033 5.46551 12.6875 6.06676 12.005L10.1672 7.34666C10.6709 6.77791 10.4597 6.30666 9.69593 6.30666H8.02218V2.40666C8.02218 1.49666 7.52926 1.3125 6.92801 1.995L2.8276 6.65333C2.32926 7.2275 2.54051 7.69333 3.29885 7.69333Z"
        stroke={isActive ? theme.colors.white1 : theme.colors.white3}
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconContainer>
  )
}

export const CopyIcon = () => {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 4.33333V7.96296C9 8.53333 8.53333 9 7.96296 9H4.33333"
        stroke="#E0E0E5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.09091 1H5.90909C6.50909 1 7 1.49091 7 2.09091V5.90909C7 6.50909 6.50909 7 5.90909 7H2.09091C1.49091 7 1 6.50909 1 5.90909V2.09091C1 1.49091 1.49091 1 2.09091 1Z"
        stroke="#E0E0E5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export const ClockIcon = ({
  color,
  margin,
}: {
  color: string
  margin?: string
}) => {
  const theme = useTheme()

  return (
    <IconContainer
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11 6C11 8.76 8.76 11 6 11C3.24 11 1 8.76 1 6C1 3.24 3.24 1 6 1C8.76 1 11 3.24 11 6Z"
        stroke={theme.colors[color || 'white1']}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.85494 7.59L6.30494 6.665C6.03494 6.505 5.81494 6.12 5.81494 5.805V3.755"
        stroke={theme.colors[color || 'white1']}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconContainer>
  )
}

export const EditIcon = () => {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.80549 2.69943L11.3006 4.19382L9.80549 2.69943ZM10.7669 1.38294L6.72425 5.42561C6.51536 5.6342 6.3729 5.89996 6.31483 6.18939L5.94141 8.05861L7.81062 7.68448C8.10004 7.6266 8.36546 7.48471 8.5744 7.27577L12.6171 3.23309C12.7386 3.11161 12.8349 2.96739 12.9007 2.80866C12.9664 2.64994 13.0003 2.47982 13.0003 2.30801C13.0003 2.13621 12.9664 1.96609 12.9007 1.80737C12.8349 1.64864 12.7386 1.50442 12.6171 1.38294C12.4956 1.26145 12.3514 1.16509 12.1926 1.09934C12.0339 1.03359 11.8638 0.999756 11.692 0.999756C11.5202 0.999756 11.3501 1.03359 11.1913 1.09934C11.0326 1.16509 10.8884 1.26145 10.7669 1.38294V1.38294Z"
        stroke="#5B5A72"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M11.5885 9.47059V11.5883C11.5885 11.9627 11.4397 12.3218 11.175 12.5866C10.9102 12.8513 10.5511 13.0001 10.1767 13.0001H2.41179C2.03736 13.0001 1.67827 12.8513 1.4135 12.5866C1.14874 12.3218 1 11.9627 1 11.5883V3.82342C1 3.44898 1.14874 3.08989 1.4135 2.82513C1.67827 2.56036 2.03736 2.41162 2.41179 2.41162H4.52949"
        stroke="#5B5A72"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  )
}

export const MailIcon = () => {
  return (
    <svg
      style={{ marginRight: '0.5em' }}
      width="17"
      height="16"
      viewBox="0 0 22 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20.4286 0H1.57143C1.15466 0 0.754961 0.168571 0.460261 0.468629C0.165561 0.768687 0 1.17565 0 1.6V14.4C0 14.8243 0.165561 15.2313 0.460261 15.5314C0.754961 15.8314 1.15466 16 1.57143 16H20.4286C20.8453 16 21.245 15.8314 21.5397 15.5314C21.8344 15.2313 22 14.8243 22 14.4V1.6C22 1.17565 21.8344 0.768687 21.5397 0.468629C21.245 0.168571 20.8453 0 20.4286 0ZM18.7 1.6L11 7.024L3.3 1.6H18.7ZM1.57143 14.4V2.328L10.5521 8.656C10.6837 8.7489 10.8399 8.79869 11 8.79869C11.1601 8.79869 11.3163 8.7489 11.4479 8.656L20.4286 2.328V14.4H1.57143Z"
        fill="#A9A9B2"
      />
    </svg>
  )
}
