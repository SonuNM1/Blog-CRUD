import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useNavigate, useParams } from 'react-router-dom'

const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  image: yup.mixed().test('required', 'Image is required', value => value && value.length > 0)
})

const CreateBlog = () => {
  const [imagePreview, setImagePreview] = useState(null)
  const [message, setMessage] = useState("")
  const navigate = useNavigate()

  const [isEditing, setIsEditing] = useState(false)
  const {id} = useParams()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(schema),
    context: {isEditing}
  })

  useEffect(() => {
    if(id){
      setIsEditing(true)

      // fetching blog data from id for updating the blog fields

      axios.get(`http://localhost:8080/api/blog/blogs/${id}`)
      .then((res) => {
        const {title, description, image} = res.data.blog 

        setValue('title', title)
        setValue('description', description)
        setImagePreview(`http://localhost:8080/uploads/${image}`)
      })
      .catch((error) => {
        console.log('Error fetching blog data: ', error)
      })

    }
  }, [id, setValue])

  const onSubmit = async (data) => {
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('description', data.description)
    
    if(data.image && data.image[0]){
      formData.append('image', data.image[0])
    }

    try {
      const token = localStorage.getItem('token')

      if(isEditing){
        await axios.put(`http://localhost:8080/api/blog/blogs/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        })
        setMessage('Blog updated successfully')
      }
      else{
        const response = await axios.post('http://localhost:8080/api/blog/create', formData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        setMessage(response.data.message) 

        const blogId = response.data.blog._id 

        navigate(`/blogs/${blogId}`)
      }

      reset()
      setImagePreview(null)

    } catch (error) {
      console.log('Error creating/updating blog:', error)

      setMessage(error.response?.data?.message || 'Operation failed')
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setValue('image', e.target.files)
    if (file) {
      setImagePreview(URL.createObjectURL(file))
    }
  }

  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center px-4'>
      <div className='w-full max-w-5xl bg-white shadow-lg rounded-lg p-10'>
        <h2 className='text-3xl font-bold text-center mb-8'>
          {
            isEditing ? 'Edit Blog' : 'Create New Blog'
          }
        </h2>

        {message && (
          <p className='text-center mb-6 text-green-600 font-medium'>{message}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-1 lg:grid-cols-2 gap-10'>

          <div className='flex flex-col items-center gap-4'>
            {imagePreview ? (
              <img
                src={imagePreview}
                alt='preview'
                className='w-64 h-64 object-cover rounded-md shadow'
              />
            ) : (
              <div className='w-64 h-64 bg-gray-200 flex items-center justify-center rounded-md text-gray-500 text-sm'>
                No Image Selected
              </div>
            )}

            <label htmlFor='image' className='bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 cursor-pointer text-sm'>
              Choose Image
            </label>
            <input
              type='file'
              id='image'
              accept='image/*'
              onChange={handleImageChange}
              className='hidden'
            />
            {errors.image && (
              <p className='text-red-500 text-sm'>{errors.image.message}</p>
            )}
          </div>

          {/* Right - Title & Description */}
          <div className='flex flex-col gap-6'>

            <div>
              <input
                type='text'
                placeholder='Blog Title'
                {...register('title')}
                className='w-full border border-gray-300 p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
              {errors.title && (
                <p className='text-red-500 text-sm mt-1'>{errors.title.message}</p>
              )}
            </div>

            <div>
              <textarea
                placeholder='Blog Description'
                {...register('description')}
                rows='8'
                className='w-full border border-gray-300 p-4 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500'
              ></textarea>
              {errors.description && (
                <p className='text-red-500 text-sm mt-1'>{errors.description.message}</p>
              )}
            </div>

            <button
              type='submit'
              className='bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition duration-200 cursor-pointer'
            >
              {
                isEditing ? 'Update Blog' : 'Create Blog'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateBlog
