import { userInfo } from '@/services/auth/user/user.service'
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import isEmpty from 'is-empty'

interface AuthState {
    isAuth: boolean
    loading: boolean
    userId: string
    email: string
}

interface UserResponse {
    id: string
    email: string
}

interface FetchUserDataResponse extends Partial<UserResponse> {
    isAuth: boolean
}

const initialState: AuthState = {
    isAuth: false,
    loading: true,
    userId: '',
    email: '',
}

export const fetchUserData = createAsyncThunk<FetchUserDataResponse>('auth/fetchUserData', async () => {
    try {
        const response = await userInfo()
        if (!isEmpty(response.data)) {
            return { isAuth: true, ...response.data }
        } else {
            return { isAuth: false, id: '', email: '' }
        }
    } catch (error) {
        console.error('error: ', error)
        return { isAuth: false, id: '', email: '' }
    }
})

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setupAuth: (state, action: PayloadAction<{ isAuth: boolean; userId: string; email: string }>) => {
            state.isAuth = action.payload.isAuth
            state.userId = action.payload.userId
            state.email = action.payload.email
        },
        revokeAuth: (state) => {
            state.isAuth = false
            state.userId = ''
            state.email = ''
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserData.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchUserData.fulfilled, (state, action) => {
                state.loading = false
                state.isAuth = !!action.payload?.isAuth
                state.userId = action.payload?.id ?? ''
                state.email = action.payload?.email ?? ''
            })
            .addCase(fetchUserData.rejected, (state) => {
                state.loading = false
                state.isAuth = false
                state.userId = ''
                state.email = ''
            })
    },
})

export const { setupAuth, revokeAuth } = authSlice.actions
export default authSlice.reducer