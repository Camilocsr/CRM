export interface DecodedCredential {
    email: string;
}

export interface GoogleAuthProps {
    setEmail: (email: string) => void;
}