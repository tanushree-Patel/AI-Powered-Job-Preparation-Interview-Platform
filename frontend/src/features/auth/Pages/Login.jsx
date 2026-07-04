import React, { useState } from 'react'
import '../auth.form.scss'
import { useNavigate,Link, useNavigation } from 'react-router'
import { useAuth } from '../hooks/useAuth'



const Login = () => {
  const {loading,handleLogin}=useAuth()
  const navigate=useNavigate()

  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")
  const handleSubmit=async (e)=>{
    e.preventDefault();
    await handleLogin({email,password})
    navigate('/')

  }

  if(loading){
    return (
      <main>
        <h1>Loading.....</h1>
      </main>
    )
  }
  return (
    <main>
        <div className="auth-box">
            <div className="auth-left">
                <h2>Welcome back!</h2>
            </div>
            <div className="auth-right">
                <div className="form-container">
                    <h1>Login</h1>
                    <form onSubmit={handleSubmit}>
                      <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input 
                        onChange={(e)=>{
                          setemail(e.target.value)
                        }}
                        type="email" name='email' id='email' placeholder='Enter email address' />
                        </div>  
                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input 
                            onChange={(e)=>{
                              setpassword(e.target.value)
                            }}
                            type="password" id='password' placeholder='Enter password' name='password' />
                        </div>
                        <button className='button primary-button'>Login</button>
                    </form>
                    <p>Don't have an account? <Link to={'/register'}>Register</Link></p>
                </div>
            </div>
        </div>
    </main>
  )
}

export default Login
