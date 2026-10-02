/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#f3f4f6",
        surface: "#f6f7f9",
        line: "#e7e7ea",
        ink: "#1c1c1e",
        mute: "#8d8d95",
        accent: "#2f7bff",
      },
      boxShadow: {
        card: "0 10px 40px rgba(16, 24, 40, 0.06)",
      },
    },
  },
  plugins: [],
};
