// postcss.config.js
// Ensure this is the ONLY PostCSS configuration file in your project root.
// Delete postcss.config.mjs if it exists.

module.exports = {
    plugins: {
      '@tailwindcss/postcss': {}, // Tells PostCSS to use the Tailwind CSS plugin (from the separate package)
      autoprefixer: {},          // Adds vendor prefixes to CSS rules for browser compatibility
    },
  };
  