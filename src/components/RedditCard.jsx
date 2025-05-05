"use client"

import { useState } from "react"
import axios from "axios"
import Toast from "../components/toast";

export default function RedditCard({ post }) {
  const [reportReason, setReportReason] = useState("")
  const [showReportPopup, setShowReportPopup] = useState(false)
  const [toast, setToast] = useState({ show: false, message: "", type: "success" })

  const feedId = post.url

  const handleReportClick = () => {
    setShowReportPopup(true)
  }

  const handleClosePopup = () => {
    setShowReportPopup(false)
    setReportReason("")
  }

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type })
  }

  const handleSubmitReport = async (e) => {
    e.preventDefault()
    setShowReportPopup(false)

    try {
      const response = await axios.post(
        "http://localhost:3000/api/feed/report",
        { feedId, reason: reportReason },
        { withCredentials: true },
      )
      console.log("Report sent successfully", response.data.message)
      setReportReason("")
      showToast("Report submitted successfully")
    } catch (error) {
      console.log("Error sending the report", error.response?.data || error.message)
      showToast("Failed to submit report", "error")
    }
  }

  const handleSavedPosts = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/save/savedpost",
        {
          feedUrl: feedId,
          title: post.title,
          platform: "reddit",
          createdAt: post.created_utc || new Date().toISOString(),
        },
        {
          withCredentials: true, // This is the ONLY thing needed for cookies
        },
      )
      console.log("Post has been saved successfully", response.data.message)
      showToast("Post saved successfully")
    } catch (error) {
      console.error("Error saving the post", error.response?.data || error.message)
      showToast("Failed to save post", "error")
    }
  }

  return (
    <>
      <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-lg overflow-hidden mb-6 hover:shadow-xl transition-shadow duration-300">
        <div className="p-5">
          <h2 className="text-xl font-semibold text-white mb-3">{post.title}</h2>
          <p className="text-gray-300">{post.selftext ? post.selftext.slice(0, 100) + "..." : "No description."}</p>
        </div>
        <div className="px-5 py-4 bg-gray-800 flex flex-wrap justify-between items-center gap-2">
          <div className="text-sm text-gray-400">
          <span>Posted by: {post.author}</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="text-gray-400 hover:text-white" onClick={handleReportClick}>
              Report
            </button>
            <button className="text-gray-400 hover:text-white" onClick={handleSavedPosts}>
              Save
            </button>
          </div>
        </div>
      </div>

      {showReportPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Report Post</h3>
            <form onSubmit={handleSubmitReport}>
              <div className="mb-4">
                <label htmlFor="reportReason" className="block text-sm font-medium text-gray-300 mb-2">
                  Reason for reporting
                </label>
                <textarea
                  id="reportReason"
                  rows="4"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                  placeholder="Please explain why you're reporting this post..."
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-transparent border border-gray-700 text-gray-300 rounded-md"
                  onClick={handleClosePopup}
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-md">
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />
      )}
    </>
  )
}
