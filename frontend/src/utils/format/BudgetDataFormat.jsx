export const formatBudgetingData = (budgets, incomes, savings, expenses) => {
    // Helper function to aggregate amounts by type
    const aggregateAmounts = (items, typeKey, amountKey, isExpense = false) => {
        const aggregated = {}
        items.forEach(item => {
            const typeId = item[typeKey]
            let key = typeId
            if (isExpense) {
                const category = item.ExpenseType.ExpenseCategory.expense_category_name
                key = `${category}-${typeId}`
            }
            if (!aggregated[key]) {
                aggregated[key] = 0
            }
            aggregated[key] += parseFloat(item[amountKey])
        })
        return aggregated
    }

    const aggregatedIncomes = aggregateAmounts(incomes, 'income_type_id', 'income_amount')
    const aggregatedSavings = aggregateAmounts(savings, 'saving_type_id', 'saving_amount')
    const aggregatedExpenses = aggregateAmounts(expenses, 'expense_type_id', 'expense_amount', true)

    // Helper function to get budget amount from budgets
    const getBudgetAmount = (budgets, relatedId, relatedType) => {
        const budget = budgets.find(budget => budget.budget_related_id === relatedId && budget.budget_related_type === relatedType)
        return budget ? parseFloat(budget.budget_amount) : 0
    }

    // Prepare categories
    const incomeCategory = {
        key: 'income',
        category: 'Income',
        children: Object.keys(aggregatedIncomes).map(typeId => ({
            key: typeId,
            category: `Income Type ${typeId}`,
            budget: getBudgetAmount(budgets, parseInt(typeId), 'income'),
            actual: aggregatedIncomes[typeId],
            remaining: getBudgetAmount(budgets, parseInt(typeId), 'income') - aggregatedIncomes[typeId],
        })),
    }

    const savingsCategory = {
        key: 'savings',
        category: 'Savings',
        children: Object.keys(aggregatedSavings).map(typeId => ({
            key: typeId,
            category: `Saving Type ${typeId}`,
            budget: getBudgetAmount(budgets, parseInt(typeId), 'saving'),
            actual: aggregatedSavings[typeId],
            remaining: getBudgetAmount(budgets, parseInt(typeId), 'saving') - aggregatedSavings[typeId],
        })),
    }

    const essentialsCategory = {
        key: 'essentials',
        category: 'Essentials',
        children: Object.keys(aggregatedExpenses).filter(typeId => typeId.startsWith('essentials')).map(typeId => ({
            key: typeId,
            category: `Essential Type ${typeId.split('-')[1]}`,
            budget: getBudgetAmount(budgets, parseInt(typeId.split('-')[1]), 'essential'),
            actual: aggregatedExpenses[typeId],
            remaining: getBudgetAmount(budgets, parseInt(typeId.split('-')[1]), 'essential') - aggregatedExpenses[typeId],
        })),
    }

    const nonEssentialsCategory = {
        key: 'non-essentials',
        category: 'Non-Essentials',
        children: Object.keys(aggregatedExpenses).filter(typeId => typeId.startsWith('non-essentials')).map(typeId => ({
            key: typeId,
            category: `Non-Essential Type ${typeId.split('-')[1]}`,
            budget: getBudgetAmount(budgets, parseInt(typeId.split('-')[1]), 'non-essential'),
            actual: aggregatedExpenses[typeId],
            remaining: getBudgetAmount(budgets, parseInt(typeId.split('-')[1]), 'non-essential') - aggregatedExpenses[typeId],
        })),
    }

    const expensesCategory = {
        key: 'expenses',
        category: 'Expenses',
        children: [essentialsCategory, nonEssentialsCategory],
    }

    // Create the formatted data
    const formattedData = {
        categories: [incomeCategory, expensesCategory, savingsCategory],
    }

    return enhanceData(formattedData)
}

const calculateTotal = (children) => {
    const totalBudget = children.reduce((acc, item) => acc + item.budget, 0)
    const totalActual = children.reduce((acc, item) => acc + item.actual, 0)
    return {
        key: 'total',
        category: 'Total',
        budget: totalBudget,
        actual: totalActual,
        remaining: totalBudget - totalActual,
    }
}

const enhanceData = (data) => {
    return {
        categories: data.categories.map(category => {
            if (category.children) {
                if (category.key === 'expenses') {
                    const essentials = category.children.find(child => child.key === 'essentials')
                    const nonEssentials = category.children.find(child => child.key === 'non-essentials')

                    if (essentials && essentials.children) {
                        if (!essentials.children.some(child => child.key === 'essentials-total')) {
                            const essentialsTotal = calculateTotal(essentials.children)
                            essentials.children.push({
                                ...essentialsTotal,
                                key: 'essentials-total',
                                category: 'Essentials Total',
                            })
                        }
                    }

                    if (nonEssentials && nonEssentials.children) {
                        if (!nonEssentials.children.some(child => child.key === 'non-essentials-total')) {
                            const nonEssentialsTotal = calculateTotal(nonEssentials.children)
                            nonEssentials.children.push({
                                ...nonEssentialsTotal,
                                key: 'non-essentials-total',
                                category: 'Non-Essentials Total',
                            })
                        }
                    }

                    if (essentials && nonEssentials && essentials.children && nonEssentials.children) {
                        if (!category.children.some(child => child.key === 'expenses-total')) {
                            const combinedTotalAmount = calculateTotal([
                                ...essentials.children.filter(child => child.key !== 'essentials-total'),
                                ...nonEssentials.children.filter(child => child.key !== 'non-essentials-total'),
                            ])

                            category.children.push({
                                ...combinedTotalAmount,
                                key: 'expenses-total',
                                category: 'Total Expenses',
                            })
                        }
                    }
                } else if (category.key === 'income' || category.key === 'savings') {
                    const totalAmount = calculateTotal(category.children)
                    return { ...category, children: [...category.children, totalAmount] }
                }
            }
            return category
        })
    }
}
