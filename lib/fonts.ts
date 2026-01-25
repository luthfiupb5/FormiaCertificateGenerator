export const GOOGLE_FONTS = [
    'Inter', 'Roboto', 'Open Sans', 'Montserrat', 'Poppins',
    'Playfair Display', 'Lato', 'Merriweather', 'Oswald', 'Raleway',
    'Roboto Condensed', 'Source Sans Pro', 'Slabo 27px', 'PT Sans',
    'Noto Sans', 'Nunito', 'Prompt', 'Work Sans', 'Rubik', 'Fira Sans',
    'Quicksand', 'Karla', 'Barlow', 'Mulish', 'Inconsolata', 'Mukta',
    'Titillium Web', 'PT Serif', 'Assistant', 'Ubuntu', 'Kanit',
    'Josefin Sans', 'Libre Baskerville', 'Anton', 'Bitter', 'Dancing Script',
    'Oxygen', 'Dosis', 'Arimo', 'Cabin', 'Hind', 'Lobster', 'Pacifico',
    'Crimson Text', 'DM Sans', 'Varela Round', 'Fjalla One', 'Exo 2',
    'Manrope', 'Signika', 'Catamaran', 'Cairo', 'Maven Pro', 'Bebas Neue',
    'Abel', 'Asap', 'Bree Serif', 'Archivo', 'Pathway Gothic One', 'Questrial',
    'Rokkitt', 'Cuprum', 'Muli', 'Shadows Into Light', 'Indie Flower',
    'Amatic SC', 'Caveat', 'Satisfy', 'Permanent Marker', 'Great Vibes',
    'Sacramento', 'Cookie', 'Parisienne', 'Kaushan Script', 'Yellowtail',
    'Tangerine', 'Marck Script', 'Bad Script', 'Courgette', 'Allura',
    'Pinyon Script', 'Mr Dafoe', 'Alex Brush', 'Aguafina Script', 'Herr Von Muellerhoff',
    'Playball', 'Niconne', 'Zeyada', 'Over the Rainbow', 'Homemade Apple',
    'Covered By Your Grace', 'Nothing You Could Do', 'Reenie Beanie',
    'Gloria Hallelujah', 'Architects Daughter', 'Patrick Hand', 'Coming Soon',
    'Schoolbell', 'Rock Salt', 'Chewy'
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
// Hardcoded reliable static TTF URLs (Locally Bundled)
const FONT_URLS: Record<string, string> = {
    'Inter': '/fonts/Inter-Regular.ttf',
    'Roboto': '/fonts/Roboto-Regular.ttf',
    'Open Sans': '/fonts/OpenSans-Regular.ttf',
    'Montserrat': '/fonts/Montserrat-Regular.ttf',
    'Poppins': '/fonts/Poppins-Regular.ttf',
    'Playfair Display': '/fonts/PlayfairDisplay-Regular.ttf',
    'Lato': '/fonts/Lato-Regular.ttf',
    'Merriweather': '/fonts/Merriweather-Regular.ttf',
    'Oswald': '/fonts/Oswald-Regular.ttf',
    'Raleway': '/fonts/Raleway-Regular.ttf',
    'Roboto Condensed': '/fonts/RobotoCondensed-Regular.ttf',
    'Source Sans Pro': '/fonts/SourceSansPro-Regular.ttf',
    'Slabo 27px': '/fonts/Slabo27px-Regular.ttf',
    'PT Sans': '/fonts/PTSans-Regular.ttf',
    'Noto Sans': '/fonts/NotoSans-Regular.ttf',
    'Nunito': '/fonts/Nunito-Regular.ttf',
    'Prompt': '/fonts/Prompt-Regular.ttf',
    'Work Sans': '/fonts/WorkSans-Regular.ttf',
    'Rubik': '/fonts/Rubik-Regular.ttf',
    'Fira Sans': '/fonts/FiraSans-Regular.ttf',
    'Quicksand': '/fonts/Quicksand-Regular.ttf',
    'Karla': '/fonts/Karla-Regular.ttf',
    'Barlow': '/fonts/Barlow-Regular.ttf',
    'Mulish': '/fonts/Mulish-Regular.ttf',
    'Inconsolata': '/fonts/Inconsolata-Regular.ttf',
    'Mukta': '/fonts/Mukta-Regular.ttf',
    'Titillium Web': '/fonts/TitilliumWeb-Regular.ttf',
    'PT Serif': '/fonts/PTSerif-Regular.ttf',
    'Assistant': '/fonts/Assistant-Regular.ttf',
    'Ubuntu': '/fonts/Ubuntu-Regular.ttf',
    'Kanit': '/fonts/Kanit-Regular.ttf',
    'Josefin Sans': '/fonts/JosefinSans-Regular.ttf',
    'Libre Baskerville': '/fonts/LibreBaskerville-Regular.ttf',
    'Anton': '/fonts/Anton-Regular.ttf',
    'Bitter': '/fonts/Bitter-Regular.ttf',
    'Dancing Script': '/fonts/DancingScript-Regular.ttf',
    'Oxygen': '/fonts/Oxygen-Regular.ttf',
    'Dosis': '/fonts/Dosis-Regular.ttf',
    'Arimo': '/fonts/Arimo-Regular.ttf',
    'Cabin': '/fonts/Cabin-Regular.ttf',
    'Hind': '/fonts/Hind-Regular.ttf',
    'Lobster': '/fonts/Lobster-Regular.ttf',
    'Pacifico': '/fonts/Pacifico-Regular.ttf',
    'Crimson Text': '/fonts/CrimsonText-Regular.ttf',
    'DM Sans': '/fonts/DMSans-Regular.ttf',
    'Varela Round': '/fonts/VarelaRound-Regular.ttf',
    'Fjalla One': '/fonts/FjallaOne-Regular.ttf',
    'Exo 2': '/fonts/Exo2-Regular.ttf',
    'Manrope': '/fonts/Manrope-Regular.ttf',
    'Signika': '/fonts/Signika-Regular.ttf',
    'Catamaran': '/fonts/Catamaran-Regular.ttf',
    'Cairo': '/fonts/Cairo-Regular.ttf',
    'Maven Pro': '/fonts/MavenPro-Regular.ttf',
    'Bebas Neue': '/fonts/BebasNeue-Regular.ttf',
    'Abel': '/fonts/Abel-Regular.ttf',
    'Asap': '/fonts/Asap-Regular.ttf',
    'Bree Serif': '/fonts/BreeSerif-Regular.ttf',
    'Archivo': '/fonts/Archivo-Regular.ttf',
    'Pathway Gothic One': '/fonts/PathwayGothicOne-Regular.ttf',
    'Questrial': '/fonts/Questrial-Regular.ttf',
    'Rokkitt': '/fonts/Rokkitt-Regular.ttf',
    'Cuprum': '/fonts/Cuprum-Regular.ttf',
    'Muli': '/fonts/Muli-Regular.ttf',
    'Shadows Into Light': '/fonts/ShadowsIntoLight-Regular.ttf',
    'Indie Flower': '/fonts/IndieFlower-Regular.ttf',
    'Amatic SC': '/fonts/AmaticSC-Regular.ttf',
    'Caveat': '/fonts/Caveat-Regular.ttf',
    'Satisfy': '/fonts/Satisfy-Regular.ttf',
    'Permanent Marker': '/fonts/PermanentMarker-Regular.ttf',
    'Great Vibes': '/fonts/GreatVibes-Regular.ttf',
    'Sacramento': '/fonts/Sacramento-Regular.ttf',
    'Cookie': '/fonts/Cookie-Regular.ttf',
    'Parisienne': '/fonts/Parisienne-Regular.ttf',
    'Kaushan Script': '/fonts/KaushanScript-Regular.ttf',
    'Yellowtail': '/fonts/Yellowtail-Regular.ttf',
    'Tangerine': '/fonts/Tangerine-Regular.ttf',
    'Marck Script': '/fonts/MarckScript-Regular.ttf',
    'Bad Script': '/fonts/BadScript-Regular.ttf',
    'Courgette': '/fonts/Courgette-Regular.ttf',
    'Allura': '/fonts/Allura-Regular.ttf',
    'Pinyon Script': '/fonts/PinyonScript-Regular.ttf',
    'Mr Dafoe': '/fonts/MrDafoe-Regular.ttf',
    'Alex Brush': '/fonts/AlexBrush-Regular.ttf',
    'Aguafina Script': '/fonts/AguafinaScript-Regular.ttf',
    'Herr Von Muellerhoff': '/fonts/HerrVonMuellerhoff-Regular.ttf',
    'Playball': '/fonts/Playball-Regular.ttf',
    'Niconne': '/fonts/Niconne-Regular.ttf',
    'Zeyada': '/fonts/Zeyada-Regular.ttf',
    'Over the Rainbow': '/fonts/OvertheRainbow-Regular.ttf',
    'Homemade Apple': '/fonts/HomemadeApple-Regular.ttf',
    'Covered By Your Grace': '/fonts/CoveredByYourGrace-Regular.ttf',
    'Nothing You Could Do': '/fonts/NothingYouCouldDo-Regular.ttf',
    'Reenie Beanie': '/fonts/ReenieBeanie-Regular.ttf',
    'Gloria Hallelujah': '/fonts/GloriaHallelujah-Regular.ttf',
    'Architects Daughter': '/fonts/ArchitectsDaughter-Regular.ttf',
    'Patrick Hand': '/fonts/PatrickHand-Regular.ttf',
    'Coming Soon': '/fonts/ComingSoon-Regular.ttf',
    'Schoolbell': '/fonts/Schoolbell-Regular.ttf',
    'Rock Salt': '/fonts/RockSalt-Regular.ttf',
    'Chewy': '/fonts/Chewy-Regular.ttf'
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
