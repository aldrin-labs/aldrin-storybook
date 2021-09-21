import React from 'react'

export const checkForUsername = (value: string) => {
  const isUserName = value.includes('@')
  return isUserName
}

export const checkForUrl = (value: string) => {
  let url

  try {
    url = new URL(value)
  } catch (_) {
    return false
  }

  return url.protocol === 'http:' || url.protocol === 'https:'
}

export const checkForLinkOrUsername = (value: string) => {
  const isUsername = checkForUsername(value)
  const isUrl = checkForUrl(value)

  return isUsername || isUrl
}
