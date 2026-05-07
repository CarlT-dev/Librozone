import { router } from "./router.js";
import DB from "../../db.js";
import initSearchBar from "./searchBar.js";

DB.init();
initSearchBar();
window.addEventListener("hashchange", router);
window.addEventListener("load", router);