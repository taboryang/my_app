let draggedWindow = null;
let dragOffset = { x: 0, y: 0 };
let highestZIndex = 100;

const backgrounds = [
    { name: 'Mountain Lake', path: 'images/pexels-bri-schneiter-28802-346529.jpg' },
    { name: 'Forest Path', path: 'images/pexels-philippedonn-1169754.jpg' },
    { name: 'Ocean Waves', path: 'images/pexels-pixabay-220182.jpg' },
    { name: 'Abstract Art', path: 'images/pexels-pixabay-268533.jpg' },
    { name: 'City Lights', path: 'images/pexels-simon73-1323550.jpg' }
];

let currentBackgroundIndex = 0;

document.addEventListener('DOMContentLoaded', function() {
    const appButtons = document.querySelectorAll('.app-button');
    const bgPrev = document.getElementById('bg-prev');
    const bgNext = document.getElementById('bg-next');
    const bgName = document.getElementById('bg-name');
    
    setBackground(backgrounds[currentBackgroundIndex].path);
    
    appButtons.forEach(button => {
        button.addEventListener('click', function() {
            const appName = this.getAttribute('data-app');
            openWindow(appName + '-window');
        });
    });
    
    bgPrev.addEventListener('click', function() {
        currentBackgroundIndex = (currentBackgroundIndex - 1 + backgrounds.length) % backgrounds.length;
        updateBackground();
    });
    
    bgNext.addEventListener('click', function() {
        currentBackgroundIndex = (currentBackgroundIndex + 1) % backgrounds.length;
        updateBackground();
    });
    
    setupWindowDragging();
});

function updateBackground() {
    const current = backgrounds[currentBackgroundIndex];
    setBackground(current.path);
    document.getElementById('bg-name').textContent = current.name;
}

function setBackground(imageUrl) {
    const desktop = document.getElementById('desktop');
    desktop.style.backgroundImage = `url(${imageUrl})`;
    desktop.style.backgroundSize = 'cover';
    desktop.style.backgroundPosition = 'center';
    desktop.style.backgroundRepeat = 'no-repeat';
}

function openWindow(windowId) {
    const window = document.getElementById(windowId);
    if (window) {
        window.style.display = 'block';
        bringToFront(window);
        
        const randomOffset = Math.floor(Math.random() * 50);
        const rect = window.getBoundingClientRect();
        window.style.left = (rect.left + randomOffset) + 'px';
        window.style.top = (rect.top + randomOffset) + 'px';
    }
}

function closeWindow(windowId) {
    const window = document.getElementById(windowId);
    if (window) {
        window.style.display = 'none';
    }
}

function bringToFront(window) {
    highestZIndex++;
    window.style.zIndex = highestZIndex;
}

function setupWindowDragging() {
    const windows = document.querySelectorAll('.window');
    
    windows.forEach(window => {
        const header = window.querySelector('.window-header');
        
        header.addEventListener('mousedown', function(e) {
            if (e.target.classList.contains('close-btn')) return;
            
            draggedWindow = window;
            bringToFront(window);
            window.classList.add('dragging');
            
            const rect = window.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;
            
            e.preventDefault();
        });
    });
    
    document.addEventListener('mousemove', function(e) {
        if (draggedWindow) {
            const newX = e.clientX - dragOffset.x;
            const newY = e.clientY - dragOffset.y;
            
            const maxX = window.innerWidth - draggedWindow.offsetWidth;
            const maxY = window.innerHeight - draggedWindow.offsetHeight;
            
            const constrainedX = Math.max(0, Math.min(newX, maxX));
            const constrainedY = Math.max(0, Math.min(newY, maxY));
            
            draggedWindow.style.left = constrainedX + 'px';
            draggedWindow.style.top = constrainedY + 'px';
        }
    });
    
    document.addEventListener('mouseup', function() {
        if (draggedWindow) {
            draggedWindow.classList.remove('dragging');
            draggedWindow = null;
        }
    });
}

document.addEventListener('click', function(e) {
    const window = e.target.closest('.window');
    if (window) {
        bringToFront(window);
    }
});

window.addEventListener('resize', function() {
    const windows = document.querySelectorAll('.window');
    windows.forEach(window => {
        if (window.style.display !== 'none') {
            const rect = window.getBoundingClientRect();
            if (rect.right > window.innerWidth) {
                window.style.left = (window.innerWidth - window.offsetWidth) + 'px';
            }
            if (rect.bottom > window.innerHeight) {
                window.style.top = (window.innerHeight - window.offsetHeight) + 'px';
            }
        }
    });
});