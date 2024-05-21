document.addEventListener('DOMContentLoaded', function () {
    // Check if there is a saved output name in local storage
    var savedOutputName = localStorage.getItem('savedOutputName');
    if (savedOutputName) {
        // If there is, set the value of the outputNameInput field
        var outputNameInput = document.getElementById('outputName');
        outputNameInput.value = savedOutputName;
        // Update the placeholder to the saved output name
        outputNameInput.placeholder = savedOutputName;

        // Check if there is a saved outline box state
        var isOutlineBoxSaved = localStorage.getItem('isOutlineBoxSaved');
        if (isOutlineBoxSaved) {
            // If saved, add outline-box class to the outputName element
            outputNameInput.classList.add('outline-box');
        }
    }
    
    // Apply Dark Mode or Light Mode based on user preference
    const darkModePreference = localStorage.getItem('darkMode');

    if (darkModePreference === 'dark') {
        applyDarkMode();
    } else {
        applyLightMode();
    }
	function applyDarkMode() {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');

        // Update text color for buttons (adjust as needed)
        document.querySelectorAll('input[type="submit"]').forEach(function(button) {
            button.style.color = '#8A2BE2';
        });
    }

    // Function to apply Light Mode
    function applyLightMode() {
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');

        // Update text color for buttons (adjust as needed)
        document.querySelectorAll('input[type="submit"]').forEach(function(button) {
            button.style.color = 'black';
        });
    }

    // Add an event listener for the form submission
    document.getElementById('settingsForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission behavior

        // Get the values from the form
        var outputNameInput = document.getElementById('outputName');
        var outputName = outputNameInput.value;

        // Temporarily change the text to "Saved!"
        outputNameInput.textContent = 'Output Name: Saved!';

        // Save the output name
        updateAndSaveOutputName(outputName);

        // Add outline-box class to the outputName element
        outputNameInput.classList.add('outline-box');

        // Save the outline box state
        localStorage.setItem('isOutlineBoxSaved', 'true');

        // Reset the form or perform other actions as needed
        // document.getElementById('settingsForm').reset();

        // Set a timeout to revert the text after approximately 2 seconds
        setTimeout(function () {
            outputNameInput.textContent = 'Output Name:';
        }, 2000);

        // Change the label text temporarily
        var outputNameLabel = document.querySelector('label[for="outputName"]');
        outputNameLabel.textContent = 'Output Name: Saved ✓';

        // Set a timeout to revert the label text after approximately 2 seconds
        setTimeout(function () {
            outputNameLabel.textContent = 'Output Name:';
        }, 2000);
    });

    // Function to update and save the output name to local storage
    function updateAndSaveOutputName(outputName) {
        // Process the output name as needed (you can add your logic here)
        console.log('Output Name:', outputName);
        // Save the output name
        localStorage.setItem('savedOutputName', outputName);
    }

    // Function to update and save the resolution to local storage
    function updateAndSaveResolution(resolution) {
        // Process the resolution as needed (you can add your logic here)
        console.log('Resolution:', resolution);
        // Save the resolution
        localStorage.setItem('savedResolution', resolution);
    }
});
