import { fetchAPI } from "./fetch.js";
import { displayFocus, displayCast, displayTrailer } from "./displayFocus.js";
import { focusContainer } from "./querySelector.js";

const getParameter = (key) => {
    const address = window.location.search;
    const parameterList = new URLSearchParams(address);
    return parameterList.get(key);
};

const json = await fetchAPI(`${getParameter("type")}/${getParameter("id")}`);
displayFocus(json);

const cast = await fetchAPI(
    `${getParameter("type")}/${getParameter("id")}/credits`
);
displayCast(cast);

const videos = await fetchAPI(
    `${getParameter("type")}/${getParameter("id")}/videos`
);
displayTrailer(videos);
