export const formatPrice = (price: number | string | null | undefined): string => {
    if (price === null || price === undefined) return 'Rs. 0';
    const num = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(num)) return 'Rs. 0';
    const fixed = num.toFixed(2);
    const value = fixed.endsWith('.00') ? fixed.slice(0, -3) : fixed;
    return `Rs. ${value}`;
};
