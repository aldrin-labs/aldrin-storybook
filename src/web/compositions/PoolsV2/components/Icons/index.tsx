import React from 'react'
import { useTheme } from 'styled-components'

import { SearchIconContainer, TooltipIconContainer } from './index.styles'

export const PlusIcon = ({ color }: { color?: stroke }) => {
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
        stroke={color || theme.colors.blue2}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.33337 7H8.66671"
        stroke={color || theme.colors.blue2}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 9.16634V4.83301"
        stroke={color || theme.colors.blue2}
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
        fill={isActive ? theme.colors.violet4 : theme.colors.gray13}
      />
    </svg>
  )
}

export const TooltipIcon = ({ color }: { color: string }) => {
  const theme = useTheme()
  return (
    <TooltipIconContainer
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
