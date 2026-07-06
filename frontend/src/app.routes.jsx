import {createBrowserRouter} from 'react-router'
import Login from './features/auth/Pages/Login'
import Register from './features/auth/Pages/Register'
import Protected from './features/auth/components/Protected'
import Home from './features/interview/pages/Home'
import Interview from './features/interview/pages/Interview'
import Download from './features/interview/pages/Download'
import MainLayout from './features/MainLayout'


export const router=createBrowserRouter(
    [
   {     element: <MainLayout />,
     children:[   {
            path:'/login',
            element:<Login/>
        },
        {
            path:'/register',
            element:<Register/>
        },
        {
            path:'/',
            element:<Protected><Home/></Protected>
        },
        {
            path:"/interview/:interviewId",
            element:<Protected><Interview/></Protected>
        },
        {
            path:"/downloads",
            element:<Protected><Download/></Protected>
        }]
    }
    ]
)