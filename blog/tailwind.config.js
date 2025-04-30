/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        neutral: {
          50: '#ffffff',     // Pure white
          100: '#f9fafb',    // Very light gray-white
          200: '#f3f4f6',    // Light gray-white
          300: '#e5e7eb',    // Soft gray
          400: '#d1d5db',    // Light gray
          500: '#6b7280',    // Medium gray
          600: '#4b5563',    // Dark gray
          700: '#374151',    // Darker gray
          800: '#1f2937',    // Very dark gray
          900: '#111827',    // Almost black
          950: '#030712',    // Deep black
        },
        text: {
          DEFAULT: '#000000',  // Pure black for text
          muted: '#374151',    // Dark gray for less important text
        },
        background: {
          DEFAULT: '#ffffff',  // Pure white background
          light: '#f9fafb',    // Very light background
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}