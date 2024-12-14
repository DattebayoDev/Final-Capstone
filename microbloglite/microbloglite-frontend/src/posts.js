"use strict";

// Function to fetch posts for a specific user
async function fetchUserPosts(username) {
    try {
        // Get the authentication token using the getLoginData function from auth.js
        const loginData = getLoginData();
        const token = loginData.token;

        // Check if token exists
        if (!token) {
            throw new Error('No authentication token found');
        }

        // Fetch posts with authentication
        const response = await fetch(`${apiBaseURL}/api/posts?limit=100&offset=0&username=${username}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        // Check if the response is successful
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch posts');
        }

        // Parse the JSON response
        const posts = await response.json();

        // Render the posts
        renderPosts(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        // Display an error message to the user
        document.querySelector('main').innerHTML = `
            <div class="alert alert-danger">
                Error loading posts: ${error.message}
                <br>
                <a href="/" class="btn btn-primary mt-2">Return to Login</a>
            </div>
        `;
    }
}

// Function to render posts to the page
function renderPosts(posts) {
    const mainElement = document.querySelector('main');
    
    // Clear any existing content
    mainElement.innerHTML = '';

    // Check if there are no posts
    if (posts.length === 0) {
        mainElement.innerHTML = '<p>No posts found.</p>';
        return;
    }

    // Create a container for posts
    const postsContainer = document.createElement('div');
    postsContainer.classList.add('posts-container');

    // Iterate through posts and create HTML for each
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('post', 'card', 'mb-3');
        postElement.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${post.username}</h5>
                <p class="card-text">${post.text}</p>
                <small class="text-muted">Posted on: ${new Date(post.createdAt).toLocaleString()}</small>
            </div>
        `;
        postsContainer.appendChild(postElement);
    });

    // Add the posts container to the main element
    mainElement.appendChild(postsContainer);
}

// Get the logged-in username and fetch posts when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const loginData = getLoginData();
    const username = loginData.username;

    if (username) {
        fetchUserPosts(username);
    } else {
        console.error('No username found');
        document.querySelector('main').innerHTML = `
            <div class="alert alert-warning">
                Please log in to view posts.
                <br>
                <a href="/" class="btn btn-primary mt-2">Return to Login</a>
            </div>
        `;
    }
});