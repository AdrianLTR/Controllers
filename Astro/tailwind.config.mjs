/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				'sans': ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
				'cinzel': ['Cinzel', 'serif'],
				'heading': ['Cinzel', 'serif'],
			},
			colors: {
				'brand-blue': {
					'light': '#4b5563',
					'DEFAULT': '#1f2937',
					'dark': '#000000',
				},
				'brand-gray': {
					'light': '#f3f4f6',
					'DEFAULT': '#6b7280',
					'dark': '#000000',
				}
			},
			animation: {
				'fade-in': 'fadeIn 1s ease-in-out',
				'fade-in-up': 'fadeInUp 0.8s ease-out',
				'float': 'float 3s ease-in-out infinite',
				'zoom': 'zoom-in 10s ease-out forwards',
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				fadeInUp: {
					'0%': { 
						opacity: '0',
						transform: 'translateY(30px)'
					},
					'100%': { 
						opacity: '1',
						transform: 'translateY(0)'
					},
				},
				float: {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' },
				},
				'zoom-in': {
					'0%': { transform: 'scale(1)' },
					'100%': { transform: 'scale(1.05)' },
				}
			}
		},
	},
	plugins: [],
}