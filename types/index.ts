export type FontConfig = {
    family: string;
    source: 'google' | 'upload' | 'system';
    url?: string; // For uploaded or google fonts
    weight?: string | number;
};

export interface TextHolder {
    id: string;
    type: 'text';
    text: string; // Placeholder text e.g. "{Name}"

    // Position & Dimensions (Canvas coordinates)
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    scaleX?: number;
    scaleY?: number;

    // Style
    fontFamily: string;
    fontSize: number;
    fontWeight: string | number;
    fontStyle?: 'normal' | 'italic';
    textAlign: 'left' | 'center' | 'right' | 'justify';
    color: string;
    opacity: number;

    // Data Mapping
    mappedColumn?: string; // Header name from CSV
}

// "Campaign" or "Project" Context
export interface CertificateProject {
    id: string;
    name: string;
    templateUrl: string | null; // URL to the background image
    templateDimensions: { width: number; height: number }; // Original PDF/Image dimensions
    holders: TextHolder[];

    // Data
    dataFields: string[]; // CSV Headers
    dataRows: Record<string, string>[]; // Parsed CSV data
}

export type TemplateType = 'pdf' | 'png' | 'jpg';
