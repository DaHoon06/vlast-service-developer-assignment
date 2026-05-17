import { render, screen, fireEvent } from '@testing-library/react';
import { CharacterSelector } from '../CharacterSelector';

window.HTMLElement.prototype.scrollIntoView = jest.fn();

jest.mock('@/shared/lib/useClickSound', () => ({
    useClickSound: () => jest.fn(),
}));

type MotionDivProps = React.ComponentPropsWithoutRef<'div'> & Record<string, unknown>;
type MotionButtonProps = React.ComponentPropsWithoutRef<'button'> & Record<string, unknown>;
type MotionImgProps = React.ComponentPropsWithoutRef<'img'> & Record<string, unknown>;

const MOTION_PROPS = new Set([
    'animate', 'initial', 'exit', 'variants', 'transition',
    'whileHover', 'whileTap', 'whileFocus', 'whileDrag', 'whileInView',
    'onAnimationStart', 'onAnimationComplete', 'layout', 'layoutId',
    'drag', 'dragConstraints', 'dragElastic', 'dragMomentum',
]);

function stripMotionProps<T extends Record<string, unknown>>(props: T) {
    return Object.fromEntries(Object.entries(props).filter(([k]) => !MOTION_PROPS.has(k)));
}

jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...rest }: MotionDivProps) => (
            <div {...stripMotionProps(rest)}>{children}</div>
        ),
        button: ({ children, onClick, ...rest }: MotionButtonProps) => (
            <button onClick={onClick} {...stripMotionProps(rest)}>
                {children}
            </button>
        ),
        p: ({ children, ...rest }: MotionDivProps) => <p {...stripMotionProps(rest)}>{children}</p>,
        img: (props: MotionImgProps) => {
            const { src, alt, className, loading, ...rest } = props;
            return (
                <img
                    src={src as string}
                    alt={alt as string}
                    className={className as string}
                    loading={loading as 'eager' | 'lazy'}
                    {...stripMotionProps(rest)}
                />
            );
        },
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const characters = [
    { memberId: 1, name: '예준', profile: 'https://img.com/1.jpg', color: '#FF0000' },
    { memberId: 2, name: '노아', profile: 'https://img.com/2.jpg', color: '#00FF00' },
    { memberId: 3, name: '밤비', profile: 'https://img.com/3.jpg', color: '#0000FF' },
    { memberId: 4, name: '은호', profile: 'https://img.com/4.jpg', color: '#00FF00' },
    { memberId: 5, name: '하민', profile: 'https://img.com/5.jpg', color: '#0000FF' },
];

describe('CharacterSelector', () => {
    const mockOnSelect = jest.fn();

    beforeEach(() => jest.clearAllMocks());

    test('모든 캐릭터 이름 렌더링', () => {
        render(
            <CharacterSelector characters={characters} selectedIdx={0} onSelect={mockOnSelect} />,
        );
        expect(screen.getByText('예준')).toBeInTheDocument();
        expect(screen.getByText('노아')).toBeInTheDocument();
        expect(screen.getByText('밤비')).toBeInTheDocument();
        expect(screen.getByText('은호')).toBeInTheDocument();
        expect(screen.getByText('하민')).toBeInTheDocument();
    });

    test('선택된 캐릭터의 aria-selected=true', () => {
        render(
            <CharacterSelector characters={characters} selectedIdx={1} onSelect={mockOnSelect} />,
        );
        const options = screen.getAllByRole('option');
        expect(options[0]).toHaveAttribute('aria-selected', 'false');
        expect(options[1]).toHaveAttribute('aria-selected', 'true');
        expect(options[2]).toHaveAttribute('aria-selected', 'false');
    });

    test('캐릭터 클릭 시 해당 인덱스로 onSelect 호출', () => {
        render(
            <CharacterSelector characters={characters} selectedIdx={0} onSelect={mockOnSelect} />,
        );
        fireEvent.click(screen.getAllByRole('option')[2]);
        expect(mockOnSelect).toHaveBeenCalledWith(2);
    });

    test('첫 번째 캐릭터 클릭 시 index 0으로 onSelect 호출', () => {
        render(
            <CharacterSelector characters={characters} selectedIdx={2} onSelect={mockOnSelect} />,
        );
        fireEvent.click(screen.getAllByRole('option')[0]);
        expect(mockOnSelect).toHaveBeenCalledWith(0);
    });

    test('선택된 캐릭터 이름 "{name} 선택됨" 표시', () => {
        render(
            <CharacterSelector characters={characters} selectedIdx={2} onSelect={mockOnSelect} />,
        );
        expect(screen.getByText('밤비 선택됨')).toBeInTheDocument();
    });

    test('listbox의 aria-label이 "캐릭터 선택"', () => {
        render(
            <CharacterSelector characters={characters} selectedIdx={0} onSelect={mockOnSelect} />,
        );
        expect(screen.getByRole('listbox', { name: '캐릭터 선택' })).toBeInTheDocument();
    });

    test('캐릭터 이미지 alt가 name과 일치', () => {
        render(
            <CharacterSelector characters={characters} selectedIdx={0} onSelect={mockOnSelect} />,
        );
        expect(screen.getByAltText('예준')).toBeInTheDocument();
        expect(screen.getByAltText('노아')).toBeInTheDocument();
    });

    test('option 개수가 characters 길이와 일치', () => {
        render(
            <CharacterSelector characters={characters} selectedIdx={0} onSelect={mockOnSelect} />,
        );
        expect(screen.getAllByRole('option')).toHaveLength(characters.length);
    });
});
