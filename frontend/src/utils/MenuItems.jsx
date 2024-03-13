import {categories, dashboard, expenses, piggy, transactions, trend} from '../utils/Icons'

export const menuItems = [
    {
        id: 1,
        title: 'Dashboard',
        icon: dashboard,
        link: '/dashboard'
    },
    {
        id: 2,
        title: "Category",
        icon: categories,
        link: "/category",
    },
    {
        id: 3,
        title: "Incomes",
        icon: trend,
        link: "/income",
    },
    {
        id: 4,
        title: "Expenses",
        icon: expenses,
        link: "/expenses",
    },
    {
        id: 5,
        title: "Savings",
        icon: piggy,
        link: "/saving",
    },
]

export const accountItems = [
    {
        id: 1,
        title: 'Customize',
        icon: dashboard,
        link: '/customize'
    },
    {
        id: 2,
        title: "Overview",
        icon: transactions,
        link: "/overview",
    },
    {
        id: 3,
        title: "About",
        icon: trend,
        link: "/about",
    },
    {
        id: 4,
        title: "Help",
        icon: expenses,
        link: "/help",
    },
]