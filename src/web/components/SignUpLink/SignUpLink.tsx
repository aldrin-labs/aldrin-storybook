import React from 'react'
import { Link } from 'react-router-dom'

export const SignUpLink = (props: any) => {
  const isPathnameExists = !!props.pathname
  const toUrl = isPathnameExists
    ? `/signup?callbackURL=${props.pathname}`
    : `/signup`
  return <Link to={toUrl} {...props} />
}
