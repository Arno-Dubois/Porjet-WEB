import { fetchAPI } from "./fetch.js";
import { displayDetailedView, displayCast } from "./displayDetailedView.js";
const getParameter = (key) => {
    const address = window.location.search;
    const parameterList = new URLSearchParams(address);
    return parameterList.get(key);
};

const focusContainer = document.querySelector(".focus-container");
const json = await fetchAPI(`${getParameter("type")}/${getParameter("id")}`);
displayDetailedView(json, focusContainer);
const cast = await fetchAPI(
    `${getParameter("type")}/${getParameter("id")}/credits`
);
displayCast(cast);
