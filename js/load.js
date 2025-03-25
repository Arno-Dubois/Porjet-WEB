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

function displaySearchResults(results) {
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

    // Show the result items, hide no results message
    noResultsElement.style.display = "none";

    const maxResults = Math.min(5, results.results.length);

    // Update content for available results
    for (let i = 0; i < maxResults; i++) {
        const movie = results.results[i];
        const resultItem = resultItems[i];

        if (movie.media_type === "person") {
            maxResults++;
            continue;
        }

        resultItem.style.display = "block";
        resultItem.textContent = movie.title || movie.name;

        // Add the click event listener
        resultItem.onclick = () => {
            window.location.href = `focus.html?id=${movie.id}&type=${movie.media_type}`;

            searchInput.value = "";
            resultsContainer.style.display = "none";
        };
    }

    // Hide any unused result items
    for (let i = maxResults; i < resultItems.length; i++) {
        resultItems[i].style.display = "none";
    }
}

document.addEventListener("click", (e) => {
    const dropdown = document.querySelector(".search-results-dropdown");
    if (dropdown && !searchContainer.contains(e.target)) {
        dropdown.style.display = "none";
    }
});

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
