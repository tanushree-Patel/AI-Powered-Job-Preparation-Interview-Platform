import axios from 'axios'

const api=axios.create({
    baseURL:'http://localhost:3000',
    withCredentials:true
})

export async function register({username,email,password}){
  try{
      const response=await api.post('/api/auth/register',{
        username,email,password
    })
    return response.data
  } catch(err){
    console.log(err)
    
  }
}

export async function login({email,password}){
    try{
        const response=await api.post('/api/auth/login',{
            email,password
        })
        return response.data
    }catch(err){
        console.log(err);
        
    }
}

export async function logout(){
    try{
        const response=await api.get('/api/auth/logout')
        return response.data
    }catch{
        console.log(err);
        
    }
}

export async function getMe(){
    try{
       const response=await api.get('/api/auth/get-me') 
       return response.data
    }catch(err){
        console.log(err);
        
    }
}

export async function verifyEmail({email,otp}){
    try{
        const response=await api.post('/api/auth/verify-email',{
            email,otp
        })
        return response.data
    } catch(err){
        console.log(err);
        
    }
}

export async function resendOtp({email}){
    try{
        const response=await api.post('/api/auth/resend-otp',{email})
        return response.data
    }catch(err){
        console.log(err);
        
    }
}