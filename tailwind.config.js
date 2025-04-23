module.exports = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/features/**/*.{ts,tsx}",
    "./src/ui/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
      },
      spacing: {
        sm: "0.5rem",
        md: "1rem",
        lg: "2rem",
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
