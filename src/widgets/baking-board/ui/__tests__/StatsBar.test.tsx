import { render, screen } from '@testing-library/react';

import { StatsBar } from '../StatsBar';

const defaultProps = { score: 0, timer: 60, speed: 1.2, diffLevel: 1, showDiffUp: false };

describe('StatsBar', () => {
    test('점수 표시', () => {
        render(<StatsBar {...defaultProps} score={350} />);
        expect(screen.getByText('350')).toBeInTheDocument();
    });

    test('타이머를 mm:ss 형식으로 표시', () => {
        render(<StatsBar {...defaultProps} timer={75} />);
        expect(screen.getByText('01:15')).toBeInTheDocument();
    });

    test('타이머 앞자리 0 포함 표시 (timer=5)', () => {
        render(<StatsBar {...defaultProps} timer={5} />);
        expect(screen.getByText('00:05')).toBeInTheDocument();
    });

    test('timer가 10 이하이면 긴박한 스타일 적용', () => {
        render(<StatsBar {...defaultProps} timer={10} />);
        const timerEl = screen.getByText('00:10');
        expect(timerEl.className).toContain('text-red-400');
        expect(timerEl.className).toContain('animate-pulse');
    });

    test('timer가 10 초과이면 일반 스타일 적용', () => {
        render(<StatsBar {...defaultProps} timer={30} />);
        const timerEl = screen.getByText('00:30');
        expect(timerEl.className).toContain('text-white');
        expect(timerEl.className).not.toContain('text-red-400');
    });

    test('속도를 소수점 1자리로 표시', () => {
        render(<StatsBar {...defaultProps} speed={1.567} />);
        expect(screen.getByText('1.6')).toBeInTheDocument();
    });

    test('diffLevel이 1 초과이고 showDiffUp=false이면 난이도 표시', () => {
        render(<StatsBar {...defaultProps} diffLevel={2} showDiffUp={false} />);
        expect(screen.getByText('Lv.2')).toBeInTheDocument();
    });

    test('diffLevel이 1 이하이면 난이도 표시 숨김', () => {
        render(<StatsBar {...defaultProps} diffLevel={1} showDiffUp={false} />);
        expect(screen.queryByText(/Lv\./)).toBeNull();
    });

    test('showDiffUp=true이면 UP 뱃지 표시', () => {
        render(<StatsBar {...defaultProps} diffLevel={3} showDiffUp={true} />);
        expect(screen.getByText(/Lv\.3 UP!/)).toBeInTheDocument();
    });
});
