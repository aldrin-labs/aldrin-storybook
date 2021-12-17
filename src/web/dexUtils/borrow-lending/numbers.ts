export function sub(b: number,c: number) {

    const b1=b.toString().split('.')
    let b1_max=0
    if(b1.length==2)
    {
        b1_max=b1[1].length
    }

    const c1=c.toString().split('.')
    let c1_max=0
    if(c1.length==2)
    {
        c1_max=c1[1].length
    }

    const max_len=b1_max>c1_max?b1_max:c1_max

    return Number((b-c).toFixed(max_len))
}

export const countDecimals = (number: number) => {
    const numberChars = number.toString().split('.');
    console.log(numberChars)
    if(numberChars.length > 1) {
        return numberChars[1].length;
    }
        return 0;
}

export const getMaxDecimalsBetweenNumbers = (number1: number, number2: number) => {
    const decimalsNum1 = countDecimals(number1);
    const decimalsNum2 = countDecimals(number2);
    let maxDecimals = decimalsNum1;

    if(decimalsNum1 <= decimalsNum2) {
        maxDecimals = decimalsNum2;
    }
    return maxDecimals;
}
