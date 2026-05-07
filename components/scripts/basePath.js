// components/scripts/basePath.js
// Derives the repo root URL so fetch() paths work on any host,
// including GitHub Pages subpath deployments (e.g. /Librozone/).
//
// import.meta.url here is something like:
//   http://localhost:5500/components/scripts/router.js          (local)
//   https://carlt-dev.github.io/Librozone/components/scripts/router.js  (GH Pages)
//
// We walk up two directories ("scripts" → "components" → root) to get the base.

const scriptUrl = new URL(import.meta.url);          // full URL of THIS file
const parts     = scriptUrl.pathname.split("/");      // split on /

// Remove the filename and two parent folders (scripts, components)
// adjust the slice count if basePath.js moves to a different depth
parts.splice(-3);                                     // drop /components/scripts/basePath.js

export const BASE = scriptUrl.origin + parts.join("/") + "/";
// e.g. "https://carlt-dev.github.io/Librozone/"