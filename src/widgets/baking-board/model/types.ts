export type SlotData = { active: boolean; progress: number };
export type FloatMsg = { id: number; text: string; color: string } | null;

export type State = {
    slots: SlotData[];
    floats: FloatMsg[];
    score: number;
    combo: number;
    comboIdleTicks: number;
    timer: number;
    gameTime: number;
    speed: number;
    diffLevel: number;
    over: boolean;
};

export type Action =
    | { type: 'CLICK'; index: number }
    | { type: 'TICK' }
    | { type: 'CLEAR_FLOAT'; index: number; id: number }
    | { type: 'RESTART' };
