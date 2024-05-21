document.addEventListener("DOMContentLoaded", () => {
    const downloadButton = document.getElementById("downloadButton");
    const webpToPngText = document.getElementById("webpToPngText");
    const formatSelect = document.getElementById("formatSelect");
    const fileInput = document.getElementById("fileInput");
    const cancelButton = document.getElementById("cancelButton");

    downloadButton.disabled = true;
    webpToPngText.classList.add("disabledText");

    fileInput.addEventListener("change", handleFileSelection);
    downloadButton.addEventListener("click", downloadConvertedVideos);
    cancelButton.addEventListener("click", cancelConversion);

    let convertedBlobs = [];
    const supportedFormats = ['MP4', 'MOV', 'WMV'];
    let currentFormatIndex = 0;

    function changeFormatText() {
        const nextFormatIndex = (currentFormatIndex + 1) % supportedFormats.length;
        const currentFormat = supportedFormats[currentFormatIndex];
        const nextFormat = supportedFormats[nextFormatIndex];
        const darkModePreference = localStorage.getItem('darkMode');
        const isDarkMode = darkModePreference === 'dark';
        const isLightMode = darkModePreference === 'light';
        webpToPngText.classList.toggle("dark-mode-text", isDarkMode);
        webpToPngText.classList.add("erase");
        setTimeout(() => {
            webpToPngText.innerHTML = `<span class="currentFormat">${nextFormat.toUpperCase()}</span> to ${formatSelect.value.toUpperCase()}`;
            setTimeout(() => {
                webpToPngText.classList.remove("erase");
                webpToPngText.classList.add("type");
                if (isDarkMode) webpToPngText.classList.add("dark-mode-text");
                setTimeout(() => {
                    webpToPngText.classList.remove("type");
                    if (isLightMode) setTimeout(() => webpToPngText.classList.remove("dark-mode-text"), 0);
                    currentFormatIndex = nextFormatIndex;
                }, 500);
            }, 10);
        }, 500);
    }

    setInterval(changeFormatText, 4000);

    const logoContainer = document.getElementById("logo-container");
    const whitelogoContainer = document.getElementById("whitelogo-container");
    const darkIcon = document.getElementById('dark');
    const lightIcon = document.getElementById('light');
    const darkModePreference = localStorage.getItem('darkMode');
    darkModePreference === 'dark' ? applyDarkMode() : applyLightMode();

    logoContainer.addEventListener("mouseenter", () => {
        logo2.style.display = "block";
        wlogo2.style.display = "none";
    });
    logoContainer.addEventListener("mouseleave", () => logo2.style.display = "none");
    whitelogoContainer.addEventListener("mouseenter", () => {
        wlogo2.style.display = "block";
        logo2.style.display = "none";
    });
    whitelogoContainer.addEventListener("mouseleave", () => wlogo2.style.display = "none");

    darkIcon.addEventListener('click', applyDarkMode);
    lightIcon.addEventListener('click', applyLightMode);

    function applyDarkMode() {
        console.log("Darkmode Activated");
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
        whitelogoContainer.style.display = 'block';
        logoContainer.style.display = 'none';
        webpToPngText.classList.add("dark-mode-text");
        localStorage.setItem('darkMode', 'dark');
        toggleIconVisibility();
    }

    function applyLightMode() {
        console.log("Lightmode Activated");
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
        whitelogoContainer.style.display = 'none';
        logoContainer.style.display = 'block';
        webpToPngText.classList.remove("dark-mode-text");
        localStorage.setItem('darkMode', 'light');
        toggleIconVisibility();
    }

    function toggleIconVisibility() {
        darkIcon.style.display = document.body.classList.contains('dark-mode') ? 'none' : 'inline-block';
        lightIcon.style.display = document.body.classList.contains('dark-mode') ? 'inline-block' : 'none';
    }

    function cancelConversion(event) {
        event.preventDefault();
        resetFileInputAndOutput();
        updateButtonLabel(null);
        downloadButton.disabled = true;
    }

    function updateButtonLabel(files) {
        const fileLabel = document.getElementById("fileLabel");
        if (files) {
            fileLabel.textContent = "Cancel";
            cancelButton.style.display = "inline-block";
            fileLabel.style.display = "none";
        } else {
            fileLabel.textContent = "Choose File";
            cancelButton.style.display = "none";
            fileLabel.style.display = "inline-block";
        }
    }

    async function handleFileSelection() {
        downloadButton.disabled = true;
        webpToPngText.classList.add("disabledText");
        webpToPngText.style.display = "none";
        const files = Array.from(fileInput.files);
        if (!files.length) {
            alert("Please select valid files.");
            resetFileInputAndOutput();
            updateButtonLabel(null);
            return;
        }
        convertedBlobs = [];
        const startTime = performance.now();
        await convertVideos(files);
        const endTime = performance.now();
        const conversionTime = endTime - startTime;
        webpToPngText.classList.add("display-text");
        console.log(`Conversion took ${conversionTime.toFixed(2)} milliseconds`);
        webpToPngText.innerHTML = `Conversion took ${conversionTime.toFixed(2)} milliseconds`;
        downloadButton.disabled = false;
        webpToPngText.style.display = "block";
        updateButtonLabel(files);
    }

    async function convertVideos(files) {
        for (let file of files) {
            const convertedBlob = await simulateConversion(file);
            convertedBlobs.push(convertedBlob);
        }
    }

    function simulateConversion(file) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(new Blob([file], { type: `video/${formatSelect.value.toLowerCase()}` }));
            }, 2000);
        });
    }

    function resetFileInputAndOutput() {
        fileInput.value = "";
    }

    async function downloadConvertedVideos() {
        console.log("Downloading converted video...");
        if (convertedBlobs.length === 1) {
        // If only one file, download directly without zip
        const blob = convertedBlobs[0];
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `converted_video_1.${formatSelect.value.toLowerCase()}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        return;
    }
        if (convertedBlobs.length > 1) {
            try {
                console.log("Downloading converted videos...");
                const savedOutputName = localStorage.getItem('savedOutputName');
                const fileExtension = formatSelect.value.toLowerCase();
                const zip = new JSZip();

                convertedBlobs.forEach((blob, index) => {
                    const baseFileName = savedOutputName ? `${savedOutputName}_${index + 1}` : `converted_video_${index + 1}`;
                    const finalFileName = `${baseFileName}.${fileExtension}`;
                    zip.file(finalFileName, blob);
                });

                const zipBlob = await zip.generateAsync({ type: "blob" });
                const downloadLink = document.createElement("a");
                const zipFileName = savedOutputName ? `${savedOutputName}.zip` : "converted_videos.zip";
                downloadLink.href = URL.createObjectURL(zipBlob);
                downloadLink.download = zipFileName;
                downloadLink.click();
                URL.revokeObjectURL(downloadLink.href);
                webpToPngText.classList.add("display-text");
                webpToPngText.innerHTML = `Files Saved`;
            } catch (error) {
                console.error("Error during ZIP download:", error);
                alert("Error during ZIP download. Please try again.");
            }
        } else {
            console.error("No converted blobs found.");
            alert("No converted videos found. Please convert some videos first.");
        }
    }
});
