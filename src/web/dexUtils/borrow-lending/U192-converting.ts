import { BN } from '@project-serum/anchor';

type U192 = [BN, BN, BN];
const ONE_WAD = new BN(10).pow(new BN(18));

export function numberToU192(n: number): U192 {
    if (n < 0) {
        throw new Error('u192 is unsigned, number cannot be less than zero');
    }

    const wad = n < 1 ? ONE_WAD.div(new BN(1 / n)) : ONE_WAD.mul(new BN(n));
    const bytes = wad.toArray('le', 3 * 8); // 3 * u64

    const nextU64 = () => new BN(bytes.splice(0, 8), 'le');
    return [nextU64(), nextU64(), nextU64()];
}

export function u192ToBN(u192: U192 | BN[] | { u192: U192 | BN[] }): BN {
    // flatten the input
    u192 = Array.isArray(u192) ? u192 : u192.u192;

    if (u192.length !== 3) {
        throw new Error('u192 must have exactly 3 u64 BN');
    }

    const ordering = 'le';
    return new BN(
        [
            ...u192[0].toArray(ordering, 8),
            ...u192[1].toArray(ordering, 8),
            ...u192[2].toArray(ordering, 8),
        ],
        ordering
    );
}

export function toNumberWithDecimals(bigNumber: number, decimalsNumber: number): string {
    const x = bigNumber;
    const y = x / Math.pow(10, 18);
    return (y).toFixed(y % 1 !== 0 ? decimalsNumber : 0);
}

export function removeTrailingZeros(value) {
    // if not containing a dot, we do not need to do anything
    if (value.indexOf('.') === -1) {
        return value;
    }

    // as long as the last character is a 0 or a dot, remove it
    while((value.slice(-1) === '0' || value.slice(-1) === '.') && value.indexOf('.') !== -1) {
        value = value.substr(0, value.length - 1);
    }
    return value;
}
