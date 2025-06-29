import React, { useState, useEffect } from 'react';
import Card from './card';
import Button from './Button';

/**
 * ApiData component for fetching and displaying data from JSONPlaceholder API
 */
const ApiData = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('asc');
  const postsPerPage = 6;

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filter posts based on search term
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort posts
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.title.localeCompare(b.title);
    }
    return b.title.localeCompare(a.title);
  });

  // Pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top of posts section
    document.getElementById('api-data')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle sort toggle
  const handleSortToggle = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    setCurrentPage(1);
  };

  // Loading state
  if (loading) {
    return (
      <Card title="📡 API Data from JSONPlaceholder" className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-4 text-gray-600 dark:text-gray-400">Loading posts...</span>
        </div>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card title="📡 API Data from JSONPlaceholder" className="max-w-6xl mx-auto">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">
            Error loading posts
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="primary">
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card title="📡 API Data from JSONPlaceholder" className="max-w-6xl mx-auto">
      <div className="space-y-6">
        {/* Search and Sort Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-grow max-w-md">
            <input
              type="text"
              placeholder="Search posts by title or content..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSortToggle}
            >
              Sort {sortOrder === 'asc' ? '↑ A-Z' : '↓ Z-A'}
            </Button>
          </div>
        </div>

        {/* Results Info */}
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {currentPosts.length} of {sortedPosts.length} posts
          {searchTerm && ` (filtered by "${searchTerm}")`}
        </div>

        {/* Posts Grid */}
        {currentPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {searchTerm ? 'No posts found matching your search.' : 'No posts available.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPosts.map((post, index) => (
              <div
                key={post.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow duration-200"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    Post #{post.id}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    User {post.userId}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3">
                  {post.body}
                </p>
                
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      // In a real app, this would navigate to the full post
                      alert(`Full post #${post.id} would open here`);
                    }}
                    className="w-full"
                  >
                    Read More
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 pt-6">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            <div className="flex space-x-1">
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                const isCurrentPage = pageNumber === currentPage;
                
                // Show first page, last page, current page, and pages around current
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                ) {
                  return (
                    <Button
                      key={pageNumber}
                      variant={isCurrentPage ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => handlePageChange(pageNumber)}
                      className="min-w-[2.5rem]"
                    >
                      {pageNumber}
                    </Button>
                  );
                }
                
                // Show ellipsis
                if (
                  pageNumber === currentPage - 2 ||
                  pageNumber === currentPage + 2
                ) {
                  return (
                    <span key={pageNumber} className="px-2 text-gray-500">
                      ...
                    </span>
                  );
                }
                
                return null;
              })}
            </div>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}

        {/* API Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-blue-600 dark:text-blue-400">ℹ️</span>
            <span className="font-medium text-blue-800 dark:text-blue-200">API Information</span>
          </div>
          <p className="text-blue-700 dark:text-blue-300">
            Data fetched from{' '}
            <a
              href="https://jsonplaceholder.typicode.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:no-underline"
            >
              JSONPlaceholder
            </a>
            {' '}— a free fake API for testing and prototyping.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ApiData;