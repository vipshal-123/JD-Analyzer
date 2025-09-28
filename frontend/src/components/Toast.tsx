import { useEffect } from 'react'
import { ToastContainer, toast, type ToastOptions, type TypeOptions } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@/redux/store'
import { closeToast } from '@/redux/slice/toastSlice'

const Toast = () => {
    const { message, type } = useSelector((state: RootState) => state.toast)
    const dispatch = useDispatch()

    useEffect(() => {
        if (message) {
            const options: ToastOptions = {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            }

            const toastMap: Record<TypeOptions, (msg: string, opts?: ToastOptions) => void> = {
                info: toast.info,
                success: toast.success,
                warning: toast.warning,
                error: toast.error,
                default: toast,
            }

            toastMap[type as TypeOptions](message, options)
            dispatch(closeToast())
        }
    }, [message, type, dispatch])

    return <ToastContainer />
}

export default Toast