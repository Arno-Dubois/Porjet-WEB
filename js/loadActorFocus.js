import { fetchAPI } from "./fetch.js";
import { displayActorFocus, displayActorFilmography } from "./displayActorFocus.js";

// Get actor ID from URL parameter
const getParameter = (key) => {
    const address = window.location.search;
    const parameterList = new URLSearchParams(address);
    return parameterList.get(key);
};

// Fetch actor details
const actorId = getParameter("id");
if (actorId) {
    try {
        // Fetch basic actor information
        const actorData = await fetchAPI(`person/${actorId}`);
        displayActorFocus(actorData);
        
        // Fetch actor's movie/TV credits
        const credits = await fetchAPI(`person/${actorId}/combined_credits`);
        displayActorFilmography(credits);
    } catch (error) {
        console.error("Error loading actor data:", error);
        window.location.href = "404.html";
    }
} else {
    console.error("No actor ID provided");
    window.location.href = "404.html";
}

// Add mobile navigation toggle
document.getElementById("barr")?.addEventListener("click", function () {
    document.getElementById("mobileNav").classList.toggle("open");
}); 