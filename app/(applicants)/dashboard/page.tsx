import { logout } from '@/features/auth/server/auth.actions'
import React from 'react'

const page = () => {
  return (
    <>
      <h1>Applicant Dashboard</h1>
     <button onClick={logout}>Logout</button>
    </>
  )
}

export default page