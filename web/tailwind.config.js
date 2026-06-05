export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        mx: {
          green:  "#166534",
          red:    "#991b1b",
          gold:   "#b45309",
          blue:   "#1d4ed8",
        },
      },
      fontFamily: {
        sans:  ["system-ui", "-apple-system", "'Helvetica Neue'", "Arial", "sans-serif"],
        serif: ["Georgia", "'Times New Roman'", "serif"],
        mono:  ["ui-monospace", "'Courier New'", "monospace"],
      },
    },
  },
  plugins: [],
};
