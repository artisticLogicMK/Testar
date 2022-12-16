import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
    theme: {
        screens: {
            'mic': '281px',
            'xsm': '540px',
            'sm': '640px',
            'md': '768px',
            'md2': '850px',
            'lg': '1024px',
            'lg2': '1140px',
            'xl': '1280px',
            '2xl': '1536px',
        },
        extend: {
            colors: {
                dark: {
                    50: '#063742',
                    100: '#063742',
                    200: '#063742',
                }
            }
        }
    }
}