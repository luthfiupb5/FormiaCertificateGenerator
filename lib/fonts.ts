export const GOOGLE_FONTS = [
    'Inter',
    'Roboto',
    'Open Sans',
    'Montserrat',
    'Poppins',
    'Playfair Display',
    'Lato',
    'Merriweather',
    'Oswald',
    'Raleway'
];

export function loadGoogleFont(fontFamily: string) {
    if (!fontFamily) return;

    const linkId = `font-${fontFamily.replace(/\s+/g, '-').toLowerCase()}`;
    if (document.getElementById(linkId)) return;

    const link = document.createElement('link');
    link.id = linkId;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}:wght@400;500;700&display=swap`;
    document.head.appendChild(link);
}

export async function loadCustomFont(name: string, url: string) {
    const font = new FontFace(name, `url(${url})`);
    await font.load();
    document.fonts.add(font);
}

// Hardcoded reliable static TTF URLs to prevent Variable Font issues with pdf-lib
const FONT_URLS: Record<string, string> = {
    'Inter': 'https://github.com/google/fonts/raw/main/ofl/inter/static/Inter-Regular.ttf',
    'Roboto': 'https://github.com/google/fonts/raw/main/ofl/roboto/static/Roboto-Regular.ttf',
    'Open Sans': 'https://github.com/google/fonts/raw/main/ofl/opensans/static/OpenSans-Regular.ttf',
    'Montserrat': 'https://github.com/google/fonts/raw/main/ofl/montserrat/static/Montserrat-Regular.ttf',
    'Poppins': 'https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-Regular.ttf', // Poppins is usually static at root
    'Playfair Display': 'https://github.com/google/fonts/raw/main/ofl/playfairdisplay/static/PlayfairDisplay-Regular.ttf',
    'Lato': 'https://github.com/google/fonts/raw/main/ofl/lato/Lato-Regular.ttf',
    'Merriweather': 'https://github.com/google/fonts/raw/main/ofl/merriweather/Merriweather-Regular.ttf',
    'Oswald': 'https://github.com/google/fonts/raw/main/ofl/oswald/static/Oswald-Regular.ttf',
    'Raleway': 'https://github.com/google/fonts/raw/main/ofl/raleway/static/Raleway-Regular.ttf'
};

export async function getGoogleFontUrl(fontFamily: string): Promise<string> {
    return FONT_URLS[fontFamily] || '';
}

export async function fetchFontBuffer(fontFamily: string): Promise<ArrayBuffer | null> {
    try {
        const url = FONT_URLS[fontFamily];
        if (!url) {
            console.warn(`No hardcoded URL for ${fontFamily}`);
            return null;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch font: ${res.statusText}`);
        return await res.arrayBuffer();
    } catch (e) {
        console.warn(`Could not fetch font buffer for ${fontFamily}, falling back to standard font.`, e);
        return null;
    }
}
