// script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- State Management ---
    // The 'bikes' array is now empty. It will be filled with data from our backend.
    let bikes = [];
    let cart = [];
    let currentSlide = 0;
    let autoScrollInterval;
    const themes = ['light', 'yellow', 'dark'];
    let currentThemeIndex = 0;

    // --- DOM Elements ---
    const bikeList = document.getElementById('bike-list');
    const cartButton = document.getElementById('cart-button');
    const closeCartButton = document.getElementById('close-cart-button');
    const cartModal = document.getElementById('cart-modal');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const themeToggleButton = document.getElementById('theme-toggle');
    const carouselTrack = document.getElementById('carousel-track');
    const carouselDotsContainer = document.getElementById('carousel-dots');
    const searchInput = document.getElementById('search-input');
    const mobileSearchInput = document.getElementById('mobile-search-input');
    const searchButton = document.getElementById('search-button');
    const mobileSearchButton = document.getElementById('mobile-search-button');

    // --- NEW: Function to Fetch Bike Data from Backend ---
    /**
     * Fetches the list of bikes from our backend server.
     * This is an 'async' function because network requests take time.
     */
    async function fetchBikes() {
        try {
            // We use the fetch API to make a GET request to our server's endpoint.
            const response = await fetch('http://localhost:3000/api/bikes');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // We parse the JSON response and store it in our 'bikes' array.
            const fetchedBikes = await response.json();
            bikes = fetchedBikes; // Update the global bikes array

            // Now that we have the data, we can render everything.
            renderBikes();
            setupCarousel();
            startAutoScroll();
        } catch (error) {
            console.error('Failed to fetch bikes:', error);
            // Display an error message to the user on the page
            bikeList.innerHTML = '<p class="text-center text-xl text-red-500 col-span-full">Could not load bike data. Please make sure the backend server is running.</p>';
        }
    }


    // --- Carousel Functions ---
    function setupCarousel() {
        if (!bikes || bikes.length === 0) return; // Don't run if bikes aren't loaded
        const carouselBikes = bikes.slice(0, 5);
        carouselTrack.innerHTML = '';
        carouselDotsContainer.innerHTML = '';
        carouselBikes.forEach((bike, index) => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide relative h-full';
            slide.innerHTML = `
                <img src="${bike.image}" alt="${bike.name}" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div class="text-center text-white">
                        <h1 class="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">${bike.name}</h1>
                        <p class="text-lg md:text-xl mb-8 max-w-2xl mx-auto drop-shadow-md">Discover the thrill of the open road.</p>
                        <a href="#bikes" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 transform hover:scale-105">Explore Now</a>
                    </div>
                </div>
            `;
            carouselTrack.appendChild(slide);
            const dot = document.createElement('button');
            dot.className = 'carousel-dot w-3 h-3 bg-white bg-opacity-50 rounded-full transition-all duration-300';
            dot.addEventListener('click', () => {
                moveToSlide(index);
                resetAutoScroll();
            });
            carouselDotsContainer.appendChild(dot);
        });
        updateCarousel();
    }

    function updateCarousel() {
        if (carouselTrack.children.length === 0) return;
        carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        const dots = carouselDotsContainer.children;
        Array.from(dots).forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function moveToSlide(slideIndex) {
        currentSlide = slideIndex;
        updateCarousel();
    }

    function startAutoScroll() {
        if (autoScrollInterval) clearInterval(autoScrollInterval); // Clear existing interval
        autoScrollInterval = setInterval(() => {
            if (carouselTrack.children.length > 0) {
                 const nextSlide = (currentSlide + 1) % (carouselTrack.children.length);
                 moveToSlide(nextSlide);
            }
        }, 5000);
    }

    function resetAutoScroll() {
        clearInterval(autoScrollInterval);
        startAutoScroll();
    }

    // --- Theme Functions --- (No changes here, code is omitted for brevity)
    const applyTheme = (theme) => {
                const root = document.documentElement;
                root.classList.remove('dark');
                const themeIcon = themeToggleButton.querySelector('i');
                const bikeCards = document.querySelectorAll('#bike-list > div');
                const cartItems = document.querySelectorAll('#cart-items > div');

                // Main body and section classes
                const mainElements = {
                    body: document.body,
                    header: document.querySelector('header'),
                    mobileMenu: document.getElementById('mobile-menu'),
                    bikesSection: document.getElementById('bikes'),
                    aboutSection: document.getElementById('about'),
                    contactSection: document.getElementById('contact'),
                    contactForm: document.querySelector('#contact > div'),
                    footer: document.querySelector('footer'),
                    cartModal: document.getElementById('cart-modal').querySelector('div'),
                };

                // Reset classes for all elements
                Object.values(mainElements).forEach(el => el.className = '');
                bikeCards.forEach(card => card.className = '');
                cartItems.forEach(item => item.className = '');

                // Apply theme-specific classes
                if (theme === 'dark') {
                    root.classList.add('dark');
                    mainElements.body.className = "bg-gray-900 text-gray-200 transition-colors duration-300";
                    mainElements.header.className = "bg-gray-800 shadow-md sticky top-0 z-50 transition-colors duration-300";
                    document.querySelector('nav > a').className = "text-2xl font-bold text-white";
                    document.querySelectorAll('nav > div.hidden.md\\:flex.items-center.space-x-6 a').forEach(a => a.className = "text-gray-300 hover:text-blue-400 transition duration-300");
                    themeToggleButton.className = "text-gray-300 hover:text-blue-400 transition duration-300 mr-4";
                    document.getElementById('cart-button').className = "relative text-gray-300 hover:text-blue-400 transition duration-300 mr-4";
                    document.getElementById('mobile-menu-button').className = "md:hidden text-gray-300 focus:outline-none";
                    mainElements.mobileMenu.className = "hidden md:hidden bg-gray-800 border-t border-gray-700";
                    document.querySelectorAll('#mobile-menu a').forEach(a => a.className = "block py-2 px-4 text-sm text-gray-300 hover:bg-gray-700");
                    mainElements.bikesSection.className = "py-16 bg-gray-800 transition-colors duration-300";
                    document.querySelector('#bikes > div > h2').className = "text-3xl font-bold text-center mb-10 text-white";
                    bikeCards.forEach(card => {
                        card.className = "bg-gray-700 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-all duration-300";
                        card.querySelector('h3').className = "text-xl font-bold mb-2 text-white";
                        card.querySelector('p').className = "text-gray-300 mb-4";
                        card.querySelector('.text-blue-600').className = "text-2xl font-bold text-blue-400";
                    });
                    mainElements.aboutSection.className = "py-16 bg-gray-900 transition-colors duration-300";
                    document.querySelector('#about > div > div:nth-child(2) > h2').className = "text-3xl font-bold mb-4 text-white";
                    document.querySelectorAll('#about > div > div:nth-child(2) > p').forEach(p => p.className = "text-gray-300 mb-4 leading-relaxed");
                    mainElements.contactSection.className = "py-16 bg-gray-800 transition-colors duration-300";
                    document.querySelector('#contact > div > h2').className = "text-3xl font-bold text-center mb-10 text-white";
                    mainElements.contactForm.className = "max-w-lg mx-auto bg-gray-700 p-8 rounded-lg shadow-md";
                    document.querySelectorAll('#contact form label').forEach(label => label.className = "block text-gray-200 font-semibold mb-2");
                    document.querySelectorAll('#contact form input, #contact form textarea').forEach(input => input.className = "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-600 border-gray-500 placeholder-gray-400 text-white");
                    document.querySelector('#contact form button').className = "w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300";
                    document.querySelectorAll('#search-input, #mobile-search-input').forEach(input => input.className = 'pl-4 pr-10 py-2 rounded-full border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 bg-gray-700 text-white');
                    document.querySelectorAll('#search-button, #mobile-search-button').forEach(btn => btn.className = 'absolute right-0 top-0 mt-2 mr-3 text-gray-400 hover:text-gray-200');
                    mainElements.footer.className = "bg-gray-900 text-white py-8";
                    document.querySelectorAll('footer a').forEach(a => a.className = "text-gray-400 hover:text-white");
                    mainElements.cartModal.className = "bg-gray-800 w-full md:w-1/3 h-full shadow-xl flex flex-col transition-colors duration-300";
                    mainElements.cartModal.querySelector('h3').className = "text-xl font-bold text-white";
                    mainElements.cartModal.querySelector('#close-cart-button').className = "text-gray-400 hover:text-white";
                    document.getElementById('cart-items').className = "p-4 flex-grow overflow-y-auto";
                    cartItems.forEach(item => {
                        item.className = "flex justify-between items-center mb-4 p-2 rounded-lg bg-gray-700 cart-item-enter";
                        item.querySelector('h4').className = "font-semibold text-gray-100";
                        item.querySelector('p').className = "text-gray-400 text-sm";
                        item.querySelector('.quantity-input').className = "quantity-input w-16 text-center border rounded-md mx-2 bg-gray-600 border-gray-500 text-white";
                    });
                    mainElements.cartModal.querySelector('.font-bold').className = "flex justify-between items-center font-bold text-lg mb-4 text-white";
                    mainElements.cartModal.querySelector('button').className = "w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-300";

                    themeIcon.classList.remove('fa-sun', 'fa-moon');
                    themeIcon.classList.add('fa-star');
                } else if (theme === 'yellow') {
                    mainElements.body.className = "bg-yellow-100 text-yellow-900 transition-colors duration-300";
                    mainElements.header.className = "bg-yellow-200 shadow-md sticky top-0 z-50 transition-colors duration-300";
                    document.querySelector('nav > a').className = "text-2xl font-bold text-yellow-900";
                    document.querySelectorAll('nav > div.hidden.md\\:flex.items-center.space-x-6 a').forEach(a => a.className = "text-yellow-700 hover:text-blue-800 transition duration-300");
                    themeToggleButton.className = "text-yellow-700 hover:text-blue-800 transition duration-300 mr-4";
                    document.getElementById('cart-button').className = "relative text-yellow-700 hover:text-blue-800 transition duration-300 mr-4";
                    document.getElementById('mobile-menu-button').className = "md:hidden text-yellow-700 focus:outline-none";
                    mainElements.mobileMenu.className = "hidden md:hidden bg-yellow-200 border-t border-yellow-300";
                    document.querySelectorAll('#mobile-menu a').forEach(a => a.className = "block py-2 px-4 text-sm text-yellow-700 hover:bg-yellow-300");
                    mainElements.bikesSection.className = "py-16 bg-yellow-50 transition-colors duration-300";
                    document.querySelector('#bikes > div > h2').className = "text-3xl font-bold text-center mb-10 text-yellow-900";
                    bikeCards.forEach(card => {
                        card.className = "bg-yellow-200 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-all duration-300";
                        card.querySelector('h3').className = "text-xl font-bold mb-2 text-yellow-900";
                        card.querySelector('p').className = "text-yellow-700 mb-4";
                        card.querySelector('.text-blue-600').className = "text-2xl font-bold text-blue-800";
                    });
                    mainElements.aboutSection.className = "py-16 bg-yellow-100 transition-colors duration-300";
                    document.querySelector('#about > div > div:nth-child(2) > h2').className = "text-3xl font-bold mb-4 text-yellow-900";
                    document.querySelectorAll('#about > div > div:nth-child(2) > p').forEach(p => p.className = "text-yellow-700 mb-4 leading-relaxed");
                    mainElements.contactSection.className = "py-16 bg-yellow-50 transition-colors duration-300";
                    document.querySelector('#contact > div > h2').className = "text-3xl font-bold text-center mb-10 text-yellow-900";
                    mainElements.contactForm.className = "max-w-lg mx-auto bg-yellow-200 p-8 rounded-lg shadow-md";
                    document.querySelectorAll('#contact form label').forEach(label => label.className = "block text-yellow-800 font-semibold mb-2");
                    document.querySelectorAll('#contact form input, #contact form textarea').forEach(input => input.className = "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-yellow-300 border-yellow-400 placeholder-yellow-700 text-yellow-900");
                    document.querySelector('#contact form button').className = "w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300";
                    document.querySelectorAll('#search-input, #mobile-search-input').forEach(input => input.className = 'pl-4 pr-10 py-2 rounded-full border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 bg-yellow-300 text-yellow-900');
                    document.querySelectorAll('#search-button, #mobile-search-button').forEach(btn => btn.className = 'absolute right-0 top-0 mt-2 mr-3 text-yellow-700 hover:text-yellow-900');
                    mainElements.footer.className = "bg-yellow-900 text-white py-8";
                    document.querySelectorAll('footer a').forEach(a => a.className = "text-yellow-400 hover:text-white");
                    mainElements.cartModal.className = "bg-yellow-200 w-full md:w-1/3 h-full shadow-xl flex flex-col transition-colors duration-300";
                    mainElements.cartModal.querySelector('h3').className = "text-xl font-bold text-yellow-900";
                    mainElements.cartModal.querySelector('#close-cart-button').className = "text-yellow-700 hover:text-yellow-900";
                    document.getElementById('cart-items').className = "p-4 flex-grow overflow-y-auto";
                    cartItems.forEach(item => {
                        item.className = "flex justify-between items-center mb-4 p-2 rounded-lg bg-yellow-300 cart-item-enter";
                        item.querySelector('h4').className = "font-semibold text-yellow-900";
                        item.querySelector('p').className = "text-yellow-700 text-sm";
                        item.querySelector('.quantity-input').className = "quantity-input w-16 text-center border rounded-md mx-2 bg-yellow-400 border-yellow-500 text-yellow-900";
                    });
                    mainElements.cartModal.querySelector('.font-bold').className = "flex justify-between items-center font-bold text-lg mb-4 text-yellow-900";
                    mainElements.cartModal.querySelector('button').className = "w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-300";

                    themeIcon.classList.remove('fa-sun', 'fa-star');
                    themeIcon.classList.add('fa-moon');
                } else { // light theme
                    mainElements.body.className = "bg-gray-100 text-gray-800 transition-colors duration-300";
                    mainElements.header.className = "bg-white shadow-md sticky top-0 z-50 transition-colors duration-300";
                    document.querySelector('nav > a').className = "text-2xl font-bold text-gray-900";
                    document.querySelectorAll('nav > div.hidden.md\\:flex.items-center.space-x-6 a').forEach(a => a.className = "text-gray-600 hover:text-blue-600 transition duration-300");
                    themeToggleButton.className = "text-gray-600 hover:text-blue-600 transition duration-300 mr-4";
                    document.getElementById('cart-button').className = "relative text-gray-600 hover:text-blue-600 transition duration-300 mr-4";
                    document.getElementById('mobile-menu-button').className = "md:hidden text-gray-600 focus:outline-none";
                    mainElements.mobileMenu.className = "hidden md:hidden bg-white border-t border-gray-200";
                    document.querySelectorAll('#mobile-menu a').forEach(a => a.className = "block py-2 px-4 text-sm text-gray-600 hover:bg-gray-100");
                    mainElements.bikesSection.className = "py-16 bg-gray-50 transition-colors duration-300";
                    document.querySelector('#bikes > div > h2').className = "text-3xl font-bold text-center mb-10 text-gray-900";
                    bikeCards.forEach(card => {
                        card.className = "bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-all duration-300";
                        card.querySelector('h3').className = "text-xl font-bold mb-2 text-gray-900";
                        card.querySelector('p').className = "text-gray-600 mb-4";
                        card.querySelector('.text-blue-600').className = "text-2xl font-bold text-blue-600";
                    });
                    mainElements.aboutSection.className = "py-16 bg-white transition-colors duration-300";
                    document.querySelector('#about > div > div:nth-child(2) > h2').className = "text-3xl font-bold mb-4 text-gray-900";
                    document.querySelectorAll('#about > div > div:nth-child(2) > p').forEach(p => p.className = "text-gray-600 mb-4 leading-relaxed");
                    mainElements.contactSection.className = "py-16 bg-gray-50 transition-colors duration-300";
                    document.querySelector('#contact > div > h2').className = "text-3xl font-bold text-center mb-10 text-gray-900";
                    mainElements.contactForm.className = "max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md";
                    document.querySelectorAll('#contact form label').forEach(label => label.className = "block text-gray-700 font-semibold mb-2");
                    document.querySelectorAll('#contact form input, #contact form textarea').forEach(input => input.className = "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500");
                    document.querySelector('#contact form button').className = "w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300";
                    document.querySelectorAll('#search-input, #mobile-search-input').forEach(input => input.className = 'pl-4 pr-10 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 bg-white text-gray-900');
                    document.querySelectorAll('#search-button, #mobile-search-button').forEach(btn => btn.className = 'absolute right-0 top-0 mt-2 mr-3 text-gray-500 hover:text-gray-700');
                    mainElements.footer.className = "bg-gray-900 text-white py-8";
                    document.querySelectorAll('footer a').forEach(a => a.className = "text-gray-400 hover:text-white");
                    mainElements.cartModal.className = "bg-white w-full md:w-1/3 h-full shadow-xl flex flex-col transition-colors duration-300";
                    mainElements.cartModal.querySelector('h3').className = "text-xl font-bold text-gray-900";
                    mainElements.cartModal.querySelector('#close-cart-button').className = "text-gray-500 hover:text-gray-800";
                    document.getElementById('cart-items').className = "p-4 flex-grow overflow-y-auto";
                    cartItems.forEach(item => {
                        item.className = "flex justify-between items-center mb-4 p-2 rounded-lg bg-gray-50 cart-item-enter";
                        item.querySelector('h4').className = "font-semibold text-gray-800";
                        item.querySelector('p').className = "text-gray-500 text-sm";
                        item.querySelector('.quantity-input').className = "quantity-input w-16 text-center border rounded-md mx-2";
                    });
                    mainElements.cartModal.querySelector('.font-bold').className = "flex justify-between items-center font-bold text-lg mb-4 text-gray-900";
                    mainElements.cartModal.querySelector('button').className = "w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-300";

                    themeIcon.classList.remove('fa-moon', 'fa-star');
                    themeIcon.classList.add('fa-sun');
                }
            };
    const toggleTheme = () => {
        currentThemeIndex = (currentThemeIndex + 1) % themes.length;
        const newTheme = themes[currentThemeIndex];
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    };

    // --- Search Functionality --- (No changes needed)
    function performSearch(query) {
        const normalizedQuery = query.toLowerCase().trim();
        const filteredBikes = bikes.filter(bike =>
            bike.name.toLowerCase().includes(normalizedQuery) ||
            bike.type.toLowerCase().includes(normalizedQuery)
        );
        renderBikes(filteredBikes);
        document.getElementById('bikes').scrollIntoView({ behavior: 'smooth' });
    }

    // --- Bike & Cart Functions --- (Minor changes)
    function renderBikes(bikeListToRender = bikes) {
        bikeList.innerHTML = '';
        if (bikeListToRender.length === 0) {
            bikeList.innerHTML = '<p class="text-center text-xl text-gray-500 dark:text-gray-400 col-span-full">No bikes found matching your search.</p>';
        } else {
            bikeListToRender.forEach(bike => {
                const bikeCard = document.createElement('div');
                // The class assignment is now handled by the applyTheme function
                bikeCard.innerHTML = `
                    <img src="${bike.image}" alt="${bike.name}" class="w-full h-56 object-cover" onerror="this.onerror=null;this.src='https://placehold.co/600x400/cccccc/333?text=Image+Unavailable';">
                    <div class="p-6">
                        <h3 class="text-xl font-bold mb-2">${bike.name}</h3>
                        <p class="text-gray-600 mb-4">${bike.type}</p>
                        <div class="flex justify-between items-center">
                            <span class="text-2xl font-bold text-blue-600">₹${bike.price.toLocaleString('en-IN')}</span>
                            <button data-id="${bike.id}" class="add-to-cart-btn bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-4 rounded-lg transition duration-300">
                                <i class="fas fa-cart-plus mr-2"></i>Add to Cart
                            </button>
                        </div>
                    </div>
                `;
                bikeList.appendChild(bikeCard);
            });
        }
        // Re-apply the current theme to style the new bike cards correctly
        applyTheme(themes[currentThemeIndex]);
    }

    function renderCart() {
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            emptyCartMessage.classList.remove('hidden');
        } else {
            emptyCartMessage.classList.add('hidden');
            cart.forEach(item => {
                const cartItemHTML = `
                    <div class="flex justify-between items-center mb-4 p-2 rounded-lg bg-gray-50 cart-item-enter">
                        <div class="flex items-center">
                            <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-md mr-4">
                            <div>
                                <h4 class="font-semibold">${item.name}</h4>
                                <p class="text-gray-500 text-sm">₹${item.price.toLocaleString('en-IN')}</p>
                            </div>
                        </div>
                        <div class="flex items-center">
                            <input type="number" min="1" value="${item.quantity}" data-id="${item.id}" class="quantity-input w-16 text-center border rounded-md mx-2">
                            <button data-id="${item.id}" class="remove-from-cart-btn text-red-500 hover:text-red-700">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
                cartItemsContainer.innerHTML += cartItemHTML;
            });
        }
        updateCartInfo();
        // Re-apply the current theme to style the new cart items correctly
        applyTheme(themes[currentThemeIndex]);
    }

    function updateCartInfo() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        cartCount.textContent = totalItems;
        cartTotal.textContent = `₹${totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    function addToCart(bikeId) {
        const bikeToAdd = bikes.find(b => b.id === bikeId);
        if (!bikeToAdd) return; // Safety check
        const existingItem = cart.find(item => item.id === bikeId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...bikeToAdd, quantity: 1 });
        }
        renderCart();
    }

    function removeFromCart(bikeId) {
        cart = cart.filter(item => item.id !== bikeId);
        renderCart();
    }

    function updateQuantity(bikeId, quantity) {
        const cartItem = cart.find(item => item.id === bikeId);
        if (cartItem) {
            if (quantity > 0) {
                cartItem.quantity = quantity;
            } else {
                removeFromCart(bikeId);
            }
        }
        renderCart();
    }

    function toggleCart() {
        cartModal.classList.toggle('hidden');
    }

    function toggleMobileMenu() {
        mobileMenu.classList.toggle('hidden');
    }

    // --- Event Listeners --- (No changes)
    themeToggleButton.addEventListener('click', toggleTheme);
    bikeList.addEventListener('click', (e) => {
        if (e.target.closest('.add-to-cart-btn')) {
            const button = e.target.closest('.add-to-cart-btn');
            addToCart(parseInt(button.dataset.id));
        }
    });
    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.closest('.remove-from-cart-btn')) {
            const button = e.target.closest('.remove-from-cart-btn');
            removeFromCart(parseInt(button.dataset.id));
        }
    });
    cartItemsContainer.addEventListener('change', (e) => {
        if (e.target.classList.contains('quantity-input')) {
            updateQuantity(parseInt(e.target.dataset.id), parseInt(e.target.value));
        }
    });
    cartButton.addEventListener('click', toggleCart);
    closeCartButton.addEventListener('click', toggleCart);
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            toggleCart();
        }
    });
    mobileMenuButton.addEventListener('click', toggleMobileMenu);

    searchButton.addEventListener('click', () => performSearch(searchInput.value));
    mobileSearchButton.addEventListener('click', () => performSearch(mobileSearchInput.value));
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch(searchInput.value);
    });
    mobileSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch(mobileSearchInput.value);
    });

    // --- Initial Load ---
    function initializeApp() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        currentThemeIndex = themes.indexOf(savedTheme);
        if (currentThemeIndex === -1) {
            currentThemeIndex = 0;
        }
        applyTheme(themes[currentThemeIndex]);

        // Fetch bike data from the backend as soon as the app loads
        fetchBikes();

        renderCart(); // Render cart initially (it will be empty)
    }

    initializeApp();
});