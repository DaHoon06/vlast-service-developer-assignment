type HarvestResult = {
    gain: number;
    text: string;
    color: string;
    good: boolean;
};

export const calcHarvest = (progress: number, combo: number): HarvestResult => {
    if (progress < 40) return { gain: -10, text: '덜 익음', color: '#aaaaaa', good: false };
    if (progress < 75) return { gain: 50, text: '좋아요!', color: '#ffd700', good: true };
    if (progress < 92)
        return { gain: 100 + combo * 10, text: 'PERFECT!!', color: '#00ffcc', good: true };
    if (progress < 100) return { gain: -30, text: '타기 시작!', color: '#ff6666', good: false };
    return { gain: -100, text: '숯덩이ㅠㅠ', color: '#888888', good: false };
}
