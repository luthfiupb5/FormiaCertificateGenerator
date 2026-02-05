import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Formia - Certificate Generator',
        short_name: 'Formia',
        description: 'Design certificates, map your data, and generate thousands of PDFs in seconds. The ultimate tool for bulk creativity.',
        start_url: '/',
        display: 'standalone',
        background_color: '#050505',
        theme_color: '#7c3aed',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
    };
}
