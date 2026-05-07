import DB from "../../db.js";
import createBookCard from "../../client/components/ui/bookCard.js";
import { createSkeletonCard } from "../../client/components/ui/skeletonCard.js";

// Skeleton
const renderSkeletons = (container, count = 6) => {
    container.innerHTML = "";
    for (let i = 0; i < count; i++) {
        container.appendChild(createSkeletonCard());
    }
};

// carousel renderer 
const renderCarousel = async (containerId, fetchBooksCallback) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    renderSkeletons(container, 10);

    await new Promise(resolve => setTimeout(resolve, 800));

    const books = fetchBooksCallback();

    container.innerHTML = "";

    if (books.length === 0) {
        container.innerHTML = `<p class="text-gray-400">No books found.</p>`;
        return;
    }

    books.forEach(book => {
        container.appendChild(createBookCard(book));
    });
};

//Homepage carousels
export const renderTrendingCarousel = () => renderCarousel("trending-carousel", () => DB.getTrendingBooks());
export const renderFantasyCarousel  = () => renderCarousel("fantasy-carousel",  () => DB.getGenreBooks("Fantasy"));
export const renderFictionCarousel  = () => renderCarousel("fiction-carousel",  () => DB.getGenreBooks("Fiction"));
export const renderHorrorCarousel   = () => renderCarousel("horror-carousel",   () => DB.getGenreBooks("Horror"));
export const renderRomanceCarousel  = () => renderCarousel("romance-carousel",  () => DB.getGenreBooks("Romance"));

