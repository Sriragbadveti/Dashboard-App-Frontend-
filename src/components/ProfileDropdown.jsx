

import axios from "axios";
import { useState, useRef, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"

export default function ProfileDropdown() {
    const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleLogout = async () => {
    try {
      console.log("Logging out...");
      const response = await axios.post("https://dashboard-app-backend-weyw.onrender.com/api/auth/logout", {}, {
        withCredentials: true
      });
      console.log(response.data.message);
      navigate("/"); // ya homepage as per flow
    } catch (error) {
      console.log("Logout failed", error.response?.data || error.message);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 bg-gray-800/50 hover:bg-gray-800 text-white px-4 py-2 rounded-xl transition-all duration-200 border border-gray-700/50 hover:border-gray-700"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-medium">
          U
        </div>
        <span className="hidden sm:inline">User</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 backdrop-blur-md bg-gray-900/90 border border-gray-800 rounded-xl shadow-lg py-1 z-50 transform origin-top-right transition-all duration-200 animate-fade-in">
          <Link className="flex items-center px-4 py-3 text-sm text-gray-200 hover:bg-gray-800 transition-colors" to="/dashboard">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-3 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Profile
            </Link>
          
          <div className="border-t border-gray-800 my-1"></div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-200 hover:bg-gray-800 transition-colors"
            to="/"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-3 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>
      )}
    </div>
  )
}
