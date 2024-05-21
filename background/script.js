document.addEventListener("DOMContentLoaded", () => {
    const downloadButton = document.getElementById("downloadButton");
    const webpToPngText = document.getElementById("webpToPngText");
    const formatSelect = document.getElementById("formatSelect");
    const fileInput = document.getElementById("fileInput");
    const outputImage = document.getElementById("outputImage");
    const cancelButton = document.getElementById("cancelButton");
    downloadButton.disabled = true;
    webpToPngText.classList.add("disabledText");
    fileInput.addEventListener("change", handleFileSelection);
    downloadButton.addEventListener("click", downloadConvertedImage);
    cancelButton.addEventListener("click", cancelConversion);
    let convertedBlobs = [];
    const supportedFormats = ['AVIF', 'SVG', 'PDF'];
    let currentFormatIndex = 0;
    function changeFormatText() {
        const nextFormatIndex = (currentFormatIndex + 1) % supportedFormats.length;
        const currentFormat = supportedFormats[currentFormatIndex];
        const nextFormat = supportedFormats[nextFormatIndex];
        const darkModePreference = localStorage.getItem('darkMode');
        const isDarkMode = darkModePreference === 'dark';
        const isLightMode = darkModePreference === 'light-mode';
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
    const wlogo2 = document.getElementById("wlogo2");
    const wlogo = document.getElementById("wlogo");
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
		const imageContainer = document.getElementById("image-container");
		imageContainer.style.display = "none";
		imageContainer.innerHTML = ""; // Clear the content
    }
    function updateButtonLabel(file) {
        if (file) {
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
        alert("Please select valid files (WebP, AVIF, SVG, or PDF).");
        resetFileInputAndOutput();
        updateButtonLabel(null);
        return;
    }
    convertedBlobs = [];
    try {
        const startTime = performance.now();
        for (const file of files) {
            let blob;
            if (file.type === "image/svg+xml") {
                const svgData = await readFileAsText(file);
                blob = await convertToPNGFromSVG(svgData);
            } else {
                const dataURL = await readFileAsDataURL(file);
                const convertedData = file.type === "application/pdf" ? await renderPDF(await pdfjsLib.getDocument({ data: await readFileAsArrayBuffer(file) }).promise) : await convertToPNG(dataURL);
                blob = new Blob([convertedData], { type: "image/png" });
            }
            convertedBlobs.push({ name: file.name.replace(/\.[^/.]+$/, ".png"), blob });
        }
        displayConvertedImage(); // Display the converted images
        downloadButton.disabled = false;
        webpToPngText.style.display = "block";

        const endTime = performance.now();
        const conversionTime = endTime - startTime;
        webpToPngText.classList.add("display-text");
		console.log(`Conversion took ${conversionTime.toFixed(2)} milliseconds`);
        webpToPngText.innerHTML = `Conversion took ${conversionTime.toFixed(2)} milliseconds`;
    } catch (error) {
        console.error("Conversion failed:", error);
        alert("Conversion failed. Please try again.");
        resetFileInputAndOutput();
    }
    updateButtonLabel(files.length ? files[0] : null);
}
    async function renderPDF(pdfDocument) {
        try {
            const firstPage = await pdfDocument.getPage(1);
            const viewport = firstPage.getViewport({ scale: 1.5 });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            await firstPage.render({ canvasContext: context, viewport: viewport }).promise;
            return new Promise(resolve => {
                canvas.toBlob(resolve, 'image/png');
            });
        } catch (error) {
            console.error('PDF rendering failed:', error);
            throw error;
        }
    }
    function readFileAsArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }
    function displayConvertedImage() {
    console.log("Displaying converted images...");
    const imageContainer = document.getElementById("image-container");
    imageContainer.innerHTML = ""; // Clear the container before adding images
    // Loop through each converted blob and create an image element for each
    let rowDiv; // Variable to hold the current row div
    convertedBlobs.forEach(({ name, blob }, index) => {
        if (index % 4 === 0) {
            // Create a new row div for every fourth image
            rowDiv = document.createElement("div");
            rowDiv.classList.add("image-row");
            imageContainer.appendChild(rowDiv);
        }
        const image = document.createElement("img");
        image.src = URL.createObjectURL(blob);
        image.alt = name;
        image.style.maxWidth = "150px"; // Limit maximum width
        image.style.maxHeight = "150px"; // Limit maximum height
        image.style.objectFit = "contain"; // Maintain aspect ratio within the container
        image.style.margin = "5px"; // Add some margin for spacing
	
        // Append the image to the current row div
		image.addEventListener("click", () => openImageViewer(URL.createObjectURL(blob)));
		image.addEventListener("mouseenter", () => {
            image.style.transition = "transform 0.3s ease-in-out"; // Add smooth transition
            image.style.transform = "scale(1.2)"; // Scale up the image
        });
        // Revert scaling transformation on mouse leave
        image.addEventListener("mouseleave", () => {
            image.style.transition = "transform 0.3s ease-in-out"; // Add smooth transition
            image.style.transform = "scale(1)"; // Scale back to normal size
        });
        rowDiv.appendChild(image);
    });
    // Display the container after adding images
    imageContainer.style.display = "block";
    // Center the image if there's only one
    if (convertedBlobs.length === 1) {
        const singleImage = imageContainer.querySelector("img");
        singleImage.style.margin = "auto"; // Center the image horizontally
        singleImage.style.display = "block"; // Ensure it takes up full width
    }
}
    function openImageViewer(imageUrl) {
    console.log("Opening Image Viewer");
    const viewerWindow = window.open(imageUrl, "_blank");
    if (!viewerWindow || viewerWindow.closed || typeof viewerWindow.closed === "undefined") {
        alert("Popup blocked. Please allow popups for this site to view the image.");
		}
    }
    function resetFileInputAndOutput() {
        fileInput.value = "";
        outputImage.style.display = "none";
    }
    async function readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }
    async function readFileAsDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
    async function convertToPNGFromSVG(svgData) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = function () {
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                context.drawImage(img, 0, 0);
                canvas.toBlob(resolve, 'image/png', 1);
            };
            img.onerror = function (error) {
                reject(error);
            };
            img.src = `data:image/svg+xml,${encodeURIComponent(svgData)}`;
        });
    }
    async function convertToPNG(dataURL) {
        const response = await fetch(dataURL);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = function () {
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                context.drawImage(img, 0, 0);
                canvas.toBlob(resolve, 'image/png', 1);
            };
            img.onerror = function (error) {
                reject(error);
            };
            img.src = URL.createObjectURL(blob);
        });
    }
    async function downloadConvertedImage() {
    console.log("Downloading converted images...");
    if (convertedBlobs.length > 1) {
    try {
        const savedOutputName = localStorage.getItem('savedOutputName');
        const fileExtension = formatSelect.value.toLowerCase();
        const zip = new JSZip();

        convertedBlobs.forEach(({ blob }, index) => {
            const baseFileName = savedOutputName ? `${savedOutputName}_${index + 1}` : `converted_image_${index + 1}`;
            const finalFileName = `${baseFileName}.${fileExtension}`;
            zip.file(finalFileName, blob);
        });

        const zipBlob = await zip.generateAsync({ type: "blob" });
        const downloadLink = document.createElement("a");
        const zipFileName = savedOutputName ? `${savedOutputName}.zip` : "converted_images.zip";
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
    } else if (convertedBlobs.length === 1) {
    try {
        const { blob, fileName } = convertedBlobs[0];
        const downloadLink = document.createElement("a");
        const fileExtension = formatSelect.value.toLowerCase();
        const savedOutputName = localStorage.getItem('savedOutputName');
        const finalFileName = savedOutputName ? `${savedOutputName}.${fileExtension}` : `converted_image.${fileExtension}`;
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = finalFileName;
        downloadLink.click();
        URL.revokeObjectURL(downloadLink.href);
        webpToPngText.classList.add("display-text");
        webpToPngText.innerHTML = `File Saved`;
    } catch (error) {
        console.error("Error during single file download:", error);
        alert("Error during single file download. Please try again.");
    }
    }
}
});
