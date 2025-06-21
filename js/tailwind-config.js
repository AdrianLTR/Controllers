// Tailwind CSS Configuration
tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                sans: ['Source Sans Pro', 'sans-serif'],
                heading: ['Cinzel', 'serif'],
            },
            colors: {
                'brand-blue': {
                    'light': '#4b5563',   // Medium gray
                    'DEFAULT': '#1f2937', // Dark gray
                    'dark': '#000000',    // Black
                },
                'brand-gray': {
                    'light': '#f3f4f6',
                    'DEFAULT': '#6b7280',
                    'dark': '#000000',    // Main text is now black
                }
            },
            animation: {
                'fade-in': 'fadeIn 1s ease-in-out',
                'fade-in-up': 'fadeInUp 0.8s ease-out',
                'zoom': 'zoom-in 10s ease-out forwards',
            }
        }
    }
}
