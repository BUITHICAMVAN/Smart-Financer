import React from 'react'

const TypeMapping = {
  incomes: 'income',
  savings: 'saving',
  expenses: 'expense',
  nonEssentials: 'non-essential',
  Essentials: 'essential'
}

const getTransactionTypeApi = (type) => TypeMapping[type] || type

export { TypeMapping, getTransactionTypeApi }