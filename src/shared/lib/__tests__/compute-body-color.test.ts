import { computeBodyColor } from '../compute-body-color';

const parseRgb = (rgb: string): [number, number, number] => {
    const match = rgb.match(/rgb\((\d+),(\d+),(\d+)\)/);
    if (!match) throw new Error(`Not an rgb string: ${rgb}`);
    return [Number(match[1]), Number(match[2]), Number(match[3])];
};

describe('computeBodyColor', () => {
    test('p=0 → 초기 노란색 (#F3E5AB ≈ rgb(243,229,171))', () => {
        const [r, g, b] = parseRgb(computeBodyColor(0));
        expect(r).toBe(243);
        expect(g).toBe(229);
        expect(b).toBe(171);
    });

    test('p=80 → 1단계 끝 rgb(210,105,30)', () => {
        const [r, g, b] = parseRgb(computeBodyColor(80));
        expect(r).toBe(210);
        expect(g).toBe(105);
        expect(b).toBe(30);
    });

    test('p=100 → 완전히 탄 색상 rgb(50,20,10)', () => {
        const [r, g, b] = parseRgb(computeBodyColor(100));
        expect(r).toBe(50);
        expect(g).toBe(20);
        expect(b).toBe(10);
    });

    test('p=40 → 1단계 중간값 (r,g,b 선형 감소)', () => {
        const [r, g, b] = parseRgb(computeBodyColor(40));
        // ratio = 40/80 = 0.5
        expect(r).toBe(Math.round(243 - 33 * 0.5)); // 227
        expect(g).toBe(Math.round(229 - 124 * 0.5)); // 167
        expect(b).toBe(Math.round(171 - 141 * 0.5)); // 101
    });

    test('p > 100이면 비율을 1로 고정 (p=100과 동일)', () => {
        expect(computeBodyColor(200)).toBe(computeBodyColor(100));
    });

    test('유효한 rgb() 문자열 형식 반환', () => {
        expect(computeBodyColor(50)).toMatch(/^rgb\(\d+,\d+,\d+\)$/);
    });
});
