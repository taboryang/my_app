let draggedWindow = null;
let dragOffset = { x: 0, y: 0 };
let highestZIndex = 100;

const musicTracks = [
    { title: 'Chill Beats', artist: 'Retro Vibes', src: 'music/sample-song-1.mp3', duration: '3:24' },
    { title: 'Synthwave Dreams', artist: 'Digital Era', src: 'music/sample-song-2.mp3', duration: '4:12' },
    { title: 'Pixel Paradise', artist: '8-Bit Master', src: 'music/sample-song-3.mp3', duration: '2:56' },
    { title: 'Neon Nights', artist: 'Cyber Groove', src: 'music/sample-song-4.mp3', duration: '3:45' },
    { title: 'Electric Dreams', artist: 'Future Sound', src: 'music/sample-song-5.mp3', duration: '4:33' },
    { title: 'Digital Sunrise', artist: 'Techno Waves', src: 'music/sample-song-6.mp3', duration: '3:18' }
];

let currentTrackIndex = 0;
let isPlaying = false;
let audioPlayer = null;

let audioContext = null;

function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
}

function generateSound(type, frequency = 440, duration = 0.2, volume = 0.1) {
    const ctx = initAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
    
    return oscillator;
}

function generateChord(frequencies, duration = 0.3, volume = 0.05) {
    frequencies.forEach((freq, index) => {
        setTimeout(() => {
            generateSound('sine', freq, duration * 0.8, volume);
        }, index * 50);
    });
}

const soundEffects = {
    youtube: () => generateChord([523.25, 659.25, 783.99], 0.4, 0.06), // C-E-G major chord (video/play feel)
    ipod: () => generateChord([440, 554.37, 659.25], 0.3, 0.05),      // A-C#-E major chord (musical)
    notepad: () => generateSound('triangle', 800, 0.15, 0.08),        // High triangle wave (paper/pen)
    home: () => generateChord([261.63, 329.63, 392], 0.5, 0.04),     // C-E-G lower octave (welcoming)
    windowClose: () => generateSound('sawtooth', 220, 0.2, 0.06),    // Low sawtooth (closing)
    buttonHover: () => generateSound('sine', 1000, 0.1, 0.03)        // Quick high sine (subtle hover)
};

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
            
            if (appName === 'app2') {
                initializeAudioPlayer();
            }
            
            if (appName === 'app3') {
                initializeNotepad();
            }
            
            if (appName === 'home') {
                // Home button just opens the home window - no special initialization needed
            }
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
    setupAudioControls();
    setupButtonSounds();
    
    // Enable audio on first user interaction
    document.addEventListener('click', function enableAudio() {
        initAudioContext();
        document.removeEventListener('click', enableAudio);
    });
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
        // Play specific sound for each app
        if (windowId === 'youtube-window') {
            playSound('youtube');
        } else if (windowId === 'app2-window') {
            playSound('ipod');
        } else if (windowId === 'app3-window') {
            playSound('notepad');
        } else if (windowId === 'home-window') {
            playSound('home');
        }
        
        window.style.display = 'block';
        bringToFront(window);
        
        const randomOffset = Math.floor(Math.random() * 50);
        const rect = window.getBoundingClientRect();
        window.style.left = (rect.left + randomOffset) + 'px';
        window.style.top = (rect.top + randomOffset) + 'px';
        
        window.style.transform = 'scale(0.8)';
        window.style.opacity = '0';
        window.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
        
        setTimeout(() => {
            window.style.transform = 'scale(1)';
            window.style.opacity = '1';
        }, 10);
    }
}

