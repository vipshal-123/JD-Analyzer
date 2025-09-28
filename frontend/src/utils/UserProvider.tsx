import { fetchUserData } from '@/redux/slice/authSlice'
import type { AppDispatch } from '@/redux/store'
import { useEffect, type ReactNode } from 'react'
import { useDispatch } from 'react-redux'

interface UserProviderProps {
    children: ReactNode
}

const UserProvider = ({ children }: UserProviderProps) => {
    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        dispatch(fetchUserData())
    }, [dispatch])

    return <>{children}</>
}

export default UserProvider