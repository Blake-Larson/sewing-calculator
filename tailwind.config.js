/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			animation: {
				'fade-in': 'fadeIn 0.5s ease-in-out forwards'
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: 0, transform: 'translateY(-1rem)' },
					'100%': { opacity: 1, transform: 'translateY(0)' }
				}
			}
		},
		fontFamily: {
			sans: ['Poppins', 'ui-sans-serif', 'system-ui'],
			serif: ['Playfair Display', 'ui-serif', 'Georgia'],
			mono: ['ui-monospace', 'SFMono-Regular']
		},
		screens: {
			'xs': '380px',
			'sm': '640px',
			'md': '768px',
			'lg': '1024px',
			'xl': '1280px',
			'2xl': '1536px',
		  },
	},
	daisyui: {
		themes: ['cupcake']
	},
	plugins: [require('daisyui')]
};
