/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#F48C06",
        secondary: "#FFF9F0",
        dark: "#103741",
        "text-dark": "#1F1F1F",
        "text-light": "#FFFFFF",
        "text-gray": "#696984",
        "accent-purple": "#5B5B98",
        success: "#2D9CDB",
        error: "#EB5757",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Poppins", "sans-serif"],
      },
      backgroundImage: {
        "hero-mesh":
          "radial-gradient(at 0% 0%, rgba(244, 140, 6, 0.15) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(91, 91, 152, 0.15) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(16, 55, 65, 1) 0px, transparent 50%)",
        "grid-pattern":
          "linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
      },
      keyframes: {
        shine: {
          to: { backgroundPosition: "200% center" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-15px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        shine: "shine 5s linear infinite",
        float: "float 8s ease-in-out infinite",
        marquee: "marquee 40s linear infinite",
      },
    },
  },
  plugins: [],
};
