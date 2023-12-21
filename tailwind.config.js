/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
    fontFamily: {
      'sans': ['Raleway', 'ui-sans-serif', 'system-ui'],
      'serif': ['Libre Bodoni', 'ui-serif', 'Georgia'],
      'mono': ['ui-monospace', 'SFMono-Regular'],
    }
  },
  daisyui: {
    themes: [
      {
        base: {
          "primary": "#F6F8F7",
          "secondary": "#181616",
          "accent": "#EEE6D4",
          "base-100": "#ffffff",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};