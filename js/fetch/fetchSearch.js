import token from "../general/settings.js";
import {
    applyFilters,
    displaySearchResults,
    filters,
} from "../display/displaySearch.js";

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

export { searchMovies };
