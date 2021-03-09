export interface SignUpValues {
    username: string;
    password: string;
    confirmPassword: string;
}

export interface SignUpFields {
    username: HTMLInputElement | null;
    password: HTMLInputElement | null;
    confirmPassword: HTMLInputElement | null;
}