export function generateSlug(text: string): string {
    const normalizedText = text
        .toLowerCase()
        .replace(/ç/g, 'c')
        .replace(/[^\w\s]/gi, '')
        .trim();
    

    return normalizedText.replace(/\s+/g, '_');
}