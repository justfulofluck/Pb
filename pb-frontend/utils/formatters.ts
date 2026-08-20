export const formatPrice = (price: number | string | null | undefined): string => {
    if (price === null || price === undefined) return 'Rs. 0.00';
    const num = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(num)) return 'Rs. 0.00';
    return `Rs. ${num.toFixed(2)}`;
};
