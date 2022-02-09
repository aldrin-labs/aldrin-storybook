import React from 'react'

import { RINProviderURL } from '@sb/dexUtils/utils'

import { StyledLink, StyledA, StyledButton } from './styles'

export const TradeLink = ({ isActive }: { isActive: boolean }) => {
  return (
    <StyledLink to="/chart/spot/CCAI_USDC">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 19 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M2.33952 16.3821V17.8337H3.33952V16.3821H4.68475V8.91687H3.33952V0H2.33952V8.91687H0.991455V16.3821H2.33952Z"
          fill={isActive ? '#0E02EC' : '#F5F5FB'}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M15.6925 16.3821V17.8337H16.6925V16.3821H18.0387V8.91687H16.6925V0H15.6925V8.91687H14.3454V16.3821H15.6925Z"
          fill={isActive ? '#0E02EC' : '#F5F5FB'}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.01501 8.91677V17.8337H10.015V8.91677H11.3622V1.45151H10.015V0H9.01501V1.45151H7.66891V8.91677H9.01501Z"
          fill={isActive ? '#0E02EC' : '#F5F5FB'}
        />
      </svg>
      <span style={{ color: isActive ? '#0E02EC' : '#F5F5FB' }}>Trade</span>
    </StyledLink>
  )
}

export const AnalyticsLink = ({ isActive }: { isActive: boolean }) => {
  return (
    <StyledLink to="/analytics">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 19 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          opacity="0.8"
          d="M3.68351 13.618L2.26822 17.3432C1.57323 19.1725 2.9245 21.1314 4.88138 21.1314H15.1629C16.9729 21.1314 18.4402 19.6641 18.4402 17.8541V6.3868C18.4402 5.08447 16.6345 4.753 16.1719 5.97043C15.789 6.97843 14.363 6.97842 13.9801 5.97043L13.8781 5.70213C13.4596 4.60038 11.901 4.60037 11.4824 5.70212L8.47499 13.618C8.05641 14.7198 6.49783 14.7198 6.07925 13.618C5.66067 12.5163 4.10209 12.5163 3.68351 13.618Z"
          fill="url(#paint0_linear)"
        />
        <path
          opacity="0.8"
          d="M0.82901 21.1314L3.68351 13.618C4.10209 12.5163 5.66067 12.5163 6.07925 13.618V13.618C6.49782 14.7198 8.05641 14.7198 8.47499 13.618L11.4824 5.70212C11.901 4.60037 13.4596 4.60038 13.8781 5.70213L13.9801 5.97043C14.363 6.97842 15.789 6.97843 16.1719 5.97043V5.97043C16.6345 4.753 18.4402 5.08447 18.4402 6.3868V21.1314"
          stroke={isActive ? '#0E02EC' : '#F8FAFF'}
        />
        <defs>
          <linearGradient
            id="paint0_linear"
            x1="9.63463"
            y1="0"
            x2="9.63463"
            y2="21.1314"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>{' '}
      <span style={{ color: isActive ? '#0E02EC' : '#F5F5FB' }}>Analytics</span>
    </StyledLink>
  )
}

export const PoolsLink = ({ isActive }: { isActive: boolean }) => {
  return (
    <StyledLink to="/pools">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 17 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8.5 17C13.1944 17 17 13.1944 17 8.5C17 3.8056 13.1944 0 8.5 0C3.80557 0 0 3.8056 0 8.5C0 13.1944 3.80557 17 8.5 17ZM4.2791 9C4.25987 8.836 4.25 8.66913 4.25 8.5C4.25 6.15277 6.15279 4.25 8.5 4.25C10.8472 4.25 12.75 6.15277 12.75 8.5C12.75 8.66913 12.7401 8.836 12.7209 9H4.2791Z"
          fill={isActive ? '#0E02EC' : '#F8FAFF'}
        />
      </svg>
      <span style={{ color: isActive ? '#0E02EC' : '#F5F5FB' }}>Pools</span>
    </StyledLink>
  )
}

