import { memo, useId, type RefObject } from 'react';

interface NicknameInputProps {
    value: string;
    onChange: (value: string) => void;
    inputRef: RefObject<HTMLInputElement | null>;
}

export const NicknameInput = memo<NicknameInputProps>(({
    value,
    onChange,
    inputRef,
}) => {
    const inputId = useId();

    return (
        <div className="flex w-full max-w-xs flex-col gap-2">
            <label htmlFor={inputId} className="text-sm font-bold text-white/70">닉네임</label>
            <input
                id={inputId}
                ref={inputRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                maxLength={12}
                placeholder="닉네임을 입력하세요"
                className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-center text-lg font-bold text-white placeholder:text-white/30 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400/30"
            />
        </div>
    );
});

NicknameInput.displayName = 'NicknameInput';
