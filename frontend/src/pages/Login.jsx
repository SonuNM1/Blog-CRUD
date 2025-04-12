import React, {useState} from 'react'
import axios from 'axios'
import {useForm} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {useNavigate} from 'react-router-dom'

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required')
})

const Login = () => {

  const navigate = useNavigate() ; 
  const [errorMessage, setErrorMessage] = useState('') ; 

  const {
    register, 
    handleSubmit, 
    formState: {errors}, 
  } = useForm({resolver: yupResolver(schema)})

  const onSubmit = async (data) => {
    try{
      const response = await axios.post('http://localhost:8080/api/auth/login', data)

      // saving JWT token to localStorage 

      localStorage.setItem('token', response.data.token) ; 
      localStorage.setItem('user', JSON.stringify(response.data.user))

      // redirecting to home after successful login 

      navigate('/')

    }catch(error){
      console.log('Login error: ', error)
      setErrorMessage(error.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 px-4'>
      <div className='bg-white p-8 rounded-xl shadow-md w-full max-w-md'>
        <h2 className='text-3xl font-bold text-center mb-6'>
          Login
        </h2>
        {
          errorMessage && <p className='text-red-500 text-center mb-4'>
            {errorMessage}
          </p>
        }

        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
          <input
            type="email"
            placeholder='Email'
            {...register('email')}
            className="p-3 border rounded w-full"
          />
          {
            errors.email && (
              <p className='text-red-500 text-sm'>
                {errors.email.message}
              </p>
            )
          }
          <input
            type="password"
            placeholder='Password'
            {...register('password')}
            className="p-3 border rounded w-full"
          />
          {
            errors.password && (
              <p className='text-red-500 text-sm'>
                {errors.password.message}
              </p>
            )
          }

          <button type='submit' className='bg-blue-600 text-white py-3 rounded hover:bg-blue-700 cursor-pointer'>
            Login
          </button>

        </form>

        <p className="text-center mt-4 text-sm">
          Not registered?{" "}
          <span
            onClick={() => navigate('/register')}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Register here
          </span>
        </p>

      </div>
    </div>
  )
}

export default Login
