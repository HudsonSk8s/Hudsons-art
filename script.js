// Basic gallery loading from local assets + URL-added images in localStorage
const galleryGrid = document.getElementById('gallery-grid');
const comicsGrid = document.getElementById('comics-grid');
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lb-img');
const lbClose = document.getElementById('lb-close');
const lbDownload = document.getElementById('lb-download');
const yearSpan = document.getElementById('year');
const featuredArt = document.getElementById('featured-art');

yearSpan.textContent = new Date().getFullYear();

const defaultGalleryFiles = [
  'assets/gallery/art1.jpg',
  'assets/gallery/art2.jpg',
  'assets/gallery/art3.jpg'
];
const defaultComicFiles = [
  'assets/comics/issue1-page1.jpg',
  'assets/comics/issue1-page2.jpg'
];

const GALLERY_KEY = 'myart_gallery_urls_v1';
const COMICS_KEY = 'myart_comics_urls_v1';

function getStored(key){ try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch(e){ return []; } }
function setStored(key, arr){ localStorage.setItem(key, JSON.stringify(arr)); }

function renderGrid(container, srcArray){
  container.innerHTML = '';
  srcArray.forEach(src=>{
    const a = document.createElement('a');
    a.className = 'card';
    a.href = '#';
    const img = document.createElement('img');
    img.loading = 'lazy';
    img.src = src;
    img.alt = 'Artwork';
    a.appendChild(img);
    a.addEventListener('click', e=>{
      e.preventDefault();
      openLightbox(src);
    });
    container.appendChild(a);
  });
}

function openLightbox(src){
  lbImg.src = src;
  lbDownload.href = src;
  lbDownload.download = src.split('/').pop();
  lb.classList.add('show');
  lb.setAttribute('aria-hidden', 'false');
}
function closeLightbox(){
  lb.classList.remove('show');
  lb.setAttribute('aria-hidden', 'true');
}
lbClose.addEventListener('click', closeLightbox);
lb.addEventListener('click', (e)=>{ if(e.target===lb) closeLightbox(); });

const themeToggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('site_theme') || 'light';
if(currentTheme === 'dark') document.documentElement.style.setProperty('--bg','#0f0f12');
themeToggle.addEventListener('click', ()=>{
  const now = localStorage.getItem('site_theme') === 'dark' ? 'light' : 'dark';
  localStorage.setItem('site_theme', now);
  if(now==='dark'){
    document.documentElement.style.setProperty('--bg','#0b0b0d');
    document.documentElement.style.setProperty('--panel','#0f0f12');
    document.documentElement.style.setProperty('--text','#f6f6f6');
  } else {
    document.documentElement.style.removeProperty('--bg');
    document.documentElement.style.removeProperty('--panel');
    document.documentElement.style.removeProperty('--text');
  }
});

function build(){
  const galleryUrls = defaultGalleryFiles.slice();
  const comicUrls = defaultComicFiles.slice();

  const storedGallery = getStored(GALLERY_KEY);
  const storedComics = getStored(COMICS_KEY);
  const allGallery = galleryUrls.concat(storedGallery);
  const allComics = comicUrls.concat(storedComics);

  renderGrid(galleryGrid, allGallery);
  renderGrid(comicsGrid, allComics);

  if(allGallery[0]) featuredArt.src = allGallery[0];
}
build();

document.getElementById('add-gallery-btn').addEventListener('click', ()=>{
  const input = document.getElementById('add-gallery-url');
  const url = input.value.trim();
  if(!url) return alert('Enter an image URL.');
  const arr = getStored(GALLERY_KEY);
  arr.unshift(url);
  setStored(GALLERY_KEY, arr);
  input.value = '';
  build();
});
document.getElementById('clear-gallery-btn').addEventListener('click', ()=>{
  if(confirm('Clear images added via URL?')){ localStorage.removeItem(GALLERY_KEY); build(); }
});

document.getElementById('add-comic-btn').addEventListener('click', ()=>{
  const input = document.getElementById('add-comic-url');
  const url = input.value.trim();
  if(!url) return alert('Enter an image URL.');
  const arr = getStored(COMICS_KEY);
  arr.unshift(url);
  setStored(COMICS_KEY, arr);
  input.value = '';
  build();
});
document.getElementById('clear-comic-btn').addEventListener('click', ()=>{
  if(confirm('Clear comic pages added via URL?')){ localStorage.removeItem(COMICS_KEY); build(); }
});

document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeLightbox(); });
