/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.json",
  ],
  theme: {
    extend: {
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': {
            textShadow: '0 0 20px rgba(34,211,238,0.8), 0 0 40px rgba(34,211,238,0.6), 0 0 60px rgba(34,211,238,0.4)',
            filter: 'drop-shadow(0 0 10px rgba(34,211,238,0.8))'
          },
          '100%': {
            textShadow: '0 0 30px rgba(34,211,238,1), 0 0 60px rgba(34,211,238,0.8), 0 0 90px rgba(34,211,238,0.6)',
            filter: 'drop-shadow(0 0 20px rgba(34,211,238,1))'
          },
        },
      },
      fontFamily: {
        roboto: ['var(--font-roboto)'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      gradientColorStops: {
        'orange-red': ['#f97316', '#ef4444'],
        'green-blue': ['#10b981', '#3b82f6'],
        'purple-pink': ['#a855f7', '#ec4899'],
        'yellow-orange': ['#facc15', '#f97316'],
        'red-purple': ['#ef4444', '#a855f7'],
        'blue-indigo': ['#3b82f6', '#6366f1'],
        'teal-green': ['#14b8a6', '#10b981'],
        'indigo-blue': ['#6366f1', '#3b82f6'],
        'pink-red': ['#ec4899', '#ef4444'],
      },
      backgroundImage: {
        'custom-gradient': 'linear-gradient(170.21deg, #ad35bf -7.89%, #3077e2 40.71%, #11266a 89.98%, #0b1b4f 119.95%)',
      },
    },
  },
  plugins: [],
};
