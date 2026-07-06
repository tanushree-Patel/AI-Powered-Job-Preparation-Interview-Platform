import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './style.scss'
import { AuthProvider } from './features/auth/auth.context'
import { InterviewProvider } from './features/interview/interview.context'

createRoot(document.getElementById('root')).render(

    <InterviewProvider>
    <AuthProvider>
    <App/>
    </AuthProvider>
    </InterviewProvider>
)
