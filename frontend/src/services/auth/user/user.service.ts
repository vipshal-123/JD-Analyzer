import axios, { handleResponse } from './axios'

export const signupSendOtp = async (data: { email: string; name: string }) => {
    try {
        const response = await axios({
            url: '/auth/user/signup-sendotp',
            method: 'POST',
            data,
        })

        return handleResponse(response, 'success')
    } catch (error) {
        return handleResponse(error, 'error')
    }
}

export const signupVerifyOtp = async (data: { otp: string; token: string | null }) => {
    try {
        const response = await axios({
            url: '/auth/user/signup-verifyotp',
            method: 'POST',
            data,
        })

        return handleResponse(response, 'success')
    } catch (error) {
        return handleResponse(error, 'error')
    }
}

export const resendOtp = async (data: { token: string | null }) => {
    try {
        const response = await axios({
            url: '/auth/user/resend-otp',
            method: 'POST',
            data,
        })

        return handleResponse(response, 'success')
    } catch (error) {
        return handleResponse(error, 'error')
    }
}

export const createPassword = async (data: { password: string }) => {
    try {
        const response = await axios({
            url: '/auth/user/create-password',
            method: 'POST',
            data,
        })

        return handleResponse(response, 'success')
    } catch (error) {
        return handleResponse(error, 'error')
    }
}

export const signin = async (data: { email: string; password: string }) => {
    try {
        const response = await axios({
            url: '/auth/user/signin',
            method: 'POST',
            data,
        })

        return handleResponse(response, 'success')
    } catch (error) {
        return handleResponse(error, 'error')
    }
}

export const userInfo = async () => {
    try {
        const response = await axios({
            url: '/auth/user/user-info',
            method: 'GET',
        })

        return handleResponse(response, 'success')
    } catch (error) {
        return handleResponse(error, 'error')
    }
}
