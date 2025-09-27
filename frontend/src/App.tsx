import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import OTPVerification from './pages/OTPVerification'
import CreatePassword from './pages/CreatePassword'
import UploadPage from './pages/UploadPage'
import Dashboard from './pages/Dashboard'

function App() {
    return (
        <>
            <Routes>
                <Route path='/' element={<Register />} />
                <Route path='/login' element={<Login />} />
                <Route path='/verify-otp' element={<OTPVerification />} />
                <Route path='/create-password' element={<CreatePassword />} />
                <Route path='/upload' element={<UploadPage />} />
                <Route path='/dashboard' element={<Dashboard />} />
            </Routes>
        </>
    )
}

export default App
