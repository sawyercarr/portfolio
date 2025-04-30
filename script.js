let allImages = []; // Holds all images currently displayed in the gallery
let selectedIndex = -1;

// Fill allImages and gallery based on the selected tab
function populateGallery(category) {
    const imageGrid = document.getElementById('imageGrid');
    imageGrid.innerHTML = ''; 

    // Filter the images based on category (or none)
    allImages.forEach(img => {
        if (category == 'All' || img.dataset.category == category) {
            imageGrid.appendChild(img);
        }
    });
}

// Set an active tab for styling purposes
function setActiveTab(selectedTab) {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    selectedTab.classList.add('active');
}


// Allow the popup to be disabled using the escape key
document.body.addEventListener('keydown', function(e) {
    if (e.key == "Escape") {
        const popup = document.getElementById('popup');
        popup.style.display = 'none';
    }
});


const popup = document.getElementById('popup');
const closePopup = document.getElementById('closePopup');

// When popup close button pressed, return to the gallery and allow images to be clicked
closePopup.addEventListener('click', () => {
    popup.style.display = 'none';
    document.getElementById('Gallery').style.overflowY = 'scroll';
    allImages.forEach(image => {
        image.style.cursor = 'pointer';
    });
});

const prev = document.getElementById('Prev');
const next = document.getElementById('Next');
prev.addEventListener('click', () => {
    selectedIndex = selectedIndex-1;
    newImg = allImages[selectedIndex % allImages.length];
    document.getElementById('popupImg').src = newImg.src;
    document.getElementById('popupText').textContent = newImg.dataset.caption;
});

next.addEventListener('click', () => {
    selectedIndex = selectedIndex+1;
    newImg = allImages[selectedIndex % allImages.length];
    document.getElementById('popupImg').src = newImg.src;
    document.getElementById('popupText').textContent = newImg.dataset.caption;
});

// Initial creation of the gallery
fetch('./images.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();  
    })
    .then(data => {

        const tabsContainer = document.getElementById('tabs');
        const categoriesSet = new Set();
        data.forEach(item => {
            // Create each image
            const img = document.createElement('img');
            img.src = item.src;
            img.dataset.caption = item.caption;
            img.dataset.category = item.category;

            // And allow it to be clickable
            img.addEventListener('click', () => {
                if (document.getElementById('popup').style.display === 'flex') return;

                selectedIndex = allImages.indexOf(img);

                document.getElementById('popupImg').src = img.src;
                document.getElementById('popupText').textContent = img.dataset.caption;
                document.getElementById('Gallery').style.overflowY = 'hidden';
                document.getElementById('popup').style.display = 'flex';

                allImages.forEach(image => {
                    image.style.cursor = 'default';
                });
            });

            allImages.push(img);

            // Then, add its category to the category list
            categoriesSet.add(item.category);
        });

        // Create an all tab that displays all images
        const allTab = document.createElement('div');
        allTab.textContent = 'All';
        allTab.classList.add('tab');
        tabsContainer.appendChild(allTab);
        allTab.addEventListener('click', () => {
            setActiveTab(allTab);
            populateGallery('All');
        });

        // Then a new tab for each of the categories present in the image list
        categoriesSet.forEach(category => {
            const tab = document.createElement('div');
            tab.textContent = category;
            tab.classList.add('tab');
            tab.id = 'tab-' + category;
            tabsContainer.appendChild(tab);

            tab.addEventListener('click', () => {
                setActiveTab(tab);
                populateGallery(category);
            });
        });

        // Also, create a button to toggle dark and light mode
        const toggle = document.createElement('button');
        toggle.textContent = 'Dark Mode';
        toggle.classList.add('tab'); 
        toggle.style.marginLeft = 'auto'; 

        tabsContainer.appendChild(toggle);

        toggle.addEventListener('click', () => {
            document.body.classList.toggle('darkMode');
            if (document.body.classList.contains('darkMode')) {
                toggle.textContent = 'Light Mode';
            } else {
                toggle.textContent = 'Dark Mode';
            }
        });

        populateGallery('All');
    })
    .catch(error => console.error('Failed to fetch data:', error)); 