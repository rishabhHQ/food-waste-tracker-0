/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // ── Brand palette ──────────────────────────────────────────────
        cream:   '#FAF5EC',   // page background – warm off-white
        paper:   '#FFFDF8',   // card surface
        ink:     '#2E2A25',   // primary text (warm dark brown)
        clay:    '#C8553D',   // terracotta – primary accent / CTA
        'clay-dark': '#A8432D',
        'clay-light': '#F2D5CE',
        olive:   '#6B8F4E',   // sage – positive / savings / eco
        'olive-light': '#E4EBD8',
        mustard: '#D9A441',   // warnings
        'mustard-light': '#FAF0D5',
        tomato:  '#B3392B',   // critical alerts
        'tomato-light': '#FADDDB',
        muted:   '#7A7168',   // secondary text
        border:  '#E6DCC8',   // card borders
        // shades
        'cream-dark': '#F0E8D6',
      },
      fontFamily: {
        serif: ['"Fraunces"', 'Georgia', 'serif'],
        sans:  ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(46,42,37,0.08), 0 1px 2px -1px rgba(46,42,37,0.06)',
        'card-hover': '0 4px 12px 0 rgba(46,42,37,0.12)',
      },
    },
  },
  plugins: [],
};
