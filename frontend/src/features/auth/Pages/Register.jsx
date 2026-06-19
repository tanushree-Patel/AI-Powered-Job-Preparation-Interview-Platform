import React from 'react'
import '../auth.form.scss'
import { useNavigate,Link } from 'react-router'
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
  const navigate=useNavigate();
  const [username, setusername] = useState("")
  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")

  const {loading,handleRegister}=useAuth()

  const handleSubmit=async(e)=>{
    e.preventDefault();

    await handleRegister({username,email,password})
    navigate('/')
 
  }
  if(loading){
    return (
      <h1>Loading.....</h1>
    )
  }
  return (
    <main>
        <div className="form-container">
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="username">Username</label>
                <input 
                onChange={(e)=>{
                  setusername(e.target.value)
                }}
                type="text" name='username' id='username' placeholder='Enter username' />
                </div>  
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
                <button className='button primary-button'>Register</button>
            </form>
            <p>Already have an account? <Link to={'/login'}>Login</Link></p>
        </div>
    </main>
  )
}

export default Register
