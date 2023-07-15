/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
	content: ['./src/**/*.{html,js,ts,vue}'],
	theme: {
		screens: {
			'xs': '475px',
			...defaultTheme.screens,
		},
		linearGradientColors: {
			'amber-orange': ['#F59E0B', '#F97316'],
			'orange-amber': ['#F97316', '#F59E0B'],
			'purple-ube': ['#5B06D6', '#8400D1'],
			'ube-purple': ['#8400D1', '#5B06D6'],
			'gold-dark': ['#C1860D', '#A87112'],
			'gold-light': ['#DA9B07', '#C1860D'],
			'silver-dark': ['#828282', '#575757'],
			'silver-light': ['#AFAEAD', '#828282'],
			'bronze-dark': ['#CD7F32', '#A46628'],
			'bronze-light': ['#D7995B', '#CD7F32'],
		},
		repeatingLinearGradientColors: theme => theme('linearGradientColors'),
		extend: {
			transitionProperty: {
				'height': 'height',
				'spacing': 'margin, padding',
				'width': 'width',
				'fadetransform': 'opacity, transform',
			},
			maxWidth: {
				'1/2': '50%',
			},
			minWidth: {
				'1/2': '50%',
			},
			rotate: {
				'135': '135deg',
			},
			aspectRatio: {
				'4/3': '4 / 3',
				'phone': '9 / 16',
			},
			borderRadius: {
				'4xl': '2rem',
			},
			translate: {
				'15p': '15%',
				'1/5': '20%',
				'1/10': '10%',
			},
			width: {
				'65p': '65%',
				'90p': '90%',
			},
			height: {
				'65p': '65%',
				'90p': '90%',
			}
		},
	},
	plugins: [
		require('@tailwindcss/forms'),
		require('@tailwindcss/typography'),
		require('tailwindcss-gradients'),
		require('tailwind-children'),
		require('daisyui'),
	],
	darkMode: ['class', '[data-theme="dark"]'],
	daisyui: {
		logs: false,
		themes: [
			{
				light: {
					"primary": "#5B06D6",
					"secondary": "#BB9AE6",
					"accent": "#F97316",
					"neutral": "#27272A",
					"base-100": "#F4F4F5",
					"info": "#38BDF8",
					"success": "#22C55E",
					"warning": "#EAB308",
					"error": "#EF4444",
				},
			},
			{
				dark: {
					"primary": "#F97316",
					"secondary": "#FED7AA",
					"accent": "#5B06D6",
					"neutral": "#F4F4F5",
					"base-100": "#27272A",
					"info": "#38BDF8",
					"success": "#22C55E",
					"warning": "#EAB308",
					"error": "#EF4444",
				},
			},
		],
	},
}

