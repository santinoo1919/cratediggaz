/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        // Remove the array syntax
        sans: "SpaceGrotesk_400Regular",
        bold: "SpaceGrotesk_700Bold",
      },
    },
  },
  plugins: [],
};
