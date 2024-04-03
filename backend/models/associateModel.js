const User = require('./userModel');
const Account = require('./accountModel');
const Income = require('./income/incomeModel');
const IncomeType = require('./income/incomeTypeModel');
const Saving = require('./saving/savingModel');
const SavingType = require('./saving/savingTypeModel');
const Expense = require('./expense/expenseModel');
const ExpenseType = require('./expense/expenseTypeModel');
const SystemSettings = require('./systemSettingModel')

// User and Account
User.hasMany(Account, { foreignKey: 'account_user_id' });
Account.belongsTo(User, { foreignKey: 'account_user_id' });

// User and Income
User.hasMany(Income, { foreignKey: 'income_user_id' });
Income.belongsTo(User, { foreignKey: 'income_user_id' });

// IncomeType and Income
IncomeType.hasMany(Income, { foreignKey: 'income_type_id' });
Income.belongsTo(IncomeType, { foreignKey: 'income_type_id' });

// User and Saving
User.hasMany(Saving, { foreignKey: 'saving_user_id' });
Saving.belongsTo(User, { foreignKey: 'saving_user_id' });

// SavingType and Saving
SavingType.hasMany(Saving, { foreignKey: 'saving_type_id' });
Saving.belongsTo(SavingType, { foreignKey: 'saving_type_id' });

// User and Expense
User.hasMany(Expense, { foreignKey: 'expense_user_id' });
Expense.belongsTo(User, { foreignKey: 'expense_user_id' });

// ExpenseType and Expense
ExpenseType.hasMany(Expense, { foreignKey: 'expense_type_id' });
Expense.belongsTo(ExpenseType, { foreignKey: 'expense_type_id' });

// Associate User with SystemSettings
User.hasOne(SystemSettings, { foreignKey: 'user_id' });
SystemSettings.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
  User,
  Account,
  Income,
  IncomeType,
  Saving,
  SavingType,
  Expense,
  ExpenseType
};
