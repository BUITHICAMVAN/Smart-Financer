// Utility function to calculate the total amount
export const calculateTotalAmount = (transaction, key) => {
    return transaction.reduce((total, transaction) => {
        // Ensure the amount is a number, defaulting to 0 if it's not
        const amount = parseFloat(transaction[key]) || 0
        return total + amount
    }, 0)
}