export const SwapsLink = ({ isActive }: { isActive: boolean }) => {
  return (
    <StyledLink to="/swap">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 18 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4.53227 0.146447C4.33701 -0.0488155 4.02042 -0.0488155 3.82516 0.146447L0.643181 3.32843C0.447919 3.52369 0.447919 3.84027 0.643181 4.03553C0.838443 4.2308 1.15503 4.2308 1.35029 4.03553L3.67871 1.70711L3.67872 15.5C3.67872 15.7761 3.90257 16 4.17872 16C4.45486 16 4.67872 15.7761 4.67872 15.5L4.67872 1.70711L7.00714 4.03553C7.2024 4.2308 7.51899 4.2308 7.71425 4.03553C7.90951 3.84027 7.90951 3.52369 7.71425 3.32843L4.53227 0.146447ZM13.7826 15.8536C13.9779 16.0488 14.2945 16.0488 14.4897 15.8536L17.6717 12.6716C17.867 12.4763 17.867 12.1597 17.6717 11.9645C17.4764 11.7692 17.1599 11.7692 16.9646 11.9645L14.6362 14.2929L14.6362 0.5C14.6362 0.223858 14.4123 7.45058e-09 14.1362 7.45058e-09C13.86 7.45058e-09 13.6362 0.223858 13.6362 0.5L13.6362 14.2929L11.3077 11.9645C11.1125 11.7692 10.7959 11.7692 10.6006 11.9645C10.4054 12.1597 10.4054 12.4763 10.6006 12.6716L13.7826 15.8536Z"
          fill={isActive ? '#0E02EC' : '#F8FAFF'}
        />
      </svg>
      <span style={{ color: isActive ? '#0E02EC' : '#F5F5FB' }}>Swap</span>
    </StyledLink>
  )
}

export const RebalanceLink = ({ isActive }: { isActive: boolean }) => {
  return (
    <StyledLink to="/rebalance">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 23 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.07792 1.48116C9.85889 1.16357 10.6962 1 11.5421 1C12.3879 1 13.2253 1.16357 14.0062 1.48116C14.7872 1.79874 15.4962 2.26398 16.093 2.8499C16.6898 3.43579 17.1626 4.13084 17.4851 4.89513C17.8076 5.65939 17.9734 6.4782 17.9734 7.30488H18.9734C18.9734 6.3443 18.7807 5.39334 18.4065 4.5064C18.0323 3.61948 17.484 2.8142 16.7935 2.13631C16.1031 1.45844 15.2839 0.921197 14.3829 0.554823C13.482 0.188455 12.5167 0 11.5421 0C10.5674 0 9.60215 0.188455 8.70122 0.554823C7.80028 0.921198 6.98107 1.45844 6.29061 2.13631C5.60012 2.8142 5.05189 3.61948 4.67769 4.5064C4.44983 5.04647 4.28926 5.61027 4.19851 6.18553L1.78233 3.76934C1.58706 3.57408 1.27048 3.57408 1.07522 3.76934C0.879956 3.96461 0.879956 4.28119 1.07522 4.47645L4.2572 7.65843C4.45246 7.85369 4.76904 7.85369 4.96431 7.65843L8.14629 4.47645C8.34155 4.28119 8.34155 3.96461 8.14629 3.76934C7.95102 3.57408 7.63444 3.57408 7.43918 3.76934L5.26173 5.9468C5.34243 5.58814 5.45514 5.2362 5.59904 4.89513C5.9215 4.13084 6.3944 3.43579 6.99117 2.8499C7.58797 2.26399 8.29697 1.79874 9.07792 1.48116ZM14.0064 14.2627C13.2254 14.5803 12.3881 14.7439 11.5422 14.7439C10.6964 14.7439 9.85904 14.5803 9.07808 14.2627C8.29712 13.9452 7.58812 13.4799 6.99133 12.894C6.39455 12.3081 5.92166 11.6131 5.5992 10.8488C5.27674 10.0845 5.1109 9.2657 5.1109 8.43902H4.1109C4.1109 9.3996 4.30363 10.3506 4.67784 11.2375C5.05205 12.1244 5.60027 12.9297 6.29076 13.6076C6.98123 14.2855 7.80043 14.8227 8.70137 15.1891C9.6023 15.5554 10.5676 15.7439 11.5422 15.7439C12.5169 15.7439 13.4822 15.5554 14.3831 15.1891C15.284 14.8227 16.1032 14.2855 16.7937 13.6076C17.4842 12.9297 18.0324 12.1244 18.4066 11.2375C18.6345 10.6974 18.795 10.1336 18.8858 9.55836L21.302 11.9746C21.4972 12.1698 21.8138 12.1698 22.0091 11.9746C22.2043 11.7793 22.2043 11.4627 22.0091 11.2674L18.8271 8.08546C18.6318 7.8902 18.3153 7.8902 18.12 8.08546L14.938 11.2674C14.7428 11.4627 14.7428 11.7793 14.938 11.9746C15.1333 12.1698 15.4499 12.1698 15.6451 11.9746L17.8226 9.7971C17.7419 10.1558 17.6292 10.5077 17.4853 10.8488C17.1628 11.6131 16.6899 12.3081 16.0931 12.894C15.4963 13.4799 14.7873 13.9452 14.0064 14.2627Z"
          fill={isActive ? '#0E02EC' : '#F8FAFF'}
        />
      </svg>
      <span style={{ color: isActive ? '#0E02EC' : '#F5F5FB' }}>Rebalance</span>
    </StyledLink>
  )
}

