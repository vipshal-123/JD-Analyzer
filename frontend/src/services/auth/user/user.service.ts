import axios, { handleResponse } from "./axios"


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