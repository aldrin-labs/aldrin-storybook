import React from 'react'
import { useTheme } from 'styled-components'

import {
  Container,
  Left,
  Right,
  Title,
  Description,
  ProgressContainer,
  DescriptionSuccess,
  DescriptionError,
} from './Toast.styles'

type ProgressOptionsType = {
  value: number
  segments: number
}

type ProgressProps = Pick<ToastProps, 'type'> & {
  options: ProgressOptionsType
}

const Progress = (props: ProgressProps) => {
  const { options } = props

  const theme = useTheme()

  return (
    <ProgressContainer>
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="40" height="40" rx="20" fill={theme.colors.white5} />

        {options.segments === 3 && (
          <>
            <path
              d="M32.1244 27C33.3531 24.8717 34 22.4575 34 20C34 17.5425 33.3531 15.1283 32.1244 13C30.8956 10.8717 29.1283 9.1044 27 7.87564C24.8717 6.64689 22.4575 6 20 6"
              stroke={
                options.value >= 1 ? theme.colors.green3 : theme.colors.red4
              }
              strokeWidth="2"
            />
            <path
              d="M7.87564 27C9.1044 29.1283 10.8717 30.8956 13 32.1244C15.1283 33.3531 17.5425 34 20 34C22.4575 34 24.8717 33.3531 27 32.1244C29.1283 30.8956 30.8956 29.1283 32.1244 27"
              stroke={
                options.value >= 2 ? theme.colors.green3 : theme.colors.red4
              }
              strokeWidth="2"
            />
            <path
              d="M20 6C17.5425 6 15.1283 6.64689 13 7.87564C10.8717 9.1044 9.1044 10.8717 7.87564 13C6.64689 15.1283 6 17.5425 6 20C6 22.4575 6.64689 24.8717 7.87564 27"
              stroke={
                options.value >= 3 ? theme.colors.green3 : theme.colors.red4
              }
              strokeWidth="2"
            />
            <rect
              x="5.88916"
              y="26.2553"
              width="4"
              height="2"
              transform="rotate(-30 5.88916 26.2553)"
              fill={theme.colors.white5}
            />
            <rect
              width="4"
              height="2"
              transform="matrix(-0.866025 -0.5 -0.5 0.866025 34.4641 27)"
              fill={theme.colors.white5}
            />
            <rect
              x="21"
              y="4"
              width="4"
              height="2"
              transform="rotate(90 21 4)"
              fill={theme.colors.white5}
            />
          </>
        )}

        {options.segments === 2 && (
          <>
            <path
              d="M20 34C23.713 34 27.274 32.525 29.8995 29.8995C32.525 27.274 34 23.713 34 20C34 16.287 32.525 12.726 29.8995 10.1005C27.274 7.475 23.713 6 20 6"
              stroke={
                options.value >= 1 ? theme.colors.green3 : theme.colors.red4
              }
              strokeWidth="2"
            />
            <path
              d="M20 6C18.1615 6 16.341 6.36212 14.6424 7.06568C12.9439 7.76925 11.4005 8.80048 10.1005 10.1005C8.80048 11.4005 7.76925 12.9439 7.06569 14.6424C6.36212 16.341 6 18.1615 6 20C6 21.8385 6.36212 23.659 7.06568 25.3576C7.76925 27.0561 8.80048 28.5995 10.1005 29.8995C11.4005 31.1995 12.9439 32.2307 14.6424 32.9343C16.341 33.6379 18.1615 34 20 34"
              stroke={
                options.value >= 2 ? theme.colors.green3 : theme.colors.red4
              }
              strokeWidth="2"
            />
            <rect
              x="21"
              y="4"
              width="4"
              height="2"
              transform="rotate(90 21 4)"
              fill={theme.colors.white5}
            />
            <rect
              x="21"
              y="32"
              width="4"
              height="2"
              transform="rotate(90 21 32)"
              fill={theme.colors.white5}
            />
          </>
        )}

        <path
          id="progress-spin"
          d="M14.4999 20C14.4999 19.2778 14.6422 18.5626 14.9186 17.8953C15.195 17.228 15.6001 16.6217 16.1109 16.111C16.6216 15.6002 17.2279 15.1951 17.8952 14.9187C18.5625 14.6423 19.2777 14.5 19.9999 14.5C20.7222 14.5 21.4374 14.6423 22.1047 14.9187C22.772 15.1951 23.3783 15.6002 23.889 16.111C24.3997 16.6217 24.8049 17.228 25.0813 17.8953C25.3577 18.5626 25.4999 19.2778 25.4999 20C25.4999 20.7223 25.3577 21.4375 25.0813 22.1048C24.8049 22.7721 24.3997 23.3784 23.889 23.8891C23.3783 24.3999 22.772 24.805 22.1047 25.0814C21.4374 25.3578 20.7222 25.5 19.9999 25.5C19.2777 25.5 18.5625 25.3578 17.8952 25.0814C17.2279 24.805 16.6216 24.3999 16.1109 23.8891C15.6001 23.3784 15.195 22.7721 14.9186 22.1048C14.6422 21.4375 14.4999 20.7223 14.4999 20L14.4999 20Z"
          stroke={theme.colors.green3}
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
  progressOptions: ProgressOptionsType
}

type ToastDescriptionProps = {
  type: 'progress' | 'error' | 'success'
  children: string
}

export const ToastDescription = (props: ToastDescriptionProps) => {
  const { children, type } = props

  if (type === 'success') {
    return <DescriptionSuccess>{children}</DescriptionSuccess>
  }
  if (type === 'error') {
    return <DescriptionError>{children}</DescriptionError>
  }

  return <Description>{children}</Description>
}

const Error2SegmentsIcon = () => {
  const theme = useTheme()

  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="40" height="40" rx="20" fill={theme.colors.white5} />
      <path
        d="M20 34C23.713 34 27.274 32.525 29.8995 29.8995C32.525 27.274 34 23.713 34 20C34 16.287 32.525 12.726 29.8995 10.1005C27.274 7.475 23.713 6 20 6"
        stroke="#FF8068"
        strokeWidth="2"
      />
      <path
        d="M20 6C18.1615 6 16.341 6.36212 14.6424 7.06568C12.9439 7.76925 11.4005 8.80048 10.1005 10.1005C8.80048 11.4005 7.76925 12.9439 7.06569 14.6424C6.36212 16.341 6 18.1615 6 20C6 21.8385 6.36212 23.659 7.06568 25.3576C7.76925 27.0561 8.80048 28.5995 10.1005 29.8995C11.4005 31.1995 12.9439 32.2307 14.6424 32.9343C16.341 33.6379 18.1615 34 20 34"
        stroke="#FF8068"
        strokeWidth="2"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.6655 14.4393C16.0797 13.8536 15.1299 13.8536 14.5441 14.4393C13.9584 15.0251 13.9584 15.9749 14.5441 16.5607L17.9327 19.9493L14.4393 23.4427C13.8536 24.0285 13.8536 24.9782 14.4393 25.564C15.0251 26.1498 15.9749 26.1498 16.5607 25.564L20.0541 22.0706L23.4428 25.4593C24.0285 26.0451 24.9783 26.0451 25.5641 25.4593C26.1499 24.8735 26.1499 23.9237 25.5641 23.3379L22.1754 19.9493L25.4593 16.6654C26.0451 16.0796 26.0451 15.1298 25.4593 14.5441C24.8735 13.9583 23.9237 13.9583 23.3379 14.5441L20.0541 17.8279L16.6655 14.4393Z"
        fill="#FF8068"
      />
      <rect
        x="21"
        y="4"
        width="4"
        height="2"
        transform="rotate(90 21 4)"
        fill={theme.colors.white5}
      />
      <rect
        x="21"
        y="32"
        width="4"
        height="2"
        transform="rotate(90 21 32)"
        fill={theme.colors.white5}
      />
    </svg>
  )
}

