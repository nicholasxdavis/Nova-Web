
console.log('Loading Downloader!');

class InstagramPostDownloader {
    constructor() {
        this.postUrl = '';
        this.dl_urls = [];
        this.shortcode = '';
        this.__typename = '';
    }

    async init() {
        this.postUrl = document.getElementById('postUrl').value.trim();
        if (!this.postUrl || !this.postUrl.startsWith('https://www.instagram.com/p/')) {
            alert('Please enter a valid Instagram post URL.');
            return false;
        }
        document.getElementById('mybutton').disabled = true;

        try {
            const response = await axios.get('https://instagram-post-and-reels-downloader.p.rapidapi.com/', {
                params: {
                    url: this.postUrl
                },
                headers: {
                    "X-RapidAPI-Key": "5a828f49a6mshda9a62005aa0a5bp1da125jsn38899f4de6b7",
                    "X-RapidAPI-Host": "instagram-post-and-reels-downloader.p.rapidapi.com"
                }
            });

            if (!response.data || response.data.error) {
                alert('Error fetching post data.');
                return false;
            }

            this.dl_urls = [response.data.url]; // Assuming the API returns the direct download URL
            this.shortcode = response.data.shortcode; // Assuming the API returns the shortcode
            this.__typename = response.data.__typename; // Assuming the API returns the typename

            return true;
        } catch (error) {
            console.error('Error fetching post data:', error);
            alert('Error fetching post data.');
            return false;
        }
    }

    async dls() {
        const mybutton = document.querySelector('#mybutton');
        mybutton.disabled = true;

        for (let i = 0; i < this.dl_urls.length; i++) {
            let dl_url = this.dl_urls[i];
            let fn = dl_url.split('?')[0].split('/').pop();
            fn = this.shortcode + '_' + fn;
            try {
                const response = await axios.get(dl_url, { responseType: 'blob' });
                const url = URL.createObjectURL(response.data);
                this.dl(url, fn);
            } catch (error) {
                console.error('Error downloading file:', error);
                alert('Error downloading file.');
                return;
            }
        }

        mybutton.disabled = false;
    }

    dl(url, fn) {
        const a = document.createElement('a');
        a.href = url;
        a.setAttribute('download', fn);
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    async run() {
        let ret = await this.init();
        if (!ret) return;
        await this.dls();
    }
}

function makeDiv() {
    const div = document.createElement('div');
    div.id = '__my_div__';
    div.innerHTML = `
    <input type="text" id="postUrl" placeholder="Paste Instagram post URL here">
    <button id="mybutton" onclick="window.ipd.run();">
        DOWNLOADS
    </button>
    `;
    document.body.appendChild(div);
}

function setDisplayMydiv() {
    const mydiv = document.getElementById('__my_div__');
    if (!mydiv) return;
    mydiv.style.display = document.URL.startsWith('https://www.instagram.com/p/') ? '' : 'none';
}

let ipd = new InstagramPostDownloader();
window.ipd = ipd;
makeDiv();
setDisplayMydiv();

const target = document.querySelector('body');
const observer = new MutationObserver(mutations => {
    mutations.forEach(setDisplayMydiv);
});
const config = { childList: true, subtree: true };
observer.observe(target, config);
setDisplayMydiv();