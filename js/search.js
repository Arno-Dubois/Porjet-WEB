import token from "./settings.js";

const searchInput = document.querySelector(".search-container div > input");

function handleSearch() {
    const searchQuery = searchInput.value.trim();
    if (searchQuery) {
        // console.log("Searching for:", searchQuery);

        searchMovies(searchQuery);
    }
}

const filters = {
    type: ["movie", "tv"],
    date: {
        mode: "before",
        year: 2026,
    },
    rating: {
        mode: "moins",
        value: 10.1,
    },
};

async function displaySearchResults(results) {
    const resultsContainer = document.querySelector(".search-results-dropdown");
    const noResultsElement = document.querySelector(".search-no-results");
    const resultItems = document.querySelectorAll(".search-result-item");

    resultsContainer.style.display = "block";

    if (results.results.length === 0) {
        resultItems.forEach((item) => {
            item.style.display = "none";
        });

        noResultsElement.style.display = "block";
        return;
    }

    results.results.sort((a, b) => {
        const ratingA = a.vote_average || 0;
        const ratingB = b.vote_average || 0;
        const countA = a.vote_count || 0;
        const countB = b.vote_count || 0;

        const minVotesRequired = 10000;
        const globalAverageRating = 5.5;

        const weightedRatingA =
            (countA / (countA + minVotesRequired)) * ratingA +
            (minVotesRequired / (countA + minVotesRequired)) *
                globalAverageRating;

        const weightedRatingB =
            (countB / (countB + minVotesRequired)) * ratingB +
            (minVotesRequired / (countB + minVotesRequired)) *
                globalAverageRating;

        return weightedRatingB - weightedRatingA;
    });

    noResultsElement.style.display = "none";

    const maxResults = Math.min(5, results.results.length);

    for (let i = 0; i < maxResults; i++) {
        const movie = results.results[i];
        const resultItem = resultItems[i];

        resultItem.innerHTML = "";

        const imgBaseUrl = "https://image.tmdb.org/t/p/w92";
        const posterPath = movie.poster_path || movie.profile_path;
        const mediaType = movie.media_type;
        const title = movie.title || movie.name;
        const date = movie.release_date || movie.first_air_date || "";
        const formattedDate = date
            ? new Date(date).toLocaleDateString("fr-FR")
            : "Date inconnue";
        const rating = movie.vote_average
            ? movie.vote_average.toFixed(1)
            : "N/A";

        let additionalDetails = await fetchAdditionalDetails(
            movie.id,
            mediaType
        );
        let genreInfo = "Genre inconnu";
        let seasonEpisodeInfo = "";

        if (additionalDetails) {
            if (
                additionalDetails.genres &&
                additionalDetails.genres.length > 0
            ) {
                genreInfo = additionalDetails.genres
                    .slice(0, 2)
                    .map((g) => g.name)
                    .join(", ");
            }

            if (mediaType === "tv") {
                const seasonCount = additionalDetails.number_of_seasons || 0;
                const episodeCount = additionalDetails.number_of_episodes || 0;
                seasonEpisodeInfo = `<span class="result-seasons">${seasonCount} saison${
                    seasonCount > 1 ? "s" : ""
                }, ${episodeCount} épisode${
                    episodeCount > 1 ? "s" : ""
                }</span>`;
            }
        }

        resultItem.innerHTML = `
            <div class="result-item-content">
                <div class="result-image">
                    <img src="${
                        posterPath
                            ? imgBaseUrl + posterPath
                            : "./img/popcorn.svg"
                    }" alt="${title}">
                </div>
                <div class="result-details">
                    <div class="result-title">${title}</div>
                    <div class="result-info">
                        <span class="result-date">${formattedDate}</span>
                        <span class="result-type">${
                            mediaType === "tv"
                                ? "Série"
                                : mediaType === "movie"
                                ? "Film"
                                : mediaType
                        }</span>
                        <span class="result-rating">⭐ ${rating}</span>
                    </div>
                    <div class="result-meta">
                        <span class="result-genre">${genreInfo}</span>
                        ${seasonEpisodeInfo}
                    </div>
                </div>
            </div>
        `;

        resultItem.onclick = () => {
            window.location.href = `focus.html?id=${movie.id}&type=${mediaType}`;

            searchInput.value = "";
            resultsContainer.style.display = "none";
        };

        resultItem.style.display = "block";
    }

    for (let i = maxResults; i < resultItems.length; i++) {
        resultItems[i].style.display = "none";
    }
}

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
            console.error(
                `Error fetching ${mediaType} details:`,
                response.status
            );
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

            const filteredResults = {
                ...json,
                results: applyFilters(json.results, filters),
            };

            displaySearchResults(filteredResults);
        } else {
            console.error("Search error:", response.status);
        }
    } catch (error) {
        console.error("Search error:", error);
    }
}

function applyFilters(results, filters) {
    return results.filter((item) => {
        if (!filters.type.includes(item.media_type)) {
            return false;
        }

        const date = item.release_date || item.first_air_date || "";
        if (!date) return false;

        const year = new Date(date).getFullYear();
        const compareYear = filters.date.year;

        if (filters.date.mode === "before" && year > compareYear) {
            return false;
        } else if (filters.date.mode === "after" && year < compareYear) {
            return false;
        }

        const rating = item.vote_average || 0;
        const compareValue = filters.rating.value;

        if (filters.rating.mode === "plus" && rating < compareValue) {
            return false;
        } else if (filters.rating.mode === "minus" && rating > compareValue) {
            return false;
        }

        return true;
    });
}

export { handleSearch, filters };
