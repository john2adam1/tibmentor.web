import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          tint: "hsl(var(--primary-tint))",
          50: '#EAF2FE',
          100: '#D3E4FD',
          200: '#A8C9FB',
          300: '#7CAEF8',
          400: '#3F89F0',
          500: '#0A63E8',
          600: '#0A55CC',
          700: '#093E9A',
          800: '#0B2F7A',
          900: '#0B1D4F'
        },
        // TibMentor logo palette (roadmap T-03)
        brand: {
          ink: '#05173A',
          navy: '#0B1D4F',
          blue: '#1E56D6',
          accent: '#0A63E8',
          violet: '#6A4CF0',
          cyan: '#31D0FC'
        },
        slate: {
          800: '#0B1D4F',
          900: '#05173A',
          950: '#030F28'
        },
        dark: {
          900: '#0b0b10',
          800: '#121216',
          700: '#18181d'
        },
        android: '#10b981',
        ios: '#0ea5e9',
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        'brand-hero': 'linear-gradient(135deg, #0B1D4F 0%, #6A4CF0 60%, #1E56D6 100%)',
        'brand-progress': 'linear-gradient(90deg, #0A63E8 0%, #31D0FC 100%)',
        'brand-gradient': 'linear-gradient(135deg, #0B1D4F 0%, #1E56D6 60%, #0A63E8 100%)',
      },
      boxShadow: {
        card: '0 10px 25px rgba(0, 0, 0, 0.04)',
        soft: '0 4px 12px rgba(0,0,0,0.03)',
        header: '0 2px 10px rgba(0, 0, 0, 0.02)',
        premium: '0 20px 40px -12px rgba(10, 99, 232, 0.16)',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        }
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config

