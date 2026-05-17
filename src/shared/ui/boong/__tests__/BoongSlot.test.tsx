import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('@/shared/lib/useClickSound', () => ({
    useClickSound: jest.fn(() => jest.fn()),
}));

jest.mock('../Boong', () => ({
    Boong: () => <svg data-testid="boong" />,
}));

jest.mock('@/shared/lib/compute-body-color', () => ({
    computeBodyColor: jest.fn(() => '#AABBCC'),
}));

import { computeBodyColor } from '@/shared/lib/compute-body-color';
import { BoongSlot } from '../BoongSlot';

const mockComputeBodyColor = computeBodyColor as jest.Mock;

describe('BoongSlot', () => {
    const mockOnClick = jest.fn();

    beforeEach(() => jest.clearAllMocks());

    test('슬롯이 role="button"으로 렌더', () => {
        render(<BoongSlot active={false} progress={0} onClick={mockOnClick} />);
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    test('비활성 상태에서는 프로그레스 바 없음', () => {
        const { container } = render(
            <BoongSlot active={false} progress={50} onClick={mockOnClick} />,
        );
        expect(container.querySelector('.bg-green-500')).not.toBeInTheDocument();
        expect(container.querySelector('.bg-orange-400')).not.toBeInTheDocument();
        expect(container.querySelector('.bg-red-500')).not.toBeInTheDocument();
    });

    test('활성 상태 progress ≤ 75 → bg-green-500', () => {
        const { container } = render(
            <BoongSlot active={true} progress={50} onClick={mockOnClick} />,
        );
        expect(container.querySelector('.bg-green-500')).toBeInTheDocument();
    });

    test('활성 상태 progress = 75 → bg-green-500 (경계값)', () => {
        const { container } = render(
            <BoongSlot active={true} progress={75} onClick={mockOnClick} />,
        );
        expect(container.querySelector('.bg-green-500')).toBeInTheDocument();
    });

    test('활성 상태 progress > 75 → bg-orange-400', () => {
        const { container } = render(
            <BoongSlot active={true} progress={80} onClick={mockOnClick} />,
        );
        expect(container.querySelector('.bg-orange-400')).toBeInTheDocument();
    });

    test('활성 상태 progress > 92 → bg-red-500', () => {
        const { container } = render(
            <BoongSlot active={true} progress={93} onClick={mockOnClick} />,
        );
        expect(container.querySelector('.bg-red-500')).toBeInTheDocument();
    });

    test('progress가 100 초과이면 width를 100%로 제한', () => {
        const { container } = render(
            <BoongSlot active={true} progress={120} onClick={mockOnClick} />,
        );
        const bar = container.querySelector('[style]');
        expect(bar).toHaveStyle({ width: '100%' });
    });

    test('클릭 시 onClick 호출', () => {
        render(<BoongSlot active={true} progress={50} onClick={mockOnClick} />);
        fireEvent.click(screen.getByRole('button'));
        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    test('Enter 키 입력 시 onClick 호출', () => {
        render(<BoongSlot active={true} progress={50} onClick={mockOnClick} />);
        fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' });
        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    test('Space 키 입력 시 onClick 호출', () => {
        render(<BoongSlot active={true} progress={50} onClick={mockOnClick} />);
        fireEvent.keyDown(screen.getByRole('button'), { key: ' ' });
        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    test('기타 키 입력 시 onClick 미호출', () => {
        render(<BoongSlot active={true} progress={50} onClick={mockOnClick} />);
        fireEvent.keyDown(screen.getByRole('button'), { key: 'Tab' });
        expect(mockOnClick).not.toHaveBeenCalled();
    });

    test('label prop → aria-label 설정', () => {
        render(
            <BoongSlot active={false} progress={0} onClick={mockOnClick} label="슬롯 1" />,
        );
        expect(screen.getByRole('button', { name: '슬롯 1' })).toBeInTheDocument();
    });

    test('활성 상태일 때 computeBodyColor 호출', () => {
        render(<BoongSlot active={true} progress={60} onClick={mockOnClick} />);
        expect(mockComputeBodyColor).toHaveBeenCalledWith(60);
    });

    test('비활성 상태일 때 computeBodyColor 미호출', () => {
        render(<BoongSlot active={false} progress={60} onClick={mockOnClick} />);
        expect(mockComputeBodyColor).not.toHaveBeenCalled();
    });
});
