import { fetchAPI } from "./fetch.js";
import { displayFocus, displayCast } from "./displayFocus.js";
const getParameter = (key) => {
    const address = window.location.search;
    const parameterList = new URLSearchParams(address);
    return parameterList.get(key);
};

const focusContainer = document.querySelector(".focus-container");
const json = await fetchAPI(`${getParameter("type")}/${getParameter("id")}`);
displayFocus(json, focusContainer);
const cast = await fetchAPI(
    `${getParameter("type")}/${getParameter("id")}/credits`
);
displayCast(cast);
