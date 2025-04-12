import React from 'react'
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

const BlogActions = ({blogId, onDelete}) => {

    const navigate = useNavigate()

    const handleEdit = () => {
        navigate(`/create-blog/${blogId}`)
    }

    const handleDelete = async () => {
        if(window.confirm('Are you sure you want to delete this blog?')){
            try{
                const token = localStorage.getItem('token') 

                await axios.delete(`http://localhost:8080/api/blog/${blogId}`, {
                    headers: {
                      Authorization: `Bearer ${token}`, 
                    }
                  })

                onDelete(blogId)
            }catch(error){
                console.log('Blog deletion failure: ', error)
            }
        }   
    }


  return (
    <div className='flex gap-4'>
        <button
            onClick={handleEdit}
            className='text-blue-600 hover:text-blue-800 transtition cursor-pointer'
        >
            <FaEdit/> 
        </button>
        <button
            onClick={handleDelete}
            className='text-red-500 hover:text-red-700 transition cursor-pointer'
        >
            <FaTrash/>
        </button>
    </div>
  )
}

export default BlogActions
