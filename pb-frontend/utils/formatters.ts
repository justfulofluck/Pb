export const formatPrice = (price: number | null | undefined): string => {
    if (price === null || price === undefined) return 'Rs. 0.00';
    return `Rs. ${price.toFixed(2)}`;
};
