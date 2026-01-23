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

export async function getGoogleFontUrl(fontFamily: string): Promise<string> {
    // This is a simplified way to get the font URL. 
    try {
        const cssUrl = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}:wght@400;700&display=swap`;
        const res = await fetch(cssUrl);
        const css = await res.text();

        // Regex to extract the first woff2 url
        const match = css.match(/src:\s*url\((.*?)\)/);
        if (match && match[1]) {
            return match[1];
        }
    } catch (e) {
        console.error('Failed to resolve font URL', e);
    }
    return '';
}

export async function fetchFontBuffer(fontFamily: string): Promise<ArrayBuffer | null> {
    try {
        const url = await getGoogleFontUrl(fontFamily);
        if (!url) return null;

        const res = await fetch(url);
        return await res.arrayBuffer();
    } catch (e) {
        console.warn(`Could not fetch font buffer for ${fontFamily}, falling back to standard font.`);
        return null;
    }
}
