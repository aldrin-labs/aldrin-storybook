import React from 'react'
import { Link } from 'react-router-dom'

export const SignInLink = (props: any) => {
  const isPathnameExists = !!props.pathname
  const toUrl = isPathnameExists
    ? `/login?callbackURL=${props.pathname}`
    : `/login`
  return <Link to={toUrl} {...props} />
}
