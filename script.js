/*--------------------
Vars
--------------------*/
let progress = 0;
let startX = 0;
let active = 0;
let isDown = false;
let audioPlaying = false; // Variable to track audio state

/*--------------------
Constants
--------------------*/
const speedWheel = 0.02;
const speedDrag = -0.1;

/*--------------------
Get Z
--------------------*/
const getZindex = (array, index) =>
    array.map((_, i) => (index === i ? array.length : array.length - Math.abs(index - i)));

/*--------------------
Items
--------------------*/
const $items = document.querySelectorAll('.carousel-item');
const $cursors = document.querySelectorAll('.cursor');
const $arrow = document.getElementById('curved-arrow'); // Get arrow element

const displayItems = (item, index, active) => {
    const zIndex = getZindex([...$items], active)[index];
    item.style.setProperty('--zIndex', zIndex);
    item.style.setProperty('--active', (index - active) / $items.length);
};

/*--------------------
Animate
--------------------*/
const animate = () => {
    progress = Math.max(0, Math.min(progress, 100));
    active = Math.floor((progress / 100) * ($items.length - 1));

    $items.forEach((item, index) => displayItems(item, index, active));
};
animate();

/*--------------------
Click on Items
--------------------*/
$items.forEach((item, i) => {
    item.addEventListener('click', () => {
        // If it's the last item, stop the audio and redirect
        if (i === $items.length - 1) {
            toggleAudio(); // Stop the music
            window.open("https://www.youtube.com/watch?v=gPpQNzQP6gE", "_blank"); // Open the link
        } else {
            progress = (i / $items.length) * 100 + 10;
            animate();
        }
    });
});

/*--------------------
Handlers
--------------------*/
const handleWheel = (e) => {
    const wheelProgress = e.deltaY * speedWheel;
    progress += wheelProgress;
    animate();
};

const handleMouseMove = (e) => {
    if (e.type === 'mousemove') {
        $cursors.forEach(($cursor) => {
            $cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        });
    }
    if (!isDown) return;
    const x = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const mouseProgress = (x - startX) * speedDrag;
    progress += mouseProgress;
    startX = x;
    animate();
};

const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
        // Move to the next item
        progress += 100 / $items.length;
        animate();
    } else if (e.key === 'ArrowLeft') {
        // Move to the previous item
        progress -= 100 / $items.length;
        animate();
    }
};

const handleMouseDown = (e) => {
    isDown = true;
    startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
};

const handleMouseUp = () => {
    isDown = false;
};

/*--------------------
Audio Toggle
--------------------*/
function toggleAudio() {
    const audio = document.getElementById('background-audio');
    const button = document.getElementById('audio-control-btn');

    if (audioPlaying) {
        // Pause the audio
        audio.pause();
        button.innerText = 'Play Background Music'; // Update button text
        audioPlaying = false; // Update state to not playing
        $arrow.style.display = 'block'; // Show the arrow again when music pauses
    } else {
        // Play the audio
        audio.play().then(() => {
            button.innerText = 'Pause Background Music'; // Update button text
            audioPlaying = true; // Update state to playing
            $arrow.style.display = 'none'; // Hide the arrow when music plays
        }).catch((error) => {
            console.error('Error playing audio:', error);
        });
    }
}

// Play audio on page load if desired
window.onload = () => {
    const audio = document.getElementById('background-audio');
    audio.load();
};

/*--------------------
Listeners
--------------------*/
document.addEventListener('mousewheel', handleWheel);
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('mousedown', handleMouseDown);
document.addEventListener('mousemove', handleMouseMove);
document.addEventListener('mouseup', handleMouseUp);
document.addEventListener('touchstart', handleMouseDown);
document.addEventListener('touchmove', handleMouseMove);
document.addEventListener('touchend', handleMouseUp);
