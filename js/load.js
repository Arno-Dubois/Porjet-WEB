import { fetchTV, fetchTrending, fetchMovie } from "./fetch/fetch.js";
import { handleSearch, filters } from "./display/displaySearch.js";
import {
    filterOptions,
    ratingInput,
    searchInput,
    searchButton,
    yearInput,
    searchContainer,
    searchResultsDropdown,
    searchFilters,
} from "./general/querySelector.js";

fetchTV("top_rated");
fetchMovie("top_rated");
fetchTrending("day");

const filterOptionElements = filterOptions();
const ratingInputElement = ratingInput();
const searchInputElement = searchInput();

ratingInputElement.value = "10.1";

filterOptionElements.forEach((option) => {
    option.addEventListener("click", () => {
        //console.log(option.dataset);
        const filterType = option.dataset.filter;
        const filterValue = option.dataset.value;

        if (option.classList.contains("multi-select")) {
            option.classList.toggle("active");

            if (filterType === "type") {
                if (option.classList.contains("active")) {
                    if (!filters.type.includes(filterValue)) {
                        filters.type.push(filterValue);
                    }
                } else {
                    filters.type = filters.type.filter(
                        (t) => t !== filterValue
                    );

                    if (filters.type.length === 0) {
                        option.classList.add("active");
                        filters.type.push(filterValue);
                    }
                }
            }
        } else {
            document
                .querySelectorAll(`.filter-option[data-filter="${filterType}"]`)
                .forEach((el) => {
                    if (!el.classList.contains("multi-select")) {
                        el.classList.remove("active");
                    }
                });
            option.classList.add("active");

            if (filterType === "date") {
                filters.date.mode = filterValue;
            } else if (filterType === "rating") {
                filters.rating.mode = filterValue;
            }
        }
        //console.log(filters);

        if (searchInputElement.value.trim()) {
            handleSearch();
        }
    });
});
