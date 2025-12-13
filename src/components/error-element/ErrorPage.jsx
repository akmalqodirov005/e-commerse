import React from 'react'
import { NavLink } from 'react-router-dom'

const ErrorPage = () => {
  return (
    <div>
      <h2>Error :(</h2>
      <NavLink to='/'>Home</NavLink>
    </div>
  )
}

export default ErrorPage