import { COLORS } from '@variables/variables'

export interface ReloadTimerProps {
  size?: number
  duration?: number
  initialRemainingTime?: number
  color?: keyof typeof COLORS
  trailColor?: keyof typeof COLORS
  callback: () => void
  margin?: string
  rerenderOnClick?: boolean
}

export interface TimerButtonProps {
  margin?: string
}
