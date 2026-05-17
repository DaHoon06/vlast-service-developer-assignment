import cn from './cn';
import HttpClient from './http-client';
import { BASE_URL } from '@/shared/config/environments';

const httpClient = new HttpClient(BASE_URL);

export { cn };
export { generateCode } from './generate-code';
export { useDirectionKey } from './useDirectionKey';
export { useClickSound } from './useClickSound';
export { useBgm } from './useBgm';
export { useNavigation } from './use-navigation';
export { contrastTextColor } from './contrast-text-color';

export { httpClient };
