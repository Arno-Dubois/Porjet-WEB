import { fetchTV, fetchTrending } from "./fetch.js";
import token from "./settings.js";
import displayHome from "./displayHome.js";

fetchTrending("day");
fetchTV("top_rated");

const searchContainer = document.querySelector(".search-container");
const searchInput = document.querySelector(".search-container div > input");
const searchButton = document.querySelector(".search-container div > button");

function handleSearch() {
    const searchQuery = searchInput.value.trim();
    if (searchQuery) {
        console.log("Searching for:", searchQuery);
        // Fetch search results and display them under the search bar
        searchMovies(searchQuery);
    }
}

searchButton.addEventListener("click", (e) => {
    e.preventDefault();
    handleSearch();
});

searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        handleSearch();
    }
});

searchInput.addEventListener("input", handleSearch);

async function displaySearchResults(results) {
    const resultsContainer = document.querySelector(".search-results-dropdown");
    const noResultsElement = document.querySelector(".search-no-results");
    const resultItems = document.querySelectorAll(".search-result-item");

    resultsContainer.style.display = "block";

    if (results.results.length === 0) {
        // Hide all result items
        resultItems.forEach((item) => {
            item.style.display = "none";
        });
        // Show the no results message
        noResultsElement.style.display = "block";
        return;
    }

    // Sort results using weighted rating that considers vote count
    results.results.sort((a, b) => {
        // Get rating and vote count values (default to 0 if missing)
        const ratingA = a.vote_average || 0;
        const ratingB = b.vote_average || 0;
        const countA = a.vote_count || 0;
        const countB = b.vote_count || 0;
        
        // Use Bayesian average formula (similar to IMDB's weighted rating)
        // This balances between the movie's rating and the average rating based on vote count
        const minVotesRequired = 10000; // Minimum votes to consider fully reliable
        const globalAverageRating = 5.5; // Average across all movies
        
        // Calculate weighted ratings
        const weightedRatingA = ((countA / (countA + minVotesRequired)) * ratingA) + 
                               ((minVotesRequired / (countA + minVotesRequired)) * globalAverageRating);
        
        const weightedRatingB = ((countB / (countB + minVotesRequired)) * ratingB) + 
                               ((minVotesRequired / (countB + minVotesRequired)) * globalAverageRating);
        
        return weightedRatingB - weightedRatingA;
    });

    // Show the result items, hide no results message
    noResultsElement.style.display = "none";

    const maxResults = Math.min(5, results.results.length);

    // Update content for available results
    for (let i = 0; i < maxResults; i++) {
        const movie = results.results[i];
        const resultItem = resultItems[i];

        resultItem.style.display = "block";
        
        // Clear previous content
        resultItem.innerHTML = "";
        
        // Create enhanced result item with image, title, date, type and rating
        const imgBaseUrl = "https://image.tmdb.org/t/p/w92";
        const posterPath = movie.poster_path || movie.profile_path;
        const mediaType = movie.media_type;
        const title = movie.title || movie.name;
        const date = movie.release_date || movie.first_air_date || "";
        const formattedDate = date ? new Date(date).toLocaleDateString('fr-FR') : "Date inconnue";
        const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
        
        // Fetch additional details (genres, seasons, episodes)
        let additionalDetails = await fetchAdditionalDetails(movie.id, mediaType);
        let genreInfo = "Genre inconnu";
        let seasonEpisodeInfo = "";
        
        if (additionalDetails) {
            // Handle genres
            if (additionalDetails.genres && additionalDetails.genres.length > 0) {
                genreInfo = additionalDetails.genres.slice(0, 2).map(g => g.name).join(', ');
            }
            
            // Handle season/episode info for TV shows
            if (mediaType === 'tv') {
                const seasonCount = additionalDetails.number_of_seasons || 0;
                const episodeCount = additionalDetails.number_of_episodes || 0;
                seasonEpisodeInfo = `<span class="result-seasons">${seasonCount} saison${seasonCount > 1 ? 's' : ''}, ${episodeCount} épisode${episodeCount > 1 ? 's' : ''}</span>`;
            }
        }
        
        resultItem.innerHTML = `
            <div class="result-item-content">
                <div class="result-image">
                    <img src="${posterPath ? imgBaseUrl + posterPath : './img/popcorn.svg'}" alt="${title}">
                </div>
                <div class="result-details">
                    <div class="result-title">${title}</div>
                    <div class="result-info">
                        <span class="result-date">${formattedDate}</span>
                        <span class="result-type">${mediaType === 'tv' ? 'Série' : mediaType === 'movie' ? 'Film' : mediaType}</span>
                        <span class="result-rating">⭐ ${rating}</span>
                    </div>
                    <div class="result-meta">
                        <span class="result-genre">${genreInfo}</span>
                        ${seasonEpisodeInfo}
                    </div>
                </div>
            </div>
        `;

        // Add the click event listener
        resultItem.onclick = () => {
            window.location.href = `focus.html?id=${movie.id}&type=${mediaType}`;

            searchInput.value = "";
            resultsContainer.style.display = "none";
        };
    }

    // Hide any unused result items
    for (let i = maxResults; i < resultItems.length; i++) {
        resultItems[i].style.display = "none";
    }
}

// Function to fetch additional details for a movie or TV show
async function fetchAdditionalDetails(id, mediaType) {
    try {
        const url = `https://api.themoviedb.org/3/${mediaType}/${id}?language=fr-FR`;
        const options = {
            method: "GET",
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        const response = await fetch(url, options);
        if (response.ok) {
            return await response.json();
        } else {
            console.error(`Error fetching ${mediaType} details:`, response.status);
            return null;
        }
    } catch (error) {
        console.error("Search error:", error);
    }
}

async function searchMovies(query) {
    try {
        const searchPath = `search/multi`;
        const url = `https://api.themoviedb.org/3/${searchPath}?language=fr-FR&query=${encodeURIComponent(
            query
        )}`;

        const options = {
            method: "GET",
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        const response = await fetch(url, options);
        if (response.ok) {
            const json = await response.json();
            console.log("Search results:", json);
            // Display search results in dropdown
            displaySearchResults(json);
        } else {
            console.error("Search error:", response.status);
        }
    } catch (error) {
        console.error("Search error:", error);
    }
}