function closeWindow(windowId) {
    const window = document.getElementById(windowId);
    if (window) {
        playSound('windowClose');
        
        window.style.transition = 'all 0.2s ease-out';
        window.style.transform = 'scale(0.8)';
        window.style.opacity = '0';
        
        setTimeout(() => {
            window.style.display = 'none';
            window.style.transform = 'scale(1)';
            window.style.opacity = '1';
            window.style.transition = '';
        }, 200);
        
        if (windowId === 'app2-window' && audioPlayer && isPlaying) {
            audioPlayer.pause();
            isPlaying = false;
            const centerButton = document.querySelector('.center-button');
            if (centerButton) centerButton.textContent = '▶️';
            pauseVisualizer();
        }
        
        if (windowId === 'youtube-window') {
            const iframe = window.querySelector('iframe');
            if (iframe) {
                const src = iframe.src;
                iframe.src = '';
                iframe.src = src;
            }
        }
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

function setupAudioControls() {
    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.querySelector('.wheel-prev');
    const nextBtn = document.querySelector('.wheel-next');
    
    if (playBtn) {
        playBtn.addEventListener('click', togglePlay);
    }
    if (prevBtn) {
        prevBtn.addEventListener('click', previousTrack);
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', nextTrack);
    }
}

function initializeAudioPlayer() {
    audioPlayer = document.getElementById('audio-player');
    if (!audioPlayer) return;
    
    loadTrack(currentTrackIndex);
    
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', nextTrack);
    audioPlayer.addEventListener('loadedmetadata', function() {
        const totalTime = document.getElementById('total-time');
        if (totalTime && audioPlayer.duration) {
            totalTime.textContent = formatTime(audioPlayer.duration);
        }
    });
    
    setTimeout(() => {
        togglePlay();
    }, 500);
}

function loadTrack(index) {
    const track = musicTracks[index];
    const songTitle = document.getElementById('song-title');
    const songArtist = document.getElementById('song-artist');
    const totalTime = document.getElementById('total-time');
    
    if (songTitle) songTitle.textContent = track.title;
    if (songArtist) songArtist.textContent = track.artist;
    if (totalTime) totalTime.textContent = track.duration;
    
    if (audioPlayer) {
        audioPlayer.src = track.src;
        audioPlayer.load();
    }
}

function togglePlay() {
    if (!audioPlayer) return;
    
    const centerButton = document.querySelector('.center-button');
    
    if (isPlaying) {
        audioPlayer.pause();
        centerButton.textContent = '▶️';
        pauseVisualizer();
    } else {
        audioPlayer.play().catch(() => {
            console.log('Audio playback failed - using demo mode');
            startDemoMode();
        });
        centerButton.textContent = '⏸️';
        startVisualizer();
    }
    isPlaying = !isPlaying;
}

function previousTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + musicTracks.length) % musicTracks.length;
    loadTrack(currentTrackIndex);
    if (isPlaying && audioPlayer) {
        audioPlayer.play().catch(() => startDemoMode());
    }
}

function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % musicTracks.length;
    loadTrack(currentTrackIndex);
    if (isPlaying && audioPlayer) {
        audioPlayer.play().catch(() => startDemoMode());
    }
}

function updateProgress() {
    if (!audioPlayer) return;
    
    const currentTime = document.getElementById('current-time');
    const progressFill = document.getElementById('progress-fill');
    const miniProgressFill = document.querySelector('.mini-progress-fill');
    
    if (currentTime) {
        currentTime.textContent = formatTime(audioPlayer.currentTime);
    }
    
    if (audioPlayer.duration) {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        
        if (progressFill) {
            progressFill.style.width = progress + '%';
        }
        
        if (miniProgressFill) {
            miniProgressFill.style.width = progress + '%';
        }
    }
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function startVisualizer() {
    const visDots = document.querySelectorAll('.vis-dot');
    visDots.forEach(dot => {
        dot.style.animationPlayState = 'running';
    });
}

function pauseVisualizer() {
    const visDots = document.querySelectorAll('.vis-dot');
    visDots.forEach(dot => {
        dot.style.animationPlayState = 'paused';
    });
}

function startDemoMode() {
    let demoTime = 0;
    const demoInterval = setInterval(() => {
        if (!isPlaying) {
            clearInterval(demoInterval);
            return;
        }
        
        demoTime += 0.1;
        const currentTime = document.getElementById('current-time');
        const progressFill = document.getElementById('progress-fill');
        const totalDuration = 204; // 3:24 in seconds
        
        if (currentTime) {
            currentTime.textContent = formatTime(demoTime);
        }
        
        if (progressFill) {
            const progress = (demoTime / totalDuration) * 100;
            progressFill.style.width = Math.min(progress, 100) + '%';
        }
        
        if (demoTime >= totalDuration) {
            nextTrack();
            demoTime = 0;
        }
    }, 100);
}

function initializeNotepad() {
    const notepadText = document.getElementById('notepad-text');
    if (!notepadText) return;
    
    const savedNote = localStorage.getItem('stickyNote');
    if (savedNote) {
        notepadText.value = savedNote;
    }
    
    notepadText.addEventListener('input', function() {
        localStorage.setItem('stickyNote', this.value);
    });
    
    notepadText.focus();
}

function playSound(soundName) {
    try {
        // Handle generated sounds (functions)
        if (typeof soundEffects[soundName] === 'function') {
            soundEffects[soundName]();
            return;
        }
        
        // Handle traditional audio files (if they exist)
        const sound = soundEffects[soundName];
        if (sound && sound.play) {
            sound.currentTime = 0;
            sound.play().catch(e => {
                console.log(`Audio playback blocked or failed: ${soundName}`);
            });
        }
    } catch (error) {
        console.log(`Sound effect error: ${soundName}`, error);
    }
}

function setupButtonSounds() {
    const buttons = document.querySelectorAll('.app-button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            playSound('buttonHover');
        });
    });
    
    const homeCards = document.querySelectorAll('.home-card');
    homeCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            playSound('buttonHover');
        });
    });
}