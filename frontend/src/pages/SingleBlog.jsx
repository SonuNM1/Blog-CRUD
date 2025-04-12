import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const SingleBlog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8080/api/blog/blogs/${id}`
        );
        setBlog(response.data.blog);
      } catch (err) {
        setError("Failed to fetch blog");
        console.error("Error fetching blog:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!blog) {
    return <div>No blog found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <div className="flex justify-between items-center gap-6 mb-6">
        <h1 className="text-4xl font-semibold text-gray-800">{blog.title}</h1>
        <Link
          to="/"
          className="inline-block bg-blue-400 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-md"
        >
          View All Blogs
        </Link>
      </div>

      {blog.image && (
        <img
          src={`http://localhost:8080/uploads/${blog.image}`}
          alt={blog.title}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
      )}
      <p className="text-gray-700 mb-4">{blog.description}</p>
    </div>
  );
};

export default SingleBlog;
