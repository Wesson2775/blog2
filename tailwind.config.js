/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['LXGW WenKai', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
        },
        secondary: 'var(--secondary)',
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        border: 'var(--border)',
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#ededed',
            a: {
              color: '#ef4444',
              '&:hover': {
                color: '#dc2626',
              },
            },
            h1: {
              color: '#ededed',
            },
            h2: {
              color: '#ededed',
            },
            h3: {
              color: '#ededed',
            },
            h4: {
              color: '#ededed',
            },
            h5: {
              color: '#ededed',
            },
            h6: {
              color: '#ededed',
            },
            strong: {
              color: '#ededed',
            },
            code: {
              color: '#ef4444',
              backgroundColor: '#232b3b',
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
            },
            pre: {
              backgroundColor: '#232b3b',
              color: '#ededed',
            },
            blockquote: {
              color: '#94a3b8',
              borderLeftColor: '#2d3748',
            },
            hr: {
              borderColor: '#2d3748',
            },
            ol: {
              color: '#ededed',
            },
            ul: {
              color: '#ededed',
            },
            li: {
              color: '#ededed',
            },
            table: {
              color: '#ededed',
            },
            thead: {
              color: '#ededed',
              borderBottomColor: '#2d3748',
            },
            tbody: {
              tr: {
                borderBottomColor: '#2d3748',
              },
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

