

export function formatPhoneNumber(phone: string): string {
    return `(${phone.slice(0, 3)})-${phone.slice(3, 6)}-${phone.slice(6)}`;
}