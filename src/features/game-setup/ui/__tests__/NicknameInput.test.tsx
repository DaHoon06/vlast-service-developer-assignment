import { createRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { NicknameInput } from '../NicknameInput';

const mockRef = createRef<HTMLInputElement>();
const mockOnChange = jest.fn();

const defaultProps = {
    value: '',
    onChange: mockOnChange,
    inputRef: mockRef,
};

describe('NicknameInput', () => {
    beforeEach(() => jest.clearAllMocks());

    test('"닉네임" label 렌더', () => {
        render(<NicknameInput {...defaultProps} />);
        expect(screen.getByText('닉네임')).toBeInTheDocument();
    });

    test('label과 input이 연결됨 (htmlFor)', () => {
        render(<NicknameInput {...defaultProps} />);
        expect(screen.getByLabelText('닉네임')).toBeInTheDocument();
    });

    test('value가 input에 표시', () => {
        render(<NicknameInput {...defaultProps} value="테스트닉" />);
        expect(screen.getByDisplayValue('테스트닉')).toBeInTheDocument();
    });

    test('maxLength가 12', () => {
        render(<NicknameInput {...defaultProps} />);
        expect(screen.getByRole('textbox')).toHaveAttribute('maxLength', '12');
    });

    test('입력 시 onChange에 새 값 전달', () => {
        render(<NicknameInput {...defaultProps} />);
        fireEvent.change(screen.getByRole('textbox'), { target: { value: '새닉네임' } });
        expect(mockOnChange).toHaveBeenCalledWith('새닉네임');
    });

    test('placeholder 표시', () => {
        render(<NicknameInput {...defaultProps} />);
        expect(screen.getByPlaceholderText('닉네임을 입력하세요')).toBeInTheDocument();
    });

    test('빈 값 입력 시 onChange에 빈 문자열 전달', () => {
        render(<NicknameInput {...defaultProps} value="기존값" />);
        fireEvent.change(screen.getByRole('textbox'), { target: { value: '' } });
        expect(mockOnChange).toHaveBeenCalledWith('');
    });
});
