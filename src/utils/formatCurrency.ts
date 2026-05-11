export const formatCurrency = (amount: number, currency: string) => {

    // Intl.NumberFormat object enables language-sensitive number formatting
    return new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency
    }).format(amount)
}