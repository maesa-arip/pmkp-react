// Defaults from docs/CASCADING.xlsx, cascading!G7:G9.
export const ikuColors = { grey: '#BFBFBF', yellow: '#FFFF00', pink: '#FF8080' };
export const validColor = color => /^#[0-9a-f]{6}$/i.test(color || '') ? color.toUpperCase() : null;
export const colorText = color => {
    const rgb = color.slice(1).match(/.{2}/g).map(value => {
        const channel = parseInt(value, 16) / 255;
        return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    });
    return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722 > 0.179 ? '#000000' : '#FFFFFF';
};
export const colorStyle = color => color ? { '--iku-color': color, '--iku-text': colorText(color) } : undefined;
