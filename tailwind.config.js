/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Keep existing `neon-*` classnames, but remap them to calm Material-like accents.
        neon: {
          cyan: '#2563eb',     // primary (blue 600)
          magenta: '#1d4ed8',  // primary darker (blue 700) - keeps gradients subtle
          amber: '#3b82f6',    // primary lighter (blue 500)
          purple: '#60a5fa',   // primary light (blue 400)
          blue: '#2563eb',
        },
        dark: {
          900: '#0b1220',
          800: '#0f172a',
          700: '#111c33',
          600: '#1f2a44',
        }
      },
      fontFamily: {
        // Material-like: use the same readable family for headings and body.
        display: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        // Subtle elevation (no glow)
        'neon-cyan': '0 1px 2px rgba(15, 23, 42, 0.10), 0 6px 16px rgba(15, 23, 42, 0.10)',
        'neon-magenta': '0 1px 2px rgba(15, 23, 42, 0.10), 0 6px 16px rgba(15, 23, 42, 0.10)',
        'neon-amber': '0 1px 2px rgba(15, 23, 42, 0.10), 0 6px 16px rgba(15, 23, 42, 0.10)',
        'glass': '0 1px 2px rgba(15, 23, 42, 0.08), 0 10px 24px rgba(15, 23, 42, 0.10)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 255, 255, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 255, 255, 0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
