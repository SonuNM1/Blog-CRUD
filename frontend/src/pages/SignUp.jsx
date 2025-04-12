import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  profileImage: yup
    .mixed()
    .test("required", "Profile image is required", (value) => value && value.length > 0),
});

const SignUp = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("profileImage", data.profileImage[0]);

    try {
      const res = await axios.post(
        "http://localhost:8080/api/auth/signup",
        formData
      );

      setMessage(`${res.data.message}`);
      setImagePreview(null);
      reset();

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setMessage(`${error.response?.data?.message || "Signup failed"}`);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setValue("profileImage", e.target.files);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setValue("profileImage", null);
    setImagePreview(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-3xl">
        <h2 className="text-3xl font-bold text-center mb-6">Sign Up</h2>
        {message && (
          <p className="text-center text-sm text-green-600 mb-4">{message}</p>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          encType="multipart/form-data"
        >


          <div className="flex flex-col items-center gap-4 relative">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-full"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                  title="Remove Image"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}

            <label
              htmlFor="profileImage"
              className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
            >
              Choose File
            </label>
            <input
              type="file"
              id="profileImage"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            {errors.profileImage && (
              <p className="text-red-500 text-sm text-center">
                {errors.profileImage.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                {...register("email")}
                className="p-3 border rounded w-full"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                {...register("password")}
                className="p-3 border rounded w-full"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white py-3 rounded hover:bg-blue-700 mt-2 cursor-pointer"
            >
              Sign Up
            </button>

         
            <p className="text-center text-sm mt-2">
              Already registered?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Login here
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
