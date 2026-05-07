export const createSkeletonCard = () => {
    const skeleton = document.createElement("div");
    skeleton.className = [
        "snap-start shrink-0 w-36",
        "flex flex-col gap-2",
        "animate-pulse" // Tailwind's pulsing animation
    ].join(" ");

    skeleton.innerHTML = `
        <!-- Image placeholder (matches w-36 h-52 and rounded-xl) -->
        <div class="w-36 h-52 rounded-xl bg-gray-300 dark:bg-gray-700"></div>
        
        <!-- Text placeholders -->
        <div class="px-1 mt-1 flex flex-col gap-1.5">
            <!-- Title placeholder -->
            <div class="h-3.5 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
            <!-- Author placeholder -->
            <div class="h-2.5 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
    `;

    return skeleton;
};