import { useMemo } from "react";
import { useSelector } from "react-redux";

export const useEssentialExpensesAmount = () => {
    const essentialExpenses = useSelector(state => state.expenseReducer.currentMonthEssentialExpenses);

    const totalEssentialSpent = useMemo(() => {
        return essentialExpenses.reduce((sum, expense) => sum + parseFloat(expense.expense_amount), 0);
    }, [essentialExpenses]);

    return totalEssentialSpent;
};

export const useNonEssentialExpensesAmount = () => {
    const nonEssentialExpenses = useSelector(state => state.expenseReducer.currentMonthNonEssentialExpenses);

    const totalNonEssentialSpent = useMemo(() => {
        return nonEssentialExpenses.reduce((sum, expense) => sum + parseFloat(expense.expense_amount), 0);
    }, [nonEssentialExpenses]);

    return totalNonEssentialSpent;
};