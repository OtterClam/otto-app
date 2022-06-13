export const numberWithSign = (n: number) => (n >= 0 ? '+' : '-') + Math.abs(n)

export const numberWithDirection = (n: number) => (n >= 0 ? '↑' : '↓') + Math.abs(n)
