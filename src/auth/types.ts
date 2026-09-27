export type User = { id: string; name: string; email: string };
export type LoginInput = { email: string; password: string };
export type SignupInput = LoginInput & { name: string };
export type FieldErrors = Partial<Record<keyof SignupInput, string>>;