export const WalletLink = ({ isActive }) => {
  return (
    <StyledA href={RINProviderURL} target="_blank">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15.36 0H0.64C0.286 0 0 0.286 0 0.64V15.36C0 15.714 0.286 16 0.64 16H15.36C15.714 16 16 15.714 16 15.36V0.64C16 0.286 15.714 0 15.36 0ZM14.72 9.28H8.32V6.72H14.72V9.28ZM9.36 8C9.36 8.21217 9.44428 8.41566 9.59431 8.56569C9.74434 8.71572 9.94783 8.8 10.16 8.8C10.3722 8.8 10.5757 8.71572 10.7257 8.56569C10.8757 8.41566 10.96 8.21217 10.96 8C10.96 7.78783 10.8757 7.58434 10.7257 7.43431C10.5757 7.28429 10.3722 7.2 10.16 7.2C9.94783 7.2 9.74434 7.28429 9.59431 7.43431C9.44428 7.58434 9.36 7.78783 9.36 8Z"
          fill={isActive ? '#0E02EC' : '#F5F5FB'}
        />
      </svg>
      <span style={{ color: isActive ? '#0E02EC' : '#F5F5FB' }}>Wallet™</span>
    </StyledA>
  )
}

export const FeedbackBtn = ({
  isActive,
  onClick,
}: {
  isActive: boolean
  onClick: any
}) => {
  return (
    <StyledButton onClick={onClick}>
      <svg
        width="90%"
        height="90%"
        viewBox="0 0 19 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.7983 0C11.4376 0 11.0917 0.143285 10.8367 0.398335C10.5816 0.653384 10.4383 0.999306 10.4383 1.36V4.08C10.4383 4.44069 10.5816 4.78662 10.8367 5.04167C11.0917 5.29671 11.4376 5.44 11.7983 5.44V7.48L14.2463 5.44H17.2383C17.599 5.44 17.945 5.29671 18.2 5.04167C18.4551 4.78662 18.5983 4.44069 18.5983 4.08V1.36C18.5983 0.999306 18.4551 0.653384 18.2 0.398335C17.945 0.143285 17.599 0 17.2383 0H11.7983ZM5.67834 3.4C4.95695 3.4 4.26511 3.68657 3.75501 4.19667C3.24491 4.70677 2.95834 5.39861 2.95834 6.12C2.95834 6.84139 3.24491 7.53323 3.75501 8.04333C4.26511 8.55343 4.95695 8.84 5.67834 8.84C6.39973 8.84 7.09157 8.55343 7.60167 8.04333C8.11177 7.53323 8.39834 6.84139 8.39834 6.12C8.39834 5.39861 8.11177 4.70677 7.60167 4.19667C7.09157 3.68657 6.39973 3.4 5.67834 3.4ZM9.07834 10.2H2.27834C1.7373 10.2 1.21842 10.4149 0.835845 10.7975C0.45327 11.1801 0.238342 11.699 0.238342 12.24C0.238342 13.7578 0.862582 14.9736 1.88666 15.7964C2.89442 16.6056 4.24626 17 5.67834 17C7.11042 17 8.46226 16.6056 9.47002 15.7964C10.4927 14.9736 11.1183 13.7578 11.1183 12.24C11.1183 11.699 10.9034 11.1801 10.5208 10.7975C10.1383 10.4149 9.61938 10.2 9.07834 10.2Z"
          fill={isActive ? '#0E02EC' : '#F8FAFF'}
        />
      </svg>

      <span style={{ color: isActive ? '#0E02EC' : '#F5F5FB' }}>Feedback</span>
    </StyledButton>
  )
}

