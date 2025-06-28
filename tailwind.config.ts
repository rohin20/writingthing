import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Flexoki color palette
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Flexoki base colors
        flexoki: {
          black: '#100F0F',
          950: '#1C1B1A',
          900: '#282726',
          850: '#343331',
          800: '#403E3C',
          700: '#575653',
          600: '#6F6E69',
          500: '#878580',
          300: '#B7B5AC',
          200: '#CECDC3',
          150: '#DAD8CE',
          100: '#E6E4D9',
          50: '#F2F0E5',
          paper: '#FFFCF0',
        },
        // Flexoki accent colors
        flexokiRed: {
          DEFAULT: '#AF3029',
          light: '#D14D41',
        },
        flexokiOrange: {
          DEFAULT: '#BC5215',
          light: '#DA702C',
        },
        flexokiYellow: {
          DEFAULT: '#AD8301',
          light: '#D0A215',
        },
        flexokiGreen: {
          DEFAULT: '#66800B',
          light: '#879A39',
        },
        flexokiCyan: {
          DEFAULT: '#24837B',
          light: '#3AA99F',
        },
        flexokiBlue: {
          DEFAULT: '#205EA6',
          light: '#4385BE',
        },
        flexokiPurple: {
          DEFAULT: '#5E409D',
          light: '#8B7EC8',
        },
        flexokiMagenta: {
          DEFAULT: '#A02F6F',
          light: '#CE5D97',
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
