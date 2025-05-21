const API_KEY = "488eb36776275b8ae18600751059fb49";
const PROXY_URL = "https://nerflixprox.arenaofvalorph937.workers.dev/proxy?id=";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

let currentMediaType = "movie"; // 'movie' or 'tv'
let currentPage = 1;
let currentQuery = "";
let timeout;

const loading = document.getElementById("loading");
const moviesGrid = document.getElementById("movies");
const errorMsg = document.getElementById("error");

// Fetch movies or TV shows
async function fetchMovies(query = "", page = 1) {
  loading.style.display = "block";
  errorMsg.innerText = "";
  moviesGrid.innerHTML = "";

  let url = query
    ? `https://api.themoviedb.org/3/search/${currentMediaType}?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
    : `https://api.themoviedb.org/3/${currentMediaType}/popular?api_key=${API_KEY}&page=${page}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.results && data.results.length > 0) {
      renderMovies(data.results);
    } else {
      errorMsg.innerText = "No results found.";
    }
  } catch (error) {
    errorMsg.innerText = "Failed to fetch data.";
  }

  loading.style.display = "none";
}

// Render movie or TV cards
function renderMovies(movies) {
  moviesGrid.innerHTML = movies
    .map(movie => {
      const title = movie.title || movie.name;
      const poster = movie.poster_path ? `${IMG_URL}${movie.poster_path}` : "https://via.placeholder.com/300x450?text=No+Image";
      return `
        <div class="movie-card" onclick='openModal(${JSON.stringify(movie)})'>
          <img src="${poster}" alt="${title}" />
          <h3>${title}</h3>
        </div>
      `;
    })
    .join("");
}

// Infinite Scroll
window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
    currentPage++;
    fetchMoreMovies(currentQuery, currentPage);
  }
});

function fetchMoreMovies(query, page) {
  let url = query
    ? `https://api.themoviedb.org/3/search/${currentMediaType}?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
    : `https://api.themoviedb.org/3/${currentMediaType}/popular?api_key=${API_KEY}&page=${page}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.results) {
        const newMovies = document.createElement("div");
        newMovies.innerHTML = data.results
          .map(movie => {
            const title = movie.title || movie.name;
            const poster = movie.poster_path ? `${IMG_URL}${movie.poster_path}` : "https://via.placeholder.com/300x450?text=No+Image";
            return `
              <div class="movie-card" onclick='openModal(${JSON.stringify(movie)})'>
                <img src="${poster}" alt="${title}" />
                <h3>${title}</h3>
              </div>
            `;
          })
          .join("");
        moviesGrid.appendChild(newMovies);
      }
    })
    .catch(() => {
      errorMsg.innerText = "Failed to load more data.";
    });
}

// Initial fetch
fetchMovies();
