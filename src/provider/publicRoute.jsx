import React from 'react'
import { useAuthStore } from '../../store/store'
import { Navigate } from 'react-router-dom'



function PublicRoute({ children }) {

    const { isLoggedIn } = useAuthStore()

    return isLoggedIn ? <Navigate to={"/"} replace /> : <>{children}</>


}

export default PublicRoute
