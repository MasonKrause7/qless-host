

export function formatPhoneNumber(phone: string | undefined): string {
    if(phone===undefined)
        return "No Phone Number";
    return `(${phone.slice(0, 3)})-${phone.slice(3, 6)}-${phone.slice(6)}`;
}