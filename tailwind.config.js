module.exports = {
    darkMode: 'class',
    content: [
      './pages/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {
        animation: {
          'spin-slow': 'spin 3s linear infinite',
          'pulse-glow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        },
        colors: {
          slate: {
            900: '#0f172a',
            800: '#1e293b',
          },
          cyan: {
            400: '#22d3ee',
            600: '#0891b2',
          },
          teal: {
            600: '#0d9488',
          }
        },
        backdropBlur: {
          xs: '2px',
        }
      }  
    }
  }