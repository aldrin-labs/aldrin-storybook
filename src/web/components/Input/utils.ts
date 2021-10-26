const doubleRegexp = /^\d+(\.?)\d{0,}$/;

export const validateDecimal = (v: string) => {
    const isNumber = !!v.match(doubleRegexp);
    if (!isNumber) {
        return false;
    }
    return true;
}