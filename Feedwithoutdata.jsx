<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Eco-Connect: Impact Feed</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'smart-green': '#10b981',   
                        'smart-dark-green': '#059669',
                        'smart-light-green': '#d1fae5',
                        'smart-text-dark': '#1f2937',
                        'smart-text-light': '#4b5563',
                        'smart-bg-light': '#f8fafc',
                    },
                }
            }
        }
    </script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        .modal {
            transition: opacity 0.3s ease-out, visibility 0.3s ease-out;
            visibility: hidden; 
            opacity: 0;
        }
        .modal.is-open {
            visibility: visible;
            opacity: 1;
        }
        .modal-content {
            transition: transform 0.3s ease-out;
            transform: scale(0.95);
        }
        .modal.is-open .modal-content {
            transform: scale(1);
        }
    </style>
</head>
<body class="font-sans bg-smart-bg-light min-h-screen">

    <header class="bg-white shadow-sm">
        <div class="container mx-auto px-4 py-3 flex justify-between items-center max-w-7xl">
            <div class="flex items-center space-x-2">
                <svg class="w-7 h-7 text-smart-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                <span class="text-xl font-bold text-smart-text-dark">Smart</span>
            </div>
            <span class="font-semibold text-smart-green border-b-2 border-smart-green pb-1 hidden sm:inline">Impact Feed</span>
            <button class="bg-smart-green text-white font-semibold py-2 px-4 rounded-lg hover:bg-smart-dark-green transition duration-300">Profile</button>
        </div>
    </header>
    
    <div class="p-4 md:p-8 max-w-3xl mx-auto">
        <div class="flex justify-between items-center mb-6 pt-4">
            <h1 class="text-3xl font-bold text-smart-text-dark">Eco-Connect: Impact Feed</h1>
            <button
                id="openModalBtn"
                class="bg-smart-green text-white font-semibold py-2 px-5 rounded-full hover:bg-smart-dark-green transition duration-300 shadow-md flex items-center space-x-2"
            >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4C11.45 4 11 4.45 11 5V11H5C4.45 11 4 11.45 4 12C4 12.55 4.45 13 5 13H11V19C11 19.55 11.45 20 12 20C12.55 20 13 19.55 13 19V13H19C19.55 13 20 12.55 20 12C20 11.45 19.55 11 19 11H13V5C13 4.45 12.55 4 12 4Z"/></svg>
                <span>New Post</span>
            </button>
        </div>
        
        <div id="postsContainer" class="space-y-6">
            
            </div>
    </div>

    <div id="postModal" class="modal fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div id="modalContent" class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg">
            <div class="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
                <h2 class="text-xl font-bold text-smart-text-dark">Create New Post</h2>
                <button id="closeModalBtn" class="text-gray-500 hover:text-gray-700">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
            
            <textarea 
                id="postContentInput"
                placeholder="Share your latest Eco-Action, AR Exploration, or Learning..." 
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-smart-green focus:border-smart-green transition duration-150 resize-none text-smart-text-dark"
                rows="5"
            ></textarea>

            <div id="imagePreviewContainer" class="mt-4 relative hidden">
                <img id="imagePreview" src="" alt="Image Preview" class="w-full h-40 object-cover rounded-lg" />
                <button id="removeImageBtn" class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 text-xs">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>

            <div class="flex items-center justify-between mt-4 text-smart-text-light">
                <div class="flex space-x-4">
                    <label class="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition duration-150">
                        <svg class="w-6 h-6 text-smart-green" fill="currentColor" viewBox="0 0 24 24"><path d="M19 19H5V5h14v14zm0-16H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM5 15h4v4H5v-4zm0-6h4v4H5V9zm6 0h4v4h-4V9zm6 0h4v4h-4V9z"/></svg>
                        <span class="text-sm font-medium">Add Photo</span>
                        <input type="file" id="imageUploadInput" accept="image/*" class="hidden" />
                    </label>

                    <select
                        id="postTypeSelect"
                        class="border border-gray-300 rounded-lg p-2 text-sm focus:ring-smart-green focus:border-smart-green transition duration-150"
                    >
                        <option value="learning">Learning</option>
                        <option value="action">Eco-Action</option>
                        <option value="exploration">Exploration</option>
                    </select>
                </div>
                
                <button 
                    id="submitPostBtn"
                    class="bg-smart-green text-white font-semibold py-2 px-6 rounded-full hover:bg-smart-dark-green transition duration-300 shadow-md disabled:opacity-50"
                    disabled
                >
                    Post to Feed
                </button>
            </div>
        </div>
    </div>

    <script>
        const postsContainer = document.getElementById('postsContainer');
        const openModalBtn = document.getElementById('openModalBtn');
        const closeModalBtn = document.getElementById('closeModalBtn');
        const postModal = document.getElementById('postModal');
        const submitPostBtn = document.getElementById('submitPostBtn');
        const postContentInput = document.getElementById('postContentInput');
        const postTypeSelect = document.getElementById('postTypeSelect');
        const imageUploadInput = document.getElementById('imageUploadInput');
        const imagePreview = document.getElementById('imagePreview');
        const imagePreviewContainer = document.getElementById('imagePreviewContainer');
        const removeImageBtn = document.getElementById('removeImageBtn');

        let currentImageURL = null; 
        let dummyPosts = [
            {
                id: 1, user: { name: "Aisha Khan", avatar: "A", role: "Student at Green Valley High" }, time: "3 hours ago",
                content: "Just finished my AR exploration of a virtual rainforest! It's incredible how many species depend on healthy ecosystems. Feeling inspired to start my own mini-garden! 🌳 #ARLearns #EcoAction",
                image: "https://images.unsplash.com/photo-1542867041-f71660ef05b2?ixlib=rb4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
                likes: 72, comments: 18, type: "Eco-Action"
            },
            {
                id: 2, user: { name: "Dr. Elena Petrova", avatar: "D", role: "Professor" }, time: "2 days ago",
                content: "Fascinating insights from the AI-powered energy grid optimization module. It clearly shows the potential for significant carbon footprint reduction in urban areas. Excited for my students to try this next week! #AIforGood #SustainableCities",
                image: null, likes: 55, comments: 9, type: "Exploration"
            }
        ];

        function getTagClasses(type) {
            switch (type.toLowerCase()) {
                case 'eco-action':
                case 'action': return 'bg-smart-green/20 text-smart-dark-green';
                case 'learning': return 'bg-blue-100 text-blue-700';
                case 'exploration': return 'bg-yellow-100 text-yellow-700';
                default: return 'bg-gray-100 text-gray-700';
            }
        }

        function createPostCardHTML(post) {
            const tagClasses = getTagClasses(post.type);
            const imageHTML = post.image ? `
                <div class="my-4 -mx-6">
                    <img src="${post.image}" alt="Post Media" class="w-full h-64 object-cover rounded-b-none rounded-t-xl" />
                </div>
            ` : '';
            
            return `
                <div class="bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
                    <div class="flex items-start justify-between mb-4">
                        <div class="flex items-center">
                            <div class="w-10 h-10 flex items-center justify-center text-lg font-bold rounded-full bg-smart-light-green text-smart-dark-green mr-3">
                                ${post.user.avatar}
                            </div>
                            <div>
                                <p class="font-bold text-smart-text-dark">${post.user.name}</p>
                                <p class="text-xs text-smart-text-light">${post.user.role} • ${post.time}</p>
                            </div>
                        </div>
                        <span class="text-xs font-semibold px-3 py-1 rounded-full capitalize ${tagClasses}">
                            ${post.type}
                        </span>
                    </div>

                    <p class="text-smart-text-light mb-4 leading-relaxed">${post.content}</p>
                    ${imageHTML}

                    <div class="flex justify-around items-center border-t border-gray-100 mt-4 pt-4 text-smart-text-light">
                        <button class="flex items-center space-x-1 p-2 rounded-lg hover:bg-gray-100 transition duration-150"><svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg><span class="font-medium">${post.likes} Likes</span></button>
                        <button class="flex items-center space-x-1 p-2 rounded-lg hover:bg-gray-100 transition duration-150"><svg class="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M21 11.5c0 .28-.22.5-.5.5H19v2h2c.28 0 .5.22.5.5v2c0 .28-.22.5-.5.5H19v2h2c.28 0 .5.22.5.5v2c0 .28-.22.5-.5.5H3.5c-.28 0-.5-.22-.5-.5v-2c0-.28.22-.5.5-.5H5v-2H3.5c-.28 0-.5-.22-.5-.5v-2c0-.28.22-.5.5-.5H5v-2H3.5c-.28 0-.5-.22-.5-.5V6c0-.55.45-1 1-1h17c.55 0 1 .45 1 1v5.5zM15 13H9v-2h6v2z"/></svg><span class="font-medium">${post.comments} Comments</span></button>
                        <button class="flex items-center space-x-1 p-2 rounded-lg hover:bg-gray-100 transition duration-150"><svg class="w-5 h-5 text-smart-green" fill="currentColor" viewBox="0 0 24 24"><path d="M18 16.08V12H6v4.08l4.13-1.85-.3.26L12 19l2.17-2.51-.3-.26L18 16.08zM12 21.75l-7.75-9.75V3h15.5v9.06L12 21.75z"/></svg><span class="font-medium">Share</span></button>
                    </div>
                </div>
            `;
        }

        function renderPosts() {
            postsContainer.innerHTML = ''; 
            dummyPosts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.innerHTML = createPostCardHTML(post);
                postsContainer.appendChild(postElement.firstChild);
            });
        }

        function openModal() {
            postModal.classList.add('is-open');
        }

        function closeModal() {
            postModal.classList.remove('is-open');
            resetModalForm();
        }
        
        function resetModalForm() {
            postContentInput.value = '';
            postTypeSelect.value = 'learning';
            imageUploadInput.value = null;
            if (currentImageURL) {
                URL.revokeObjectURL(currentImageURL);
            }
            currentImageURL = null;
            imagePreviewContainer.classList.add('hidden');
            imagePreview.src = '';
            submitPostBtn.disabled = true;
        }

        function validateForm() {
            const isContentPresent = postContentInput.value.trim().length > 0;
            const isImagePresent = currentImageURL !== null;
            submitPostBtn.disabled = !(isContentPresent || isImagePresent);
        }

        function handleImageUpload(event) {
            const file = event.target.files[0];
            if (file) {
                if (currentImageURL) {
                    URL.revokeObjectURL(currentImageURL);
                }
                currentImageURL = URL.createObjectURL(file);
                imagePreview.src = currentImageURL;
                imagePreviewContainer.classList.remove('hidden');
            }
            validateForm(); 
        }
        
        function handleRemoveImage() {
            imageUploadInput.value = null;
            if (currentImageURL) {
                URL.revokeObjectURL(currentImageURL);
            }
            currentImageURL = null;
            imagePreviewContainer.classList.add('hidden');
            imagePreview.src = '';
            validateForm(); 
        }

        function handleSubmitPost() {
            const content = postContentInput.value.trim();
            
            if (!content && !currentImageURL) return;

            const newPost = {
                id: Date.now(),
                user: { name: "You (Demo User)", avatar: "😊", role: "Smart Learner" },
                time: "Just now",
                content: content || "(Shared a photo/exploration)",
                image: currentImageURL,
                likes: 0,
                comments: 0,
                type: postTypeSelect.value
            };
            
            dummyPosts.unshift(newPost);
            renderPosts();
            closeModal();
        }

        document.addEventListener('DOMContentLoaded', () => {
            renderPosts();
            
            openModalBtn.addEventListener('click', openModal);
            closeModalBtn.addEventListener('click', closeModal);
            postModal.addEventListener('click', (e) => {
                if (e.target === postModal) {
                    closeModal();
                }
            });

            postContentInput.addEventListener('input', validateForm);
            imageUploadInput.addEventListener('change', handleImageUpload);
            removeImageBtn.addEventListener('click', handleRemoveImage);
            submitPostBtn.addEventListener('click', handleSubmitPost);

            postModal.classList.remove('is-open');
            postModal.classList.add('hidden');
        });
    </script>
</body>
</html>
