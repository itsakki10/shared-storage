<!DOCTYPE html>
<html lang="en">
<head> 
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DEBUG: Eco-Connect Feed</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        // Define your custom Tailwind colors for the preview  
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
            <button id="openModalBtn" class="bg-smart-green text-white font-semibold py-2 px-5 rounded-full hover:bg-smart-dark-green transition duration-300 shadow-md flex items-center space-x-2">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4C11.45 4 11 4.45 11 5V11H5C4.45 11 4 11.45 4 12C4 12.55 4.45 13 5 13H11V19C11 19.55 11.45 20 12 20C12.55 20 13 19.55 13 19V13H19C19.55 13 20 12.55 20 12C20 11.45 19.55 11 19 11H13V5C13 4.45 12.55 4 12 4Z"/></svg>
                <span>New Post</span>
            </button>
        </div>
        
        <div id="postsContainer" class="space-y-6">
            
            <div class="bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex items-center">
                        <div class="w-10 h-10 flex items-center justify-center text-lg font-bold rounded-full bg-smart-light-green text-smart-dark-green mr-3">A</div>
                        <div>
                            <p class="font-bold text-smart-text-dark">Aisha Khan</p>
                            <p class="text-xs text-smart-text-light">Student at Green Valley High • 3 hours ago</p>
                        </div>
                    </div>
                    <span class="text-xs font-semibold px-3 py-1 rounded-full capitalize bg-smart-green/20 text-smart-dark-green">Eco-Action</span>
                </div>

                <p class="text-smart-text-light mb-4 leading-relaxed">Just finished my AR exploration of a virtual rainforest! It's incredible how many species depend on healthy ecosystems. Feeling inspired to start my own mini-garden! 🌳 #ARLearns #EcoAction</p>
                
                <div class="my-4 -mx-6">
                    <img src="https://images.unsplash.com/photo-1542867041-f71660ef05b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80" alt="Rainforest" class="w-full h-64 object-cover rounded-b-none rounded-t-xl" />
                </div>

                <div class="flex justify-around items-center border-t border-gray-100 mt-4 pt-4 text-smart-text-light">
                    <button class="flex items-center space-x-1 p-2 rounded-lg hover:bg-gray-100 transition duration-150"><svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg><span class="font-medium">72 Likes</span></button>
                    <button class="flex items-center space-x-1 p-2 rounded-lg hover:bg-gray-100 transition duration-150"><svg class="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M21 11.5c0 .28-.22.5-.5.5H19v2h2c.28 0 .5.22.5.5v2c0 .28-.22.5-.5.5H19v2h2c.28 0 .5.22.5.5v2c0 .28-.22.5-.5.5H3.5c-.28 0-.5-.22-.5-.5v-2c0-.28.22-.5.5-.5H5v-2H3.5c-.28 0-.5-.22-.5-.5v-2c0-.28.22-.5.5-.5H5v-2H3.5c-.28 0-.5-.22-.5-.5V6c0-.55.45-1 1-1h17c.55 0 1 .45 1 1v5.5zM15 13H9v-2h6v2z"/></svg><span class="font-medium">18 Comments</span></button>
                    <button class="flex items-center space-x-1 p-2 rounded-lg hover:bg-gray-100 transition duration-150"><svg class="w-5 h-5 text-smart-green" fill="currentColor" viewBox="0 0 24 24"><path d="M18 16.08V12H6v4.08l4.13-1.85-.3.26L12 19l2.17-2.51-.3-.26L18 16.08zM12 21.75l-7.75-9.75V3h15.5v9.06L12 21.75z"/></svg><span class="font-medium">Share</span></button>
                </div>
            </div>
            
            <div class="bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex items-center">
                        <div class="w-10 h-10 flex items-center justify-center text-lg font-bold rounded-full bg-yellow-100 text-yellow-700 mr-3">D</div>
                        <div>
                            <p class="font-bold text-smart-text-dark">Dr. Elena Petrova</p>
                            <p class="text-xs text-smart-text-light">Professor • 2 days ago</p>
                        </div>
                    </div>
                    <span class="text-xs font-semibold px-3 py-1 rounded-full capitalize bg-yellow-100 text-yellow-700">Exploration</span>
                </div>

                <p class="text-smart-text-light mb-4 leading-relaxed">Fascinating insights from the AI-powered energy grid optimization module. It clearly shows the potential for significant carbon footprint reduction in urban areas. Excited for my students to try this next week! #AIforGood #SustainableCities</p>
                
                <div class="flex justify-around items-center border-t border-gray-100 mt-4 pt-4 text-smart-text-light">
                    <button class="flex items-center space-x-1 p-2 rounded-lg hover:bg-gray-100 transition duration-150"><svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg><span class="font-medium">55 Likes</span></button>
                    <button class="flex items-center space-x-1 p-2 rounded-lg hover:bg-gray-100 transition duration-150"><svg class="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M21 11.5c0 .28-.22.5-.5.5H19v2h2c.28 0 .5.22.5.5v2c0 .28-.22.5-.5.5H19v2h2c.28 0 .5.22.5.5v2c0 .28-.22.5-.5.5H3.5c-.28 0-.5-.22-.5-.5v-2c0-.28.22-.5.5-.5H5v-2H3.5c-.28 0-.5-.22-.5-.5v-2c0-.28.22-.5.5-.5H5v-2H3.5c-.28 0-.5-.22-.5-.5V6c0-.55.45-1 1-1h17c.55 0 1 .45 1 1v5.5zM15 13H9v-2h6v2z"/></svg><span class="font-medium">9 Comments</span></button>
                    <button class="flex items-center space-x-1 p-2 rounded-lg hover:bg-gray-100 transition duration-150"><svg class="w-5 h-5 text-smart-green" fill="currentColor" viewBox="0 0 24 24"><path d="M18 16.08V12H6v4.08l4.13-1.85-.3.26L12 19l2.17-2.51-.3-.26L18 16.08zM12 21.75l-7.75-9.75V3h15.5v9.06L12 21.75z"/></svg><span class="font-medium">Share</span></button>
                </div>
            </div>
        </div>
    </div>
    
    <div id="postModal" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4 hidden">
        </div>


    <script>
        // --- Minimal JavaScript for Open/Close Modal ---
        document.addEventListener('DOMContentLoaded', () => {
            const openModalBtn = document.getElementById('openModalBtn');
            const postModal = document.getElementById('postModal');

            if (openModalBtn && postModal) {
                 // ONLY hide the modal initially IF the button exists
                postModal.classList.add('hidden'); 

                openModalBtn.addEventListener('click', () => {
                    postModal.classList.remove('hidden');
                });
                
                // Add listener to close button inside the modal if needed for testing
                const closeModalBtn = postModal.querySelector('#closeModalBtn');
                if (closeModalBtn) {
                    closeModalBtn.addEventListener('click', () => {
                        postModal.classList.add('hidden');
                    });
                }
            } else {
                 console.error("Modal elements not found. Code is incomplete or not rendered.");
            }
        });
    </script>
</body>
</html>
