import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Older pages use `space`; mapped onto the GDV ink blues.
        space: {
          900: '#0C1440',
          800: '#121C55',
          700: '#1A276E',
          600: '#24348C',
        },
        // IMD 2026 GDV palette: royal blue #344CC5, mint #62F2BD, cream #F1F9C8.
        // `ink` is a deep shade of the GDV blue used as the page base,
        // `paper` is the GDV cream, `agar` is kept as an alias of the GDV mint.
        royal: {
          DEFAULT: '#344CC5',
          50: '#eef1fc',
          100: '#d9dff8',
          200: '#b3bff1',
          300: '#8497e6',
          400: '#5a70d8',
          500: '#344CC5',
          600: '#2a3ea6',
          700: '#223285',
        },
        mint: {
          DEFAULT: '#62F2BD',
          soft: '#9BF7D5',
          deep: '#22C98D',
          ink: '#0B6B4B',
        },
        cream: {
          DEFAULT: '#F1F9C8',
          soft: '#F8FCE4',
          deep: '#DDEB9A',
        },
        ink: {
          950: '#070C2B',
          900: '#0C1440',
          800: '#121C55',
          700: '#1A276E',
          600: '#24348C',
        },
        paper: '#F1F9C8',
        agar: {
          DEFAULT: '#62F2BD',
          soft: '#9BF7D5',
          deep: '#22C98D',
        },
        // Legacy accent names, retuned to sit inside the GDV palette.
        bio: {
          cyan: '#8FF5D1',
          emerald: '#62F2BD',
          teal: '#62F2BD',
          purple: '#B3BFF1',
          pink: '#F1F9C8',
          blue: '#8497E6',
          green: '#62F2BD',
        },
      },
      fontFamily: {
        // GDV typography: Poppins for headings and labels, Lato for body copy.
        sans: ['var(--font-lato)', 'Lato', 'system-ui', 'sans-serif'],
        display: ['var(--font-poppins)', 'Poppins', 'sans-serif'],
        mono: ['var(--font-poppins)', 'Poppins', 'sans-serif'],
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        blob: 'blob 12s infinite',
        gradient: 'gradient 8s ease infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'drift': 'drift 25s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        blob: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '25%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '50%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '75%': { transform: 'translate(20px, 40px) scale(1.05)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.05)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(0.5)' },
          '50%': { opacity: '1', transform: 'scale(1)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '25%': { transform: 'translate(10px, -10px) rotate(5deg)' },
          '50%': { transform: 'translate(-5px, -20px) rotate(-3deg)' },
          '75%': { transform: 'translate(-10px, -5px) rotate(2deg)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;