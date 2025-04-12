import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios'; 

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/blog/blogs');
        setBlogs(response.data.blogs);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchBlogs();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleCreateBlog = () => {
    navigate('/create-blog');
  };

  return (
    <div className='min-h-screen bg-gray-100'>
      <header className='bg-white shadow-md p-4 flex justify-between items-center'>
        <h1 className='text-xl font-bold'>Dashboard</h1>

        {user && (
          <div className='flex items-center gap-4'>
            <img
              src={`http://localhost:8080/uploads/${user.profileImage}`}
              alt='User_image'
              className='w-10 h-10 rounded-full object-cover'
            />
            <button
              onClick={handleLogout}
              className='bg-red-500 text-white px-3 py-1 cursor-pointer rounded hover:bg-red-600'
            >
              Logout
            </button>
          </div>
        )}
      </header>

      <main className='p-8'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-2xl font-semibold'>Welcome to your dashboard</h2>
          <button
            onClick={handleCreateBlog}
            className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer'
          >
            + Write New Blog
          </button>
        </div>

        <section className='mt-6'>
          <h3 className='text-xl font-semibold mb-4'>Latest Blogs</h3>
          <div className='overflow-x-auto'>
            <table className='min-w-full bg-white rounded-lg shadow-md'>
              <thead>
                <tr className='bg-gray-100 text-left'>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <Link
                    to={`/blogs/${blog._id}`}
                    key={blog._id}
                    className='table-row hover:bg-gray-50 cursor-pointer'
                  >
                    <tr>
                      <td className='py-2 px-4'>
                        <img
                          src={`http://localhost:8080/uploads/${blog.image}`}
                          alt='blog'
                          className='w-16 h-16 object-cover rounded'
                        />
                      </td>
                      <td className='py-2 px-4 font-medium'>{blog.title}</td>
                      <td className='py-2 px-4 text-gray-600'>
                        {blog.description.slice(0, 100)}...
                      </td>
                    </tr>
                  </Link>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
