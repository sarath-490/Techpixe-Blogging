/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
      extend: {
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
          display: ['Playfair Display', 'serif'],
        },
        colors: {
          // Custom aesthetic additions if needed, but slate/cyan/blue defaults form the base
        },
        animation: {
            'fade-in': 'fadeIn 0.5s ease-out forwards',
            'slide-up': 'slideUp 0.5s ease-out forwards',
        },
        keyframes: {
            fadeIn: {
                '0%': { opacity: '0' },
                '100%': { opacity: '1' },
            },
            slideUp: {
                '0%': { transform: 'translateY(20px)', opacity: '0' },
                '100%': { transform: 'translateY(0)', opacity: '1' },
            }
        }
      },
    },
    plugins: [
        require('@tailwindcss/typography'),
        require('@tailwindcss/forms'), // Optional but good for inputs
        // require('tailwindcss-animate'), // If we had it
    ],
  }
