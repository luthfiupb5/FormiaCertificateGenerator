export default function JsonLd() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Formia',
        operatingSystem: 'Web',
        applicationCategory: 'DesignApplication',
        description: 'Design certificates, map your data, and generate thousands of PDFs in seconds.',
        url: 'https://formia.luthfibassam.space',
        author: {
            '@type': 'Person',
            name: 'Luthfi Bassam U P',
        },
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
        },
        featureList: 'Certificate Design, Bulk PDF Generation, Data Mapping, Cloud Storage',
        screenshot: 'https://formia.luthfibassam.space/og-image.png',
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
