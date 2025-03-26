import { fetchTV, fetchTrending } from "./fetch.js";
import { handleSearch, filters } from "./search.js";

fetchTrending("day");
fetchTV("top_rated");

const filterOptions = document.querySelectorAll(".filter-option");
const ratingInput = document.querySelector(".rating-input");
const searchInput = document.querySelector(".search-container div > input");

ratingInput.value = "10.1";

filterOptions.forEach((option) => {
    option.addEventListener("click", () => {
        console.log(option.dataset);
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
        console.log(filters);

        if (searchInput.value.trim()) {
            handleSearch();
        }
    });
});