export const DashboardLink = ({ isActive }: { isActive: boolean }) => {
  return (
    <StyledLink to="/dashboard">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 17 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13.3572 11.5357H14.5715V14.5714H13.3572V11.5357Z"
          fill={isActive ? '#0E02EC' : '#F5F5FB'}
        />
        <path
          d="M10.9286 8.5H12.1429V14.5714H10.9286V8.5Z"
          fill={isActive ? '#0E02EC' : '#F5F5FB'}
        />
        <path
          d="M5.4643 14.5714C4.65948 14.5705 3.88789 14.2503 3.31879 13.6812C2.7497 13.1121 2.42955 12.3405 2.42859 11.5357H3.64287C3.64287 11.896 3.7497 12.2481 3.94984 12.5476C4.14998 12.8472 4.43445 13.0806 4.76727 13.2185C5.1001 13.3564 5.46632 13.3924 5.81965 13.3221C6.17297 13.2519 6.49752 13.0784 6.75225 12.8237C7.00698 12.5689 7.18045 12.2444 7.25073 11.8911C7.32101 11.5377 7.28494 11.1715 7.14708 10.8387C7.00922 10.5059 6.77577 10.2214 6.47623 10.0213C6.1767 9.82111 5.82455 9.71429 5.4643 9.71429V8.5C6.26942 8.5 7.04157 8.81983 7.61088 9.38914C8.18018 9.95845 8.50002 10.7306 8.50002 11.5357C8.50002 12.3408 8.18018 13.113 7.61088 13.6823C7.04157 14.2516 6.26942 14.5714 5.4643 14.5714Z"
          fill={isActive ? '#0E02EC' : '#F5F5FB'}
        />
        <path
          d="M15.7857 0H1.21429C0.892336 0.000321468 0.583664 0.128358 0.356011 0.356011C0.128358 0.583664 0.000321468 0.892336 0 1.21429V15.7857C0.000321468 16.1077 0.128358 16.4163 0.356011 16.644C0.583664 16.8716 0.892336 16.9997 1.21429 17H15.7857C16.1076 16.9995 16.4162 16.8714 16.6438 16.6438C16.8714 16.4162 16.9995 16.1076 17 15.7857V1.21429C16.9997 0.892336 16.8716 0.583664 16.644 0.356011C16.4163 0.128358 16.1077 0.000321468 15.7857 0ZM15.7857 5.46429H7.28571V1.21429H15.7857V5.46429ZM6.07143 1.21429V5.46429H1.21429V1.21429H6.07143ZM1.21429 15.7857V6.67857H15.7857L15.7869 15.7857H1.21429Z"
          fill={isActive ? '#0E02EC' : '#F5F5FB'}
        />
      </svg>

      <span style={{ color: isActive ? '#0E02EC' : '#F5F5FB' }}>Dashboard</span>
    </StyledLink>
  )
}

export const StakingLink = ({ isActive }: { isActive: boolean }) => {
  return (
    <StyledLink to="/staking">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 17 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="0.5"
          y="12.5"
          width="16"
          height="3"
          rx="1.5"
          stroke={isActive ? '#0E02EC' : '#F5F5FB'}
        />
        <rect
          x="0.5"
          y="8.5"
          width="16"
          height="3"
          rx="1.5"
          stroke={isActive ? '#0E02EC' : '#F5F5FB'}
        />
        <rect
          x="0.5"
          y="4.5"
          width="16"
          height="3"
          rx="1.5"
          stroke={isActive ? '#0E02EC' : '#F5F5FB'}
        />
        <rect
          x="0.5"
          y="0.5"
          width="16"
          height="3"
          rx="1.5"
          stroke={isActive ? '#0E02EC' : '#F5F5FB'}
        />
      </svg>
      <span style={{ color: isActive ? '#0E02EC' : '#F5F5FB' }}>Staking</span>
    </StyledLink>
  )
}
