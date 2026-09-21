export function picIds(value) {
    for (let depth = 0; typeof value === 'string' && depth < 8; depth++) {
        try {
            value = JSON.parse(value);
        } catch {
            value = value.replace(/^[\s["]+|[\s\]"]+$/g, '').split(',');
            break;
        }
    }
    const values = Array.isArray(value) ? value : value == null ? [] : [value];
    if (values.some(id => !/^\d+$/.test(String(id).trim()))) return [];
    return [...new Set(values.map(id => String(Number(id))))];
}
