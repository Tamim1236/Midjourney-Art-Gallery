document.addEventListener("DOMContentLoaded", function() {
    const text = "Tamim's Midjourney Art Gallery";
    const typedTextElement = document.getElementById("typed-text");
    let index = 0;

    function type() {
        if (index < text.length) {
            typedTextElement.textContent += text.charAt(index);
            index++;
            setTimeout(type, 100);
        }
    }

    type();
});

document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.getElementById('gallery');
    let data = [];
    let currentIndex = 0;

    function loadImages(){
        fetch('data.json')
            .then(response => response.json())
            .then(jsonData => {
                data = jsonData;
                showImage(currentIndex);
            })
            .catch(error => console.error('Error loading the gallery data:', error));
    }

    function getTopColors(imgElement, numColors = 2) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = imgElement.width;
            canvas.height = imgElement.height;
            context.drawImage(imgElement, 0, 0, canvas.width, canvas.height);
            
            const imageData = context.getImageData(0, 0, canvas.width, 20).data; // Only sample the top 20 pixels
            const colorCounts = {};
    
            for (let i = 0; i < imageData.length; i += 4) {
                const color = `rgb(${imageData[i]},${imageData[i+1]},${imageData[i+2]})`;
                colorCounts[color] = (colorCounts[color] || 0) + 1;
            }
    
            const sortedColors = Object.entries(colorCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, numColors)
                .map(entry => entry[0]);
    
            resolve(sortedColors);
        });
    }

    function updateBackgroundColor(imgElement) {
        getTopColors(imgElement).then(colors => {
            const gradient = `linear-gradient(to right, ${colors.join(', ')})`;
            document.body.style.background = gradient;
            document.querySelector('header').style.background = gradient;
    
            // Make sure the text is readable (use the first color for simplicity)
            const rgb = colors[0].match(/\d+/g);
            const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
            const textColor = brightness > 125 ? 'black' : 'white';
            document.body.style.color = textColor;
            document.querySelector('header').style.color = textColor;
        });
    }

    function showImage(index) {
        if (index >= 0 && index < data.length) {
            const imgContainer = document.createElement('div');
            imgContainer.className = 'image-container';
            
            const caption = document.createElement('p');
            caption.className = 'image-caption';
            caption.textContent = data[index].caption;
            
            const imgWrapper = document.createElement('div');
            imgWrapper.className = 'image-wrapper';
            
            const img = document.createElement('img');
            img.src = `images/${data[index].image}`;
            img.alt = data[index].caption;
            
            img.onload = () => {
                updateBackgroundColor(img);
            };
            
            imgWrapper.appendChild(img);
            imgContainer.appendChild(caption);
            imgContainer.appendChild(imgWrapper);
            gallery.appendChild(imgContainer);


            //make sure the frist image is available immediately
            if(index == 0){
                setTimeout(() => {
                    imgContainer.style.opacity = '1';
                    imgContainer.classList.add('visible');
                    updateBackgroundColor(img);
                },
                1);
            }
                
            // Triggering reflow so the transition works
            imgContainer.offsetHeight;
            imgContainer.style.opacity = '1';
        }
    }

    function handleScroll() {
        const containers = document.querySelectorAll('.image-container');
        let visibleContainer = null;
        
        containers.forEach((container) => {
            const rect = container.getBoundingClientRect();
            if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                container.style.opacity = '1';
                container.classList.add('visible');
                visibleContainer = container;
            } else {
                container.style.opacity = '0';
                container.classList.remove('visible');
            }
        });
    
        if (visibleContainer) {
            updateBackgroundColor(visibleContainer.querySelector('img'));
        }
    
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
            currentIndex++;
            showImage(currentIndex);
        }
    }

    loadImages();
    window.addEventListener('scroll', handleScroll);
});

// 'Scroll to see more' message stuff
document.addEventListener('DOMContentLoaded', () => {
    const scrollMessage = document.querySelector('.scroll-message');
    const scrollIndicator = document.querySelector('.scroll-indicator');

    // Show scroll message
    setTimeout(() => {
        scrollMessage.classList.add('visible');
    }, 1000);

    // Hide scroll message after 5 seconds
    setTimeout(() => {
        scrollMessage.classList.remove('visible');
    }, 6000);

    // Hide scroll indicator and message when scrolling
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            document.body.classList.add('scrolled');
        } else {
            document.body.classList.remove('scrolled');
        }
    });
});