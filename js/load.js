import { fetchTV, fetchTrending } from "./fetch.js";
import { handleSearch } from "./search.js";

fetchTrending("day");
fetchTV("top_rated");

const filterOptions = document.querySelectorAll(".filter-option");
const ratingInput = document.querySelector(".rating-input");
const searchInput = document.querySelector(".search-container div > input");

// Set up filter state with new defaults
const filters = {
    type: ["movie", "tv"], // Default to both Films and Séries
    date: {
        mode: "before",
        year: 2026,
    },
    rating: {
        mode: "moins",
        value: 10.1,
    },
};

// Update the default value for rating input
ratingInput.value = "10.1";

// Handle filter option clicks
filterOptions.forEach((option) => {
    option.addEventListener("click", () => {
        const filterType = option.dataset.filter;
        const filterValue = option.dataset.value;

        // Handle multi-select for type filters differently
        if (option.classList.contains("multi-select")) {
            option.classList.toggle("active");

            // Update type filters array based on active selections
            if (filterType === "type") {
                if (option.classList.contains("active")) {
                    // Add to array if not already included
                    if (!filters.type.includes(filterValue)) {
                        filters.type.push(filterValue);
                    }
                } else {
                    // Remove from array
                    filters.type = filters.type.filter(
                        (t) => t !== filterValue
                    );

                    // Don't allow empty selection
                    if (filters.type.length === 0) {
                        option.classList.add("active");
                        filters.type.push(filterValue);
                    }
                }
            }
        } else {
            // For non-multi-select filters, keep old behavior
            document
                .querySelectorAll(`.filter-option[data-filter="${filterType}"]`)
                .forEach((el) => {
                    if (!el.classList.contains("multi-select")) {
                        el.classList.remove("active");
                    }
                });
            option.classList.add("active");

            // Update filter state
            if (filterType === "date") {
                filters.date.mode = filterValue;
            } else if (filterType === "rating") {
                filters.rating.mode = filterValue;
            }
        }

        // If there's an active search, re-run it with the new filters
        if (searchInput.value.trim()) {
            handleSearch();
        }
    });
});
