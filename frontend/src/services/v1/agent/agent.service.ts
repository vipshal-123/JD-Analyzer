import axios, { handleResponse } from './axios'


export const analyseResume = async (data: FormData) => {
    try {
        const response = await axios({
            url: '/v1/agent/analyse-resume',
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            data,
        })

        return handleResponse(response, 'success')
    } catch (error) {
        return handleResponse(error, 'error')
    }
}

export const pastAnalysis = async (params: { currentPage: number; itemsPerPage: number }) => {
    try {
        const response = await axios({
            url: '/v1/agent/past-reports',
            method: 'GET',
            params
        })

        return handleResponse(response, 'success')
    } catch (error) {
        return handleResponse(error, 'error')
    }
}

export const deleteAnalysis = async (id: string | null) => {
    try {
        const response = await axios({
            url: `/v1/agent/report/${id}`,
            method: 'DELETE',
        })

        return handleResponse(response, 'success')
    } catch (error) {
        return handleResponse(error, 'error')
    }
}
