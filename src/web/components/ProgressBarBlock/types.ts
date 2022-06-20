import React from 'react'

export interface ProgressBarStyle {
  background?: string
  padding?: string
}

export interface ProgressBarProps extends ProgressBarStyle {
  width?: string
}
export interface TimeProgressBarProps extends ProgressBarStyle {
  startTime: number
  duration: number
  finishedText?: React.ReactChild
}
