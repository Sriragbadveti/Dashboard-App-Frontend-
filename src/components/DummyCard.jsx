

import { useState } from "react"
import Toast from "../components/toast"

export default function DummyCard({ title, platform, createdAt, onDelete, feedUrl }) {
  const [showToast, setShowToast] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const formattedDate = new Date(createdAt).toLocaleDateString()

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await onDelete(feedUrl) // Pass the feedUrl back to parent component
      setShowToast(true)
    } catch (error) {
      console.error("Error deleting post:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-md p-5 flex justify-between items-start">
      <div>
        <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
        <p className="text-sm text-gray-400">Platform: {platform}</p>
        <p className="text-sm text-gray-500">Saved on: {formattedDate}</p>
      </div>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className={`${
          isDeleting ? "text-gray-500 cursor-not-allowed" : "text-red-500 hover:text-red-700"
        } transition-colors duration-200 text-sm font-medium flex items-center`}
      >
        {isDeleting ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Removing...
          </>
        ) : (
          "Remove"
        )}
      </button>

      {showToast && <Toast message="Post removed successfully" type="success" onClose={() => setShowToast(false)} />}
    </div>
  )
}
