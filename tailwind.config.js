/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx}",
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",

		// Or if using `src` directory:
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			backgroundImage: {
				'main': "url('https://images.unsplash.com/photo-1593062096033-9a26b09da705?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80')"
			},
			colors: {
				'logo-color': '#17c2a5'
			},
			animation: {
			// Bounces 5 times 1s equals 5 seconds
			'bounce-short': 'bounce 0.1s ease-in-out 1',
			'pulse-short': 'pulse 1s ease-in-out 2'
			}
				
		},
	},
	plugins: [
		require("tailwindcss-autofill"),
	],
}
