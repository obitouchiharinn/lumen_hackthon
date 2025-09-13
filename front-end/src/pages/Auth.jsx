import React from 'react'
import { useAuthStore } from '@/Store/useAuthStore'
import Login from '@/components/Login'
import SignUp from '@/components/SignUp'


function Auth() {

  const {isLogin} = useAuthStore()
  return (
    <div >
      {isLogin ? <Login/> : <SignUp/>}
    </div>
  )
}

export default Auth
