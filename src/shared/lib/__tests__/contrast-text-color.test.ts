import { contrastTextColor } from '../contrast-text-color';

describe('contrastTextColor', () => {
    test.each([
        ['#FFFFFF', 'text-gray-900'],
        ['#000000', 'text-white'],
        ['#FF0000', 'text-white'],
        ['#00FF00', 'text-gray-900'],
        ['#0000FF', 'text-white'],
        ['#FFFF00', 'text-gray-900'],
        ['#808080', 'text-gray-900'],
        ['#7F7F7F', 'text-white'],
    ] as const)('%s → %s', (hex, expected) => {
        expect(contrastTextColor(hex)).toBe(expected);
    });

    test('3자리 hex #FFF → text-gray-900', () => {
        expect(contrastTextColor('#FFF')).toBe('text-gray-900');
    });

    test('3자리 hex #000 → text-white', () => {
        expect(contrastTextColor('#000')).toBe('text-white');
    });

    test('3자리 hex #F00 → text-white', () => {
        expect(contrastTextColor('#F00')).toBe('text-white');
    });
});
