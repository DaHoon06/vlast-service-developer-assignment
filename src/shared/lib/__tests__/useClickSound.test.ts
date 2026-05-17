import { renderHook, act } from '@testing-library/react';
import { useClickSound, __resetForTesting__ } from '../useClickSound';

const mockBufferSourceStart = jest.fn();
const mockBufferSourceConnect = jest.fn();
const mockGainConnect = jest.fn();
const mockClose = jest.fn();
const mockResume = jest.fn();
const mockDecodeAudioData = jest.fn();
const mockCreateBufferSource = jest.fn();
const mockCreateGain = jest.fn();

function makeAudioContext(state: AudioContextState = 'running') {
    return jest.fn().mockImplementation(() => ({
        state,
        resume: mockResume,
        close: mockClose,
        decodeAudioData: mockDecodeAudioData,
        createBufferSource: mockCreateBufferSource,
        createGain: mockCreateGain,
        destination: {},
    }));
}

function setupMocks(state: AudioContextState = 'running') {
    global.AudioContext = makeAudioContext(state) as unknown as typeof AudioContext;
    global.fetch = jest.fn().mockResolvedValue({
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
    }) as jest.Mock;
    mockCreateBufferSource.mockReturnValue({
        buffer: null,
        connect: mockBufferSourceConnect,
        start: mockBufferSourceStart,
    });
    mockCreateGain.mockReturnValue({
        gain: { value: 0 },
        connect: mockGainConnect,
    });
    mockDecodeAudioData.mockResolvedValue({} as AudioBuffer);
}

describe('useClickSound', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        setupMocks();
        __resetForTesting__();
    });

    test('마운트 시 AudioContext 생성', () => {
        renderHook(() => useClickSound());
        expect(AudioContext).toHaveBeenCalledTimes(1);
    });

    test('마운트 시 오디오 파일 fetch', async () => {
        renderHook(() => useClickSound('/effects/click.mp3'));
        await act(async () => {});
        expect(global.fetch).toHaveBeenCalledWith('/effects/click.mp3');
    });

    test('언마운트 시 AudioContext close 호출', () => {
        const { unmount } = renderHook(() => useClickSound());
        unmount();
        expect(mockClose).toHaveBeenCalledTimes(1);
    });

    test('buffer가 없으면 playClick 호출 시 아무것도 안 함', () => {
        const { result } = renderHook(() => useClickSound());
        act(() => {
            result.current();
        });
        expect(mockBufferSourceStart).not.toHaveBeenCalled();
    });

    test('buffer 로드 후 playClick 시 createBufferSource 및 start 호출', async () => {
        const { result } = renderHook(() => useClickSound());
        await act(async () => {});
        act(() => {
            result.current();
        });
        expect(mockCreateBufferSource).toHaveBeenCalled();
        expect(mockBufferSourceStart).toHaveBeenCalled();
    });

    test('buffer 로드 후 playClick 시 gain 0.15 설정', async () => {
        const mockGainNode = { gain: { value: 0 }, connect: mockGainConnect };
        mockCreateGain.mockReturnValue(mockGainNode);
        const { result } = renderHook(() => useClickSound());
        await act(async () => {});
        act(() => {
            result.current();
        });
        expect(mockGainNode.gain.value).toBe(0.15);
    });

    test('컨텍스트가 suspended 상태이면 resume 호출', async () => {
        __resetForTesting__();
        global.AudioContext = makeAudioContext('suspended');

        const { result } = renderHook(() => useClickSound());
        await act(async () => {});
        act(() => {
            result.current();
        });

        expect(mockResume).toHaveBeenCalled();
    });

    test('커스텀 src로 fetch 호출', async () => {
        renderHook(() => useClickSound('/custom/sound.mp3'));
        await act(async () => {});
        expect(global.fetch).toHaveBeenCalledWith('/custom/sound.mp3');
    });
});
