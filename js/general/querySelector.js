/**
 * Centralized DOM selector references
 * This file contains all document.querySelector, document.querySelectorAll,
 * and document.getElementById calls from across the codebase
 */

// Main containers
export const focusContainer = () => document.querySelector(".focus-container");
export const searchContainer = () =>
    document.querySelector(".search-container");
export const gridTendance = (container) => document.querySelector(container);
export const banner = () => document.querySelector(".search-container");

// Search-related selectors
export const searchInput = () =>
    document.querySelector(".search-container div > input");
export const searchButton = () =>
    document.querySelector(".search-container div > button");
export const searchResultsDropdown = () =>
    document.querySelector(".search-results-dropdown");
export const searchFilters = () => document.querySelector(".search-filters");
export const searchNoResults = () =>
    document.querySelector(".search-no-results");
export const searchResultItems = () =>
    document.querySelectorAll(".search-result-item");

// Form elements
export const yearInput = () => document.querySelector(".year-input");
export const ratingInput = () => document.querySelector(".rating-input");
export const filterOptions = () => document.querySelectorAll(".filter-option");

// Movie/TV trending buttons
export const trendingByDay = () => document.querySelector("#day");
export const trendingByWeek = () => document.querySelector("#week");
export const tvTopRated = () => document.querySelector("#top_rated");
export const tvPopular = () => document.querySelector("#popular");
export const movieTopRated = () => document.querySelector("#top_rated_movie");
export const moviePopular = () => document.querySelector("#popular_movie");

// Movie/Actor focus page elements
export const castContainer = () => document.querySelector(".actors");
export const filmographyContainer = () =>
    document.querySelector(".focus-container .actors");
export const castingSection = () => document.querySelector(".casting");

// Mobile navigation
export const mobileBarr = () => document.getElementById("barr");
export const mobileNav = () => document.getElementById("mobileNav");
