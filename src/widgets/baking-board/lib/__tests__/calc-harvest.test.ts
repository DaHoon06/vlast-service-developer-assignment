import { calcHarvest } from '../calc-harvest';

describe('calcHarvest', () => {
    describe('progress < 40 (덜 익음)', () => {
        test.each([0, 20, 39])('progress=%i → gain=-10, good=false', (p) => {
            const result = calcHarvest(p, 0);
            expect(result).toEqual({ gain: -10, text: '덜 익음', color: '#aaaaaa', good: false });
        });
    });

    describe('40 ≤ progress < 75 (좋아요!)', () => {
        test.each([40, 60, 74])('progress=%i → gain=50, good=true', (p) => {
            const result = calcHarvest(p, 0);
            expect(result).toEqual({ gain: 50, text: '좋아요!', color: '#ffd700', good: true });
        });
    });

    describe('75 ≤ progress < 92 (PERFECT!!)', () => {
        test('progress=80, combo=0 → gain=100', () => {
            expect(calcHarvest(80, 0)).toEqual({
                gain: 100,
                text: 'PERFECT!!',
                color: '#00ffcc',
                good: true,
            });
        });

        test('progress=80, combo=5 → gain=150 (100 + 5*10)', () => {
            expect(calcHarvest(80, 5)).toEqual({
                gain: 150,
                text: 'PERFECT!!',
                color: '#00ffcc',
                good: true,
            });
        });

        test('progress=91 (타기 직전 경계값)', () => {
            const result = calcHarvest(91, 3);
            expect(result.gain).toBe(130);
            expect(result.good).toBe(true);
        });
    });

    describe('92 ≤ progress < 100 (타기 시작!)', () => {
        test.each([92, 95, 99])('progress=%i → gain=-30, good=false', (p) => {
            const result = calcHarvest(p, 10);
            expect(result).toEqual({
                gain: -30,
                text: '타기 시작!',
                color: '#ff6666',
                good: false,
            });
        });
    });

    describe('progress ≥ 100 (숯덩이)', () => {
        test.each([100, 110, 115])('progress=%i → gain=-100, good=false', (p) => {
            const result = calcHarvest(p, 0);
            expect(result).toEqual({
                gain: -100,
                text: '숯덩이ㅠㅠ',
                color: '#888888',
                good: false,
            });
        });
    });
});
