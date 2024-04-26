/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{handlebars,js}"],
  variants: {
    extend: {
      display: ["group-hover"],
    },
  },
  theme: {
    extend: {},
    colors: {
      // Using modern `hsl`
      base: "rgb(var(--color-base) / <alpha-value>)",
      primary: "rgb(var(--color-primary) / <alpha-value>)",
      secundary: "rgb(var(--color-secundary) / <alpha-value>)",
      secundaryHover: "rgb(var(--color-secundary-hover) / <alpha-value>)",
      black: "rgb(var(--color-black) / <alpha-value>)",
      white: "rgb(var(--color-white) / <alpha-value>)",
      remove: "rgb(var(--color-remove) / <alpha-value>)",

      red100: "rgb(var(--color-red-100) / <alpha-value>)",
      red800: "rgb(var(--color-red-800) / <alpha-value>)",

      yellow100: "rgb(var(--color-yellow-100) / <alpha-value>)",
      yellow800: "rgb(var(--color-yellow-800) / <alpha-value>)",

      green100: "rgb(var(--color-green-100) / <alpha-value>)",
      green800: "rgb(var(--color-green-800) / <alpha-value>)",

      slate200: "rgb(var(--color-slate-200) / <alpha-value>)",
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
