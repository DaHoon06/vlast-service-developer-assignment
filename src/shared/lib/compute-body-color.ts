export const computeBodyColor = (p: number): string => {
    let r: number, g: number, b: number;
    if (p < 80) {
        const ratio = p / 80;
        r = Math.round(243 - 33 * ratio);
        g = Math.round(229 - 124 * ratio);
        b = Math.round(171 - 141 * ratio);
    } else {
        const ratio = Math.min((p - 80) / 20, 1);
        r = Math.round(210 - 160 * ratio);
        g = Math.round(105 - 85 * ratio);
        b = Math.round(30 - 20 * ratio);
    }
    return `rgb(${r},${g},${b})`;
}
