import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/login'); // redirect if not logged in
    }
  }, [navigate]);

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
        {/* More content can go here */}
      </main>
    </div>
  );
};

export default Home;
