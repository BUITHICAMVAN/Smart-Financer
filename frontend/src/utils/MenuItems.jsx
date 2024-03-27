import {categories, dashboard, expenses, income, piggy} from '../utils/Icons'

export const menuItems = [
    {
        id: 1,
        title: 'Dashboard',
        icon: dashboard,
        link: '/dashboard-page'
    },
    {
        id: 2,
        title: "Category",
        icon: categories,
        link: "/category-page",
    },
    {
        id: 3,
        title: "Incomes",
        icon: income,
        link: "/income-page",
    },
    {
        id: 4,
        title: "Expenses",
        icon: expenses,
        link: "/expense-page",
    },
    {
        id: 5,
        title: "Savings",
        icon: piggy,
        link: "/saving-page",
    }
]
