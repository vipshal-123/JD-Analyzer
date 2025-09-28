import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import isEmpty from 'is-empty'
import type { RootState } from '@/redux/store'

const ProtectedRoute = () => {
    const userAuth = useSelector((state: RootState) => state?.auth)

    if (userAuth?.loading) {
        return <div>Loading...</div>
    }

    if (isEmpty(userAuth) || !userAuth?.isAuth) {
        return <Navigate to='/login' />
    }

    return <Outlet />
}

export default ProtectedRoute