const Error3SegmentsIcon = () => {
  const theme = useTheme()

  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="40" height="40" rx="20" fill={theme.colors.white5} />
      <path
        d="M32.1244 27C33.3531 24.8717 34 22.4575 34 20C34 17.5425 33.3531 15.1283 32.1244 13C30.8956 10.8717 29.1283 9.1044 27 7.87564C24.8717 6.64689 22.4575 6 20 6"
        stroke="#FF8068"
        strokeWidth="2"
      />
      <path
        d="M7.87564 27C9.1044 29.1283 10.8717 30.8956 13 32.1244C15.1283 33.3531 17.5425 34 20 34C22.4575 34 24.8717 33.3531 27 32.1244C29.1283 30.8956 30.8956 29.1283 32.1244 27"
        stroke="#FF8068"
        strokeWidth="2"
      />
      <path
        d="M20 6C17.5425 6 15.1283 6.64689 13 7.87564C10.8717 9.1044 9.1044 10.8717 7.87564 13C6.64689 15.1283 6 17.5425 6 20C6 22.4575 6.64689 24.8717 7.87564 27"
        stroke="#FF8068"
        strokeWidth="2"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.2999 14.0738C15.7141 13.488 14.7644 13.488 14.1786 14.0738C13.5928 14.6596 13.5928 15.6093 14.1786 16.1951L17.5672 19.5837L14.0738 23.0771C13.488 23.6629 13.488 24.6127 14.0738 25.1985C14.6596 25.7842 15.6093 25.7842 16.1951 25.1985L19.6885 21.705L23.0772 25.0937C23.663 25.6795 24.6127 25.6795 25.1985 25.0937C25.7843 24.5079 25.7843 23.5582 25.1985 22.9724L21.8098 19.5837L25.0937 16.2998C25.6795 15.7141 25.6795 14.7643 25.0937 14.1785C24.5079 13.5927 23.5582 13.5927 22.9724 14.1785L19.6885 17.4624L16.2999 14.0738Z"
        fill="#FF8068"
      />
      <rect
        x="5.88916"
        y="26.2553"
        width="4"
        height="2"
        transform="rotate(-30 5.88916 26.2553)"
        fill={theme.colors.white5}
      />
      <rect
        width="4"
        height="2"
        transform="matrix(-0.866025 -0.5 -0.5 0.866025 34.4641 27)"
        fill={theme.colors.white5}
      />
      <rect
        x="21"
        y="4"
        width="4"
        height="2"
        transform="rotate(90 21 4)"
        fill={theme.colors.white5}
      />
    </svg>
  )
}

