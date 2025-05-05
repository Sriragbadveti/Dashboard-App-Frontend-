

import { useState, useEffect } from "react"
import axios from "axios"
import DummyCard from "../components/DummyCard"
import { Link, useNavigate } from "react-router-dom";
export default function Dashboard() {
  const [profileData, setProfileData] = useState({})
  const [fetchSavedPosts, setFetchSavedPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [profileFormData, setProfileFormData] = useState({
    newUsername: "",
    newPassword: "",
  })
const navigate = useNavigate();
  // Fetch profile data
  const getUserData = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get("https://dashboard-app-backend-weyw.onrender.com/api/user/profile", {
        withCredentials: true,
      })
      setProfileData(response.data.sendUser)
      setError(null)
    } catch (error) {
      console.error("Error fetching profile data", error)
      setError("Failed to load profile data")
    } finally {
      setIsLoading(false)
    }
  }

  
  // Fetch saved posts
  const getSavedPosts = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get("https://dashboard-app-backend-weyw.onrender.com/api/save/showSavedPosts", {
        withCredentials: true,
      })
      setFetchSavedPosts(response.data.savedPosts)
      setError(null)
    } catch (error) {
      console.error("Error fetching saved posts", error)
      setError("Failed to load saved posts")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle delete saved post
  const deleteSavedPost = async (feedUrl) => {
    try {
      const response = await axios.delete(`https://dashboard-app-backend-weyw.onrender.com/api/save/unsavepost?feedUrl=${feedUrl}`, {
        withCredentials: true,
      })
      setFetchSavedPosts((prev) => prev.filter((post) => post.postId !== feedUrl))
      console.log("Post removed successfully", response.data.message)
    } catch (error) {
      console.log("Error deleting saved post", error.response?.data || error.message)
    }
  }

  // Add this function to handle form input changes
  const handleProfileInputChange = (e) => {
    const { name, value } = e.target
    setProfileFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Add this function to handle form submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    console.log("Profile update data:", profileFormData)

    const payload = {}
    if (profileFormData.newUsername.trim() !== "") {
      payload.username = profileFormData.newUsername
    }
    if (profileFormData.newPassword.trim() !== "") {
      payload.password = profileFormData.newPassword
    }

    try {
      const response = await axios.put("https://dashboard-app-backend-weyw.onrender.com/api/user/updateprofile", payload, {
        withCredentials: true,
      })
      console.log("Profile updated successfully", response.data)
      setShowProfileModal(false)
      getUserData()
    } catch (error) {
      console.error("Error updating profile", error)
    }
  }

  useEffect(() => {
    getUserData()
    getSavedPosts()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white p-4 md:p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-400 mt-1">Manage your profile and saved content</p>
        </div>

        {/* Profile Card */}
        <div className="backdrop-blur-sm bg-gray-900/80 border border-gray-800/50 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-purple-500/10 hover:border-gray-700/50 mb-8">
          {/* Accent top border */}
          <div className="h-1 w-full bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600"></div>

          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-12 h-12 border-4 border-gray-700 border-t-purple-500 rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto text-red-500 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <p>{error}</p>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row md:items-center gap-8">
                <div className="flex items-center gap-6 flex-1">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-700 bg-gray-800 shadow-lg">
                      <img
                        src={profileData.profilePic || "/placeholder.svg?height=96&width=96&query=user profile"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-900"></div>
                  </div>
                  <div className="flex flex-col">
                    <h2 className="text-2xl font-bold mb-1 text-white">{profileData.username || "User"}</h2>
                    <p className="text-gray-400 mb-2 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      {profileData.email || "email@example.com"}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="bg-purple-900/50 text-purple-300 px-3 py-1 rounded-full text-xs font-medium border border-purple-800/50">
                        Creator
                      </span>
                      <span className="bg-gray-800/50 text-gray-300 px-3 py-1 rounded-full text-xs font-medium border border-gray-700/50">
                        Member since {new Date(profileData.createdAt || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 min-w-[200px] backdrop-blur-sm">
                  <div className="text-center">
                    <h3 className="text-lg text-gray-400 mb-2 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Credits
                    </h3>
                    <p className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                      {profileData.credits || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Available for premium content</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="px-4 py-2 text-white bg-purple-700 rounded-md hover:bg-purple-600 transition-colors"
                >
                  Manage Your profile
                </button>
                <Link className="px-4 py-2 text-white bg-purple-700 rounded-md hover:bg-purple-600 transition-colors text-center" to="/feed">Go to your Feed</Link>
              </div>
            )}
          </div>
        </div>

        {/* Saved Posts Section */}
        <div className="backdrop-blur-sm bg-gray-900/80 border border-gray-800/50 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-purple-500/10 hover:border-gray-700/50">
          {/* Accent top border */}
          <div className="h-1 w-full bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600"></div>

          <div className="p-6">
            {/* Header */}
            <div className="flex border-b border-gray-800 mb-6">
              <div className="flex items-center px-5 py-3 text-white font-medium border-b-2 border-purple-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
                Saved Posts
              </div>
            </div>

            {/* Content */}
            <div className="py-2">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-12 h-12 border-4 border-gray-700 border-t-purple-500 rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-400">Loading your saved posts...</p>
                </div>
              ) : fetchSavedPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {fetchSavedPosts.map((post, index) => (
                    <DummyCard
                      key={index}
                      title={post.content?.title || "No title"}
                      platform={post.platform}
                      createdAt={post.createdAt}
                      feedUrl={post.postId}
                      onDelete={deleteSavedPost}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 px-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 mx-auto text-gray-600 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                  <h3 className="text-xl font-medium text-gray-300 mb-2">No saved posts yet</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Start saving interesting posts from your feed to access them later. Your saved posts will appear
                    here.
                  </p>
                  <button
                    onClick={() => (window.location.href = "/feed")}
                    className="mt-6 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
                  >
                    Browse Feed
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Modal */}
        {showProfileModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-md animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Update Profile</h3>
                <button onClick={() => setShowProfileModal(false)} className="text-zinc-400 hover:text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div>
                  <label htmlFor="newUsername" className="block text-sm font-medium text-zinc-300 mb-1">
                    New Username
                  </label>
                  <input
                    type="text"
                    id="newUsername"
                    name="newUsername"
                    value={profileFormData.newUsername}
                    onChange={handleProfileInputChange}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter new username"
                  />
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-zinc-300 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={profileFormData.newPassword}
                    onChange={handleProfileInputChange}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter new password"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowProfileModal(false)}
                    className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
