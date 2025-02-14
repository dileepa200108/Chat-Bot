import { nextui } from "@nextui-org/react";


/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        f1: ["Rubik"]
      },
      colors: {
        royalPurple: "#6A0DAD",  // Deep Purple
        royalGold: "#FFD700",     // Gold
        parchment: "#FAF3E0",     // Soft Ivory
        midnightBlue: "#1B1F3B",  // Dark Blue
        magicalCyan: "#50C4ED",   // Accent color
        jetBlack: "	#121212",
        onyxGray:"#1E1E1E",
        softWhite:"#EAEAEA",
        royalGold:"#FFD700"
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
}



