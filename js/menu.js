import { mobileBarr, mobileNav } from "./general/querySelector.js";
const mobileBarrElement = mobileBarr();
const mobileNavElement = mobileNav();
if (mobileBarrElement) {
    mobileBarrElement.addEventListener("click", () => {
        mobileNavElement.classList.toggle("open");
    });
}
