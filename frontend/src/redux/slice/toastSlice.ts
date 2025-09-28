import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

const initialState = {
    type: '',
    message: '',
}

const toastSlice = createSlice({
    name: 'toast',
    initialState,
    reducers: {
        openToast: (state, action: PayloadAction<{ message: string; type: string }>) => {
            state.message = action.payload.message
            state.type = action.payload.type
            return state
        },
        closeToast: (state) => {
            state.message = ''
            return state
        },
    },
})

export const { closeToast, openToast } = toastSlice.actions
export default toastSlice.reducer