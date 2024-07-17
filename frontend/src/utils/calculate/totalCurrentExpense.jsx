import { useSelector } from "react-redux";

export const useEssentialExpensesAmount = () => {
    const essentialExpenses = useSelector(state => state.expenseReducer.currentMonthEssentialExpenses);

    const totalEssentialSpent = essentialExpenses.reduce((sum, expense) => sum + parseFloat(expense.expense_amount), 0);

    return totalEssentialSpent;
};

export const useNonEssentialExpensesAmount = () => {
    const nonEssentialExpenses = useSelector(state => state.expenseReducer.currentMonthNonEssentialExpenses);

    const totalNonEssentialSpent = nonEssentialExpenses.reduce((sum, expense) => sum + parseFloat(expense.expense_amount), 0);

    return totalNonEssentialSpent;
};
