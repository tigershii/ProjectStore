import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";
import scrollbar from "tailwind-scrollbar";
import lineClamp from "@tailwindcss/line-clamp";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
  	extend: {
  		colors: {
  			background: 'var(--background)',
  			foreground: 'var(--foreground)',
  			primary: {
  				light: '#f7f7f8',
  				dark: '#000000'
  			},
			secondary: {
				light: '#ffffff',
				dark: '#1b1b1b'
			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [
    animate,
    scrollbar({ nocompatible: true }),
	lineClamp,
  ],
} satisfies Config;
