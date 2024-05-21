// Warning: Developer hotkeys are for development purposes only. 
// Using them for other purposes may cause unintended behavior.
// Dev Mode ONLY
let adPanelsVisible = true;

// Add event listener for keydown event
document.addEventListener("keydown", function(event) {
    // Check if left Shift and G are pressed simultaneously
    if (event.shiftKey && event.key === 'G') {
        // Toggle ad panel visibility
        toggleAdPanels();
    }

    // Check if left Shift and H are pressed simultaneously
    if (event.shiftKey && event.key === 'H') {
        // Refresh the page
        location.reload();
    }

    // Check if left Shift and P are pressed simultaneously
    if (event.shiftKey && event.key === 'P') {
        // Toggle console visibility
        toggleConsole();
    }
});

function toggleAdPanels() {
    // Get all ad panels
    const adPanels = document.querySelectorAll('.ad-panel-left, .ad-panel-right');

    // Toggle visibility
    adPanels.forEach(function(panel) {
        panel.style.visibility = adPanelsVisible ? 'hidden' : 'visible';
    });

    // Update visibility state
    adPanelsVisible = !adPanelsVisible;
}

// Function to toggle the visibility of the console
// Leave this
function toggleConsole() {
  const consoleElement = document.getElementById('console');
  if (consoleElement.style.display === 'none' || consoleElement.style.display === '') {
    consoleElement.style.position = 'fixed'; // Ensure it stays in the same position when scrolling
    consoleElement.style.display = 'block';
  } else {
    consoleElement.style.display = 'none';
  }
}
