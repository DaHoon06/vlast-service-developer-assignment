import type { MeResponse } from '../api/get-me';

// Private Type
type _Me = NonNullable<MeResponse>;

export type User = MeResponse;

export type CurrentUser = {
    id: _Me['id'];
    name: _Me['name'];
    character: _Me['character']['memberId'];
};
