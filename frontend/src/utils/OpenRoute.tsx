import type { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const OpenRoute = () => {
    const userAuth = useSelector((state: RootState) => state.auth)

    if (userAuth?.isAuth) {
        return <Navigate to='/upload' replace />
    }

    return <Outlet />
}

export default OpenRoute
