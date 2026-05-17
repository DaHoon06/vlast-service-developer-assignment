import { render, screen, fireEvent } from '@testing-library/react';
import { GameOverModal } from '../GameOverModal';
import { ROUTES } from '@/shared/routes';

const mockPush = jest.fn();
const mockClearFinalScore = jest.fn();
const mockSetPendingGameAction = jest.fn();
let mockFinalScore: number | null = null;

jest.mock('@/shared/lib', () => ({
    useNavigation: () => ({ push: mockPush }),
}));

jest.mock('@/shared/model', () => ({
    useGameStore: () => ({
        finalScore: mockFinalScore,
        clearFinalScore: mockClearFinalScore,
        setPendingGameAction: mockSetPendingGameAction,
    }),
}));

jest.mock('../RankingModal', () => ({
    RankingModal: ({ onHome, onRestart }: { onHome: () => void; onRestart: () => void }) => (
        <div>
            <button onClick={onHome}>처음으로</button>
            <button onClick={onRestart}>다시 시작</button>
        </div>
    ),
}));

describe('GameOverModal', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockFinalScore = null;
    });

    test('finalScore가 null이면 렌더링 없음', () => {
        mockFinalScore = null;
        const { container } = render(<GameOverModal />);
        expect(container).toBeEmptyDOMElement();
    });

    test('finalScore가 있으면 모달 렌더링', () => {
        mockFinalScore = 300;
        render(<GameOverModal />);
        expect(screen.getByText('처음으로')).toBeInTheDocument();
        expect(screen.getByText('다시 시작')).toBeInTheDocument();
    });

    test('finalScore=0이면 모달 렌더링 (0점도 유효한 게임 종료)', () => {
        mockFinalScore = 0;
        render(<GameOverModal />);
        expect(screen.getByText('처음으로')).toBeInTheDocument();
    });

    test('처음으로 클릭 시 clearFinalScore 호출 후 홈("/") 이동', () => {
        mockFinalScore = 200;
        render(<GameOverModal />);

        fireEvent.click(screen.getByText('처음으로'));

        expect(mockClearFinalScore).toHaveBeenCalledTimes(1);
        expect(mockPush).toHaveBeenCalledWith(ROUTES.HOME);
    });

    test('다시 시작 클릭 시 setPendingGameAction("restart") 및 clearFinalScore 호출', () => {
        mockFinalScore = 150;
        render(<GameOverModal />);

        fireEvent.click(screen.getByText('다시 시작'));

        expect(mockSetPendingGameAction).toHaveBeenCalledWith('restart');
        expect(mockClearFinalScore).toHaveBeenCalledTimes(1);
    });

    test('다시 시작 클릭 시 push 미호출', () => {
        mockFinalScore = 100;
        render(<GameOverModal />);

        fireEvent.click(screen.getByText('다시 시작'));

        expect(mockPush).not.toHaveBeenCalled();
    });
});
