const API_KEY = '488eb36776275b8ae18600751059fb49';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const MOVIE_PROXY = 'https://nerflixprox.arenaofvalorph937.workers.dev/proxy?id=';
const TV_PROXY = 'https://vidsrc.cc/v2/embed/tv/';

let currentPage = 1;
let currentQuery = '';
let isFetching = false;
let timeout = null;
let currentMode = 'movie'; // or 'tv'

async function fetchContent(query = '', page = 1) {
  if (isFetching) return;
  isFetching = true;
  document.getElementById("loading").style.display = "block";

  let endpoint = currentMode === 'movie' 
    ? (query ? `search/movie` : `movie/popular`)
    : (query ? `search/tv` : `tv/popular`);

  const url = `https://api.themoviedb.org/3/${endpoint}?api_key=${API_KEY}&query=${query}&page=${page}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    document.getElementById("loading").style.display = "none";

    if (!data.results || data.results.length === 0) {
      if (page === 1) document.getElementById("movies").innerHTML = "";
      document.getElementById("error").innerText = "No results found!";
      return;
    }

    document.getElementById("error").innerText = "";
    displayMovies(data.results, page === 1);
  } catch (err) {
    document.getElementById("error").innerText = "Error fetching data!";
    document.getElementById("loading").style.display = "none";
  } finally {
    isFetching = false;
  }
}

function displayMovies(items, clear = false) {
  const moviesDiv = document.getElementById("movies");
  if (clear) moviesDiv.innerHTML = "";

  items.forEach(item => {
    if (!item.poster_path) return;

    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.innerHTML = `
      <img src="${IMG_URL}${item.poster_path}" alt="${item.title || item.name}" loading="lazy">
      <div class="overlay">${item.title || item.name}</div>
    `;
    movieEl.onclick = () => openModal(item);
    moviesDiv.appendChild(movieEl);
  });
}

function openModal(item) {
  document.getElementById("modalTitle").innerText = item.title || item.name;
  document.getElementById("modalOverview").innerText = item.overview;
  document.getElementById("modalRelease").innerText = `Release: ${item.release_date || item.first_air_date || 'N/A'}`;
  document.getElementById("modalRating").innerText = `Rating: ${item.vote_average || 'N/A'}`;
  
  const iframe = document.getElementById("videoFrame");
  if (currentMode === 'movie') {
    iframe.src = `${MOVIE_PROXY}${item.id}`;
  } else {
    iframe.src = `${TV_PROXY}${item.id}?autoPlay=false`;
  }

  document.getElementById("movieModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("movieModal").style.display = "none";
  document.getElementById("videoFrame").src = "";
}

function debounceSearch() {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    const query = document.getElementById("search").value.trim();
    currentQuery = query;
    currentPage = 1;
    fetchContent(currentQuery, currentPage);
  }, 300);
}

function switchMode(mode) {
  currentMode = mode;
  currentQuery = '';
  currentPage = 1;
  document.getElementById("search").value = '';
  fetchContent();
}

// Scroll loading
window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
    currentPage++;
    fetchContent(currentQuery, currentPage);
  }
});

// Initial fetch & auto-fill
fetchContent().then(() => {
  const checkAndLoad = () => {
    if (document.body.scrollHeight <= window.innerHeight) {
      currentPage++;
      fetchContent(currentQuery, currentPage).then(checkAndLoad);
    }
  };
  checkAndLoad();
});
