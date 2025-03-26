import {
    searchInput,
    searchResultsDropdown,
    searchNoResults,
    searchResultItems,
    searchFilters,
} from "../general/querySelector.js";
import { searchMovies } from "../fetch/fetchSearch.js";
import { fetchAPI } from "../fetch/fetch.js";

function handleSearch() {
    const searchQuery = searchInput().value.trim();
    if (searchQuery) {
        //console.log("Searching for:", searchQuery);

        searchMovies(searchQuery);
    }
}

const filters = {
    type: ["movie", "tv", "person"],
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
    const resultsContainer = searchResultsDropdown();
    const noResultsElement = searchNoResults();
    const resultItems = searchResultItems();
    const filtersElement = searchFilters();

    resultsContainer.style.display = "block";
    filtersElement.style.display = "flex";

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
        const result = results.results[i];
        const resultItem = resultItems[i];

        resultItem.innerHTML = "";
        resultItem.setAttribute("data-type", result.media_type);

        const imgBaseUrl = "https://image.tmdb.org/t/p/w92";
        const posterPath = result.poster_path || result.profile_path;
        const mediaType = result.media_type;
        const title = result.title || result.name;
        const date = result.release_date || result.first_air_date || "";
        const formattedDate = date
            ? new Date(date).toLocaleDateString("fr-FR")
            : mediaType === "person" && result.birthday
            ? new Date(result.birthday).toLocaleDateString("fr-FR")
            : "Date inconnue";
        const rating = result.vote_average
            ? result.vote_average.toFixed(1)
            : "N/A";

        let additionalDetails = null;
        let genreInfo = "Genre inconnu";
        let seasonEpisodeInfo = "";
        let knownFor = "";

        if (mediaType !== "person") {
            additionalDetails = await fetchAPI(mediaType + "/" + result.id);

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
                    const seasonCount =
                        additionalDetails.number_of_seasons || 0;
                    const episodeCount =
                        additionalDetails.number_of_episodes || 0;
                    seasonEpisodeInfo = `<span class="result-seasons">${seasonCount} saison${
                        seasonCount > 1 ? "s" : ""
                    }, ${episodeCount} épisode${
                        episodeCount > 1 ? "s" : ""
                    }</span>`;
                }
            }
        } else if (result.known_for && result.known_for.length > 0) {
            knownFor = result.known_for
                .slice(0, 2)
                .map((item) => item.title || item.name)
                .join(", ");
        }

        resultItem.innerHTML = `
            <div class="result-item-content">
                <div class="result-image">
                    <img src="${
                        posterPath
                            ? imgBaseUrl + posterPath
                            : mediaType === "person"
                            ? "./img/user-round-x.svg"
                            : "./img/popcorn.svg"
                    }" alt="${title}">
                </div>
                <div class="result-details">
                    <div class="result-title">${title}</div>
                    <div class="result-info">
                        <span class="result-date">${
                            mediaType === "person" ? "Acteur" : formattedDate
                        }</span>
                        <span class="result-type ${mediaType}">${
            mediaType === "tv"
                ? "Série"
                : mediaType === "movie"
                ? "Film"
                : mediaType === "person"
                ? "Personne"
                : mediaType
        }</span>
                        ${
                            mediaType !== "person"
                                ? `<span class="result-rating">⭐ ${rating}</span>`
                                : ""
                        }
                    </div>
                    <div class="result-meta">
                        ${
                            mediaType === "person"
                                ? knownFor
                                    ? `<span class="result-genre">Connu pour: ${knownFor}</span>`
                                    : ""
                                : `<span class="result-genre">${genreInfo}</span>${seasonEpisodeInfo}`
                        }
                    </div>
                </div>
            </div>
        `;

        resultItem.onclick = () => {
            if (mediaType === "person") {
                window.location.href = `actor-focus.html?id=${result.id}`;
            } else {
                window.location.href = `focus.html?id=${result.id}&type=${mediaType}`;
            }

            searchInput().value = "";
            resultsContainer.style.display = "none";
        };

        resultItem.style.display = "block";
    }

    for (let i = maxResults; i < resultItems.length; i++) {
        resultItems[i].style.display = "none";
    }
}

function applyFilters(results, filters) {
    return results.filter((item) => {
        if (!filters.type.includes(item.media_type)) {
            return false;
        }

        if (item.media_type === "person") {
            return true;
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

export { handleSearch, filters, applyFilters, displaySearchResults };
