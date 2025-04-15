import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "../../store/authStore";
import Button from "../ui/Button";

const SignupForm = () => {
  const router = useRouter();
  const { signup, isLoading, error } = useAuthStore();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  
  // Validate form on input change
  useEffect(() => {
    const errors = {};
    
    if (formData.name && (formData.name.length < 2 || formData.name.length > 30)) {
      errors.name = "Name must be between 2 and 30 characters";
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    if (formData.password) {
      if (formData.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
      } else if (!/(?=.*[0-9])(?=.*[a-zA-Z])/.test(formData.password)) {
        errors.password = "Password must contain both letters and numbers";
      }
    }
    
    if (formData.confirmPassword && formData.confirmPassword !== formData.password) {
      errors.confirmPassword = "Passwords do not match";
    }
    
    setFormErrors(errors);
    
    // Check if form is valid
    const isValid = 
      formData.name &&
      formData.email &&
      formData.password &&
      formData.confirmPassword &&
      Object.keys(errors).length === 0;
    
    setIsFormValid(isValid);
  }, [formData]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid) return;
    
    const success = await signup(formData.name, formData.email, formData.password);
    if (success) {
      router.push("/chat");
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Create Account</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-500 rounded-md">
            {error}
          </div>
        )}
        
        <div className="mb-4">
          <div className="relative">
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder=" "
              className={`block w-full px-4 py-2 text-gray-700 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formErrors.name ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            <label
              htmlFor="name"
              className={`absolute left-4 transition-all duration-200 ${
                formData.name
                  ? "-top-2.5 text-sm bg-white px-1 text-blue-500"
                  : "top-2 text-gray-500"
              }`}
            >
              Name
            </label>
          </div>
          {formErrors.name && (
            <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
          )}
        </div>
        
        <div className="mb-4">
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder=" "
              className={`block w-full px-4 py-2 text-gray-700 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formErrors.email ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            <label
              htmlFor="email"
              className={`absolute left-4 transition-all duration-200 ${
                formData.email
                  ? "-top-2.5 text-sm bg-white px-1 text-blue-500"
                  : "top-2 text-gray-500"
              }`}
            >
              Email
            </label>
          </div>
          {formErrors.email && (
            <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
          )}
        </div>
        
        <div className="mb-4">
          <div className="relative">
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder=" "
              className={`block w-full px-4 py-2 text-gray-700 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formErrors.password ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            <label
              htmlFor="password"
              className={`absolute left-4 transition-all duration-200 ${
                formData.password
                  ? "-top-2.5 text-sm bg-white px-1 text-blue-500"
                  : "top-2 text-gray-500"
              }`}
            >
              Password
            </label>
          </div>
          {formErrors.password && (
            <p className="mt-1 text-sm text-red-500">{formErrors.password}</p>
          )}
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder=" "
              className={`block w-full px-4 py-2 text-gray-700 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formErrors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            <label
              htmlFor="confirmPassword"
              className={`absolute left-4 transition-all duration-200 ${
                formData.confirmPassword
                  ? "-top-2.5 text-sm bg-white px-1 text-blue-500"
                  : "top-2 text-gray-500"
              }`}
            >
              Confirm Password
            </label>
          </div>
          {formErrors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">{formErrors.confirmPassword}</p>
          )}
        </div>
        
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          disabled={!isFormValid || isLoading}
          fullWidth
        >
          Create Account
        </Button>
      </form>
    </div>
  );
};

export default SignupForm;