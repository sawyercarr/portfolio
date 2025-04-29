let allImages = [];

    function populateGallery(category) {
        const imageGrid = document.getElementById('imageGrid');
        imageGrid.innerHTML = ''; 

        allImages.forEach(img => {
            if (category == 'All' || img.dataset.category == category) {
                imageGrid.appendChild(img);
            }
        });
    }

    function setActiveTab(selectedTab) {
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
        });
        selectedTab.classList.add('active');
    }


    document.body.addEventListener('keydown', function(e) {
        if (e.key == "Escape") {
            const popup = document.getElementById('popup');
            popup.style.display = 'none';
        }
    });


    const popup = document.getElementById('popup');
    const closePopup = document.getElementById('closePopup');

    closePopup.addEventListener('click', () => {
        popup.style.display = 'none';
        document.getElementById('Gallery').style.overflowY = 'scroll';
        allImages.forEach(image => {
            image.style.cursor = 'pointer';
        });
    });

    fetch('./images.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();  
        })
        .then(data => {

            const imageGrid = document.getElementById('imageGrid');
            const tabsContainer = document.getElementById('tabs');
            const categoriesSet = new Set();
            data.forEach(item => {
                const img = document.createElement('img');
                img.src = item.src;
                img.dataset.caption = item.caption;
                img.dataset.category = item.category;

                img.addEventListener('click', () => {
                    if (document.getElementById('popup').style.display === 'flex') return;

                    document.getElementById('popupImg').src = img.src;
                    document.getElementById('popupText').textContent = img.dataset.caption;
                    document.getElementById('Gallery').style.overflowY = 'hidden';
                    document.getElementById('popup').style.display = 'flex';

                    allImages.forEach(image => {
                        image.style.cursor = 'default';
                    });
                });

                allImages.push(img);

                categoriesSet.add(item.category);
            });

            const allTab = document.createElement('div');
            allTab.textContent = 'All';
            allTab.classList.add('tab');
            tabsContainer.appendChild(allTab);
            allTab.addEventListener('click', () => {
                setActiveTab(allTab);
                populateGallery('All');
            });

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