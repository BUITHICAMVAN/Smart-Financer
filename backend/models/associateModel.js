const User = require('./userModel');
const Account = require('./accountModel');
const Income = require('./income/incomeModel');
const IncomeType = require('./income/incomeTypeModel');
const Saving = require('./saving/savingModel');
const SavingType = require('./saving/savingTypeModel');
const Expense = require('./expense/expenseModel');
const ExpenseType = require('./expense/expenseTypeModel');
const SystemSettings = require('./systemSettingModel');
const Due = require('./due/dueModel');
const DueType = require('./due/dueTypeModel')
const DueStatus = require('./due/dueStatusModel');
const ExpenseCategory = require('./expense/expenseCategoryModel');

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

// ExpenseCategory and ExpenseType
ExpenseCategory.hasMany(ExpenseType, { foreignKey: 'expense_category_id' });
ExpenseType.belongsTo(ExpenseCategory, { foreignKey: 'expense_category_id' });

// Associate User with SystemSettings
User.hasOne(SystemSettings, { foreignKey: 'user_id' });
SystemSettings.belongsTo(User, { foreignKey: 'user_id' });

// User and Due - A user can have many dues
User.hasMany(Due, { foreignKey: 'due_user_id' });
Due.belongsTo(User, { foreignKey: 'due_user_id' });

// DueType and Due - A due type can categorize many dues
DueType.hasMany(Due, { foreignKey: 'due_type_id' });
Due.belongsTo(DueType, { foreignKey: 'due_type_id' });

// DueStatus and Due - A due status can be associated with many dues
DueStatus.hasMany(Due, { foreignKey: 'due_status_id' });
Due.belongsTo(DueStatus, { foreignKey: 'due_status_id' });


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
