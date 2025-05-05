

import { useState, useEffect } from "react";
import axios from "axios";
import RedditCard from "../components/RedditCard";
import ProfileDropdown from "../components/ProfileDropdown";

export default function FeedPage() {
  const [redditPosts, setRedditPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [afterToken, setAfterToken] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchRedditFeed = async (loadMore = false) => {
    if (loadMore) setIsLoadingMore(true);
    else setIsLoading(true);

    try {
      const url = afterToken
        ? `https://www.reddit.com/r/popular.json?limit=100&after=${afterToken}`
        : `https://www.reddit.com/r/popular.json?limit=100`;

      const response = await axios.get(url);
      const posts = response.data.data.children.map((post) => post.data);

      setRedditPosts((prev) => [...prev, ...posts]);
      setAfterToken(response.data.data.after);
    } catch (error) {
      console.error("Error fetching Reddit feed:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchRedditFeed();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-gray-900/80 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-purple-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
              <h1 className="text-xl font-bold text-white">
                Trending Reddit Posts
              </h1>
            </div>
            <ProfileDropdown />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="relative z-10 space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-gray-700 border-t-purple-500 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-400">Loading posts...</p>
            </div>
          ) : redditPosts.length > 0 ? (
            <>
              {redditPosts.map((post, index) => (
                <RedditCard key={`${post.id}-${index}`} post={post} />
              ))}
              {afterToken && (
                <div className="text-center mt-6">
                  <button
                    onClick={() => fetchRedditFeed(true)}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                    disabled={isLoadingMore}
                  >
                    {isLoadingMore ? "Loading more..." : "Load More Posts"}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 px-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto text-gray-500 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-gray-400">
                No posts found. Try refreshing the page.
              </p>
              <button
                onClick={() => fetchRedditFeed()}
                className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors"
              >
                Refresh
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
