import { fetchAPI } from "./fetch.js";
import {
    displayActorFocus,
    displayActorFilmography,
} from "./displayActorFocus.js";
import { mobileBarr, mobileNav } from "./querySelector.js";

const getParameter = (key) => {
    const address = window.location.search;
    const parameterList = new URLSearchParams(address);
    return parameterList.get(key);
};

const actorId = getParameter("id");
if (actorId) {
    try {
        const actorData = await fetchAPI(`person/${actorId}`);
        displayActorFocus(actorData);

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

mobileBarr()?.addEventListener("click", function () {
    mobileNav().classList.toggle("open");
});