const Success2SegmentsIcon = () => {
  const theme = useTheme()

  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="40" height="40" rx="20" fill={theme.colors.white5} />
      <path
        d="M20 34C23.713 34 27.274 32.525 29.8995 29.8995C32.525 27.274 34 23.713 34 20C34 16.287 32.525 12.726 29.8995 10.1005C27.274 7.475 23.713 6 20 6"
        stroke={theme.colors.green3}
        strokeWidth="2"
      />
      <path
        d="M20 6C18.1615 6 16.341 6.36212 14.6424 7.06568C12.9439 7.76925 11.4005 8.80048 10.1005 10.1005C8.80048 11.4005 7.76925 12.9439 7.06569 14.6424C6.36212 16.341 6 18.1615 6 20C6 21.8385 6.36212 23.659 7.06568 25.3576C7.76925 27.0561 8.80048 28.5995 10.1005 29.8995C11.4005 31.1995 12.9439 32.2307 14.6424 32.9343C16.341 33.6379 18.1615 34 20 34"
        stroke={theme.colors.green3}
        strokeWidth="2"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M25.148 15.6988C25.6217 16.0698 25.7125 16.7511 25.3525 17.2333L19.8832 24.5586C19.6909 24.8161 19.3995 24.9761 19.0838 24.9975C18.768 25.019 18.4585 24.8999 18.2347 24.6707L14.7578 21.1096C14.3364 20.678 14.3364 19.9889 14.7578 19.5573C15.1937 19.1109 15.9116 19.1109 16.3475 19.5573L18.9007 22.1723L23.5777 15.9081C23.9496 15.41 24.6586 15.3155 25.148 15.6988Z"
        fill={theme.colors.green3}
      />
      <rect
        x="21"
        y="4"
        width="4"
        height="2"
        transform="rotate(90 21 4)"
        fill={theme.colors.white5}
      />
      <rect
        x="21"
        y="32"
        width="4"
        height="2"
        transform="rotate(90 21 32)"
        fill={theme.colors.white5}
      />
    </svg>
  )
}

