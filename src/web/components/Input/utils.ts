export const DOUBLE_REGEXP = /^\d+(\.?)\d{0,}$/;

export const validateDecimal = (v: string) => {
    const isNumber = !!v.match(DOUBLE_REGEXP);
    if (!isNumber) {
        return false;
    }
    return true;
}