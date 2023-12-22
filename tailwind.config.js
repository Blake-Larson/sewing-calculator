/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			animation: {
				'fade-in': 'fadeIn 0.5s ease-in forwards'
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: 0 },
					'100%': { opacity: 1 }
				}
			}
		},
		fontFamily: {
			sans: ['Poppins', 'ui-sans-serif', 'system-ui'],
			serif: ['Playfair Display', 'ui-serif', 'Georgia'],
			mono: ['ui-monospace', 'SFMono-Regular']
		}
	},
	daisyui: {
		themes: ['cupcake']
	},
	plugins: [require('daisyui')]
};