const Success3SegmentsIcon = () => {
  const theme = useTheme()

  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="40" height="40" rx="20" fill={theme.colors.white5} />
      <path
        d="M32.1244 27C33.3531 24.8717 34 22.4575 34 20C34 17.5425 33.3531 15.1283 32.1244 13C30.8956 10.8717 29.1283 9.1044 27 7.87564C24.8717 6.64689 22.4575 6 20 6"
        stroke="#00FF84"
        strokeWidth="2"
      />
      <path
        d="M7.87564 27C9.1044 29.1283 10.8717 30.8956 13 32.1244C15.1283 33.3531 17.5425 34 20 34C22.4575 34 24.8717 33.3531 27 32.1244C29.1283 30.8956 30.8956 29.1283 32.1244 27"
        stroke="#00FF84"
        strokeWidth="2"
      />
      <path
        d="M20 6C17.5425 6 15.1283 6.64689 13 7.87564C10.8717 9.1044 9.1044 10.8717 7.87564 13C6.64689 15.1283 6 17.5425 6 20C6 22.4575 6.64689 24.8717 7.87564 27"
        stroke="#00FF84"
        strokeWidth="2"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M25.148 15.6988C25.6217 16.0698 25.7125 16.7511 25.3525 17.2333L19.8832 24.5586C19.6909 24.8161 19.3995 24.9761 19.0838 24.9975C18.768 25.019 18.4585 24.8999 18.2347 24.6707L14.7578 21.1096C14.3364 20.678 14.3364 19.9889 14.7578 19.5573C15.1937 19.1109 15.9116 19.1109 16.3475 19.5573L18.9007 22.1723L23.5777 15.9081C23.9496 15.41 24.6586 15.3155 25.148 15.6988Z"
        fill="#00FF84"
      />
      <rect
        x="5.88916"
        y="26.2553"
        width="4"
        height="2"
        transform="rotate(-30 5.88916 26.2553)"
        fill={theme.colors.white5}
      />
      <rect
        width="4"
        height="2"
        transform="matrix(-0.866025 -0.5 -0.5 0.866025 34.4641 27)"
        fill={theme.colors.white5}
      />
      <rect
        x="21"
        y="4"
        width="4"
        height="2"
        transform="rotate(90 21 4)"
        fill={theme.colors.white5}
      />
    </svg>
  )
}

export const Toast = (props: ToastProps) => {
  const { title, description, type, progressOptions } = props

  const theme = useTheme()

  console.log('debug theme', theme)

  return (
    <Container>
      <Left>
        {type === 'progress' && (
          <Progress type={type} options={progressOptions} />
        )}
        {type === 'success' && (
          <>
            {progressOptions.segments === 2 && <Success2SegmentsIcon />}

            {progressOptions.segments === 3 && <Success3SegmentsIcon />}
          </>
        )}
        {type === 'error' && (
          <>
            {progressOptions.segments === 2 && <Error2SegmentsIcon />}

            {progressOptions.segments === 3 && <Error3SegmentsIcon />}
          </>
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
