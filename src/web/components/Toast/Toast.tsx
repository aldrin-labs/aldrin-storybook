import React from 'react'

import { SvgIcon } from '@sb/components'

import ErrorIcon from './images/error.svg'
import SuccessIcon from './images/success.svg'
import {
  Container,
  Left,
  Right,
  Title,
  Description,
  ProgressContainer, DescriptionSuccess, DescriptionError
} from "./Toast.styles"

type ProgressOptionsType = {
  value: number
  segments: number
}

type ProgressProps = Pick<ToastProps, 'type'> & {
  options: ProgressOptionsType
}

const Progress = (props: ProgressProps) => {
  const { options } = props

  return (
    <ProgressContainer>
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="40" height="40" rx="20" fill="#212131" />

        {options.segments === 3 && (
          <>
            <path
              d="M32.1244 27C33.3531 24.8717 34 22.4575 34 20C34 17.5425 33.3531 15.1283 32.1244 13C30.8956 10.8717 29.1283 9.1044 27 7.87564C24.8717 6.64689 22.4575 6 20 6"
              stroke={options.value >= 1 ? '#00FF84' : '#302F41'}
              strokeWidth="2"
            />
            <path
              d="M7.87564 27C9.1044 29.1283 10.8717 30.8956 13 32.1244C15.1283 33.3531 17.5425 34 20 34C22.4575 34 24.8717 33.3531 27 32.1244C29.1283 30.8956 30.8956 29.1283 32.1244 27"
              stroke={options.value >= 2 ? '#00FF84' : '#302F41'}
              strokeWidth="2"
            />
            <path
              d="M20 6C17.5425 6 15.1283 6.64689 13 7.87564C10.8717 9.1044 9.1044 10.8717 7.87564 13C6.64689 15.1283 6 17.5425 6 20C6 22.4575 6.64689 24.8717 7.87564 27"
              stroke={options.value >= 3 ? '#00FF84' : '#302F41'}
              strokeWidth="2"
            />
            <rect
              x="5.88916"
              y="26.2553"
              width="4"
              height="2"
              transform="rotate(-30 5.88916 26.2553)"
              fill="#212131"
            />
            <rect
              width="4"
              height="2"
              transform="matrix(-0.866025 -0.5 -0.5 0.866025 34.4641 27)"
              fill="#212131"
            />
            <rect
              x="21"
              y="4"
              width="4"
              height="2"
              transform="rotate(90 21 4)"
              fill="#212131"
            />
          </>
        )}

        {options.segments === 2 && (
          <>
            <path
              d="M20 34C23.713 34 27.274 32.525 29.8995 29.8995C32.525 27.274 34 23.713 34 20C34 16.287 32.525 12.726 29.8995 10.1005C27.274 7.475 23.713 6 20 6"
              stroke={options.value >= 1 ? '#00FF84' : '#302F41'}
              strokeWidth="2"
            />
            <path
              d="M20 6C18.1615 6 16.341 6.36212 14.6424 7.06568C12.9439 7.76925 11.4005 8.80048 10.1005 10.1005C8.80048 11.4005 7.76925 12.9439 7.06569 14.6424C6.36212 16.341 6 18.1615 6 20C6 21.8385 6.36212 23.659 7.06568 25.3576C7.76925 27.0561 8.80048 28.5995 10.1005 29.8995C11.4005 31.1995 12.9439 32.2307 14.6424 32.9343C16.341 33.6379 18.1615 34 20 34"
              stroke={options.value >= 2 ? '#00FF84' : '#302F41'}
              strokeWidth="2"
            />
            <rect
              x="21"
              y="4"
              width="4"
              height="2"
              transform="rotate(90 21 4)"
              fill="#212131"
            />
            <rect
              x="21"
              y="32"
              width="4"
              height="2"
              transform="rotate(90 21 32)"
              fill="#212131"
            />
          </>
        )}

        <path
          id="progress-spin"
          d="M14.4999 20C14.4999 19.2778 14.6422 18.5626 14.9186 17.8953C15.195 17.228 15.6001 16.6217 16.1109 16.111C16.6216 15.6002 17.2279 15.1951 17.8952 14.9187C18.5625 14.6423 19.2777 14.5 19.9999 14.5C20.7222 14.5 21.4374 14.6423 22.1047 14.9187C22.772 15.1951 23.3783 15.6002 23.889 16.111C24.3997 16.6217 24.8049 17.228 25.0813 17.8953C25.3577 18.5626 25.4999 19.2778 25.4999 20C25.4999 20.7223 25.3577 21.4375 25.0813 22.1048C24.8049 22.7721 24.3997 23.3784 23.889 23.8891C23.3783 24.3999 22.772 24.805 22.1047 25.0814C21.4374 25.3578 20.7222 25.5 19.9999 25.5C19.2777 25.5 18.5625 25.3578 17.8952 25.0814C17.2279 24.805 16.6216 24.3999 16.1109 23.8891C15.6001 23.3784 15.195 22.7721 14.9186 22.1048C14.6422 21.4375 14.4999 20.7223 14.4999 20L14.4999 20Z"
          stroke="#00FF84"
          strokeDasharray="2 2"
        />
      </svg>
    </ProgressContainer>
  )
}

type ToastProps = {
  title: string
  description?: string
  type: 'progress' | 'error' | 'success'
  progressOptions?: ProgressOptionsType
}

type ToastDescriptionProps = {
  type: 'progress' | 'error' | 'success'
  children: string
}

export const ToastDescription = (props: ToastDescriptionProps) => {
  const { children, type } = props

  if (type === 'success') {
    return <DescriptionSuccess>{children}</DescriptionSuccess>
  } else if (type === 'error') {
    return <DescriptionError>{children}</DescriptionError>
  }

  return <Description>{children}</Description>
}

export const Toast = (props: ToastProps) => {
  const { title, description, type, progressOptions } = props

  return (
    <Container>
      <Left>
        {type === 'progress' && (
          <Progress type={type} options={progressOptions} />
        )}
        {type === 'success' && (
          <SvgIcon src={SuccessIcon} height="40px" width="40px" />
        )}
        {type === 'error' && (
          <SvgIcon src={ErrorIcon} height="40px" width="40px" />
        )}
      </Left>
      <Right>
        <Title>{title}</Title>
        {!!description && (
          <ToastDescription type={type}>{description}</ToastDescription>
        )}
      </Right>
    </Container>
  )
}
