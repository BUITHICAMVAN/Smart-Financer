var DataTypes = require("sequelize").DataTypes;
var _account = require("./account");
var _budget = require("./budget");
var _budget_type = require("./budget_type");
var _due = require("./due");
var _due_status = require("./due_status");
var _due_type = require("./due_type");
var _expense = require("./expense");
var _expense_category = require("./expense_category");
var _expense_type = require("./expense_type");
var _forecast = require("./forecast");
var _income = require("./income");
var _income_type = require("./income_type");
var _saving = require("./saving");
var _saving_type = require("./saving_type");
var _user = require("./user");

function initModels(sequelize) {
  var account = _account(sequelize, DataTypes);
  var budget = _budget(sequelize, DataTypes);
  var budget_type = _budget_type(sequelize, DataTypes);
  var due = _due(sequelize, DataTypes);
  var due_status = _due_status(sequelize, DataTypes);
  var due_type = _due_type(sequelize, DataTypes);
  var expense = _expense(sequelize, DataTypes);
  var expense_category = _expense_category(sequelize, DataTypes);
  var expense_type = _expense_type(sequelize, DataTypes);
  var forecast = _forecast(sequelize, DataTypes);
  var income = _income(sequelize, DataTypes);
  var income_type = _income_type(sequelize, DataTypes);
  var saving = _saving(sequelize, DataTypes);
  var saving_type = _saving_type(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);

  budget.belongsTo(budget_type, { as: "budget_budget_type", foreignKey: "budget_budget_type_id"});
  budget_type.hasMany(budget, { as: "budgets", foreignKey: "budget_budget_type_id"});
  due.belongsTo(due_status, { as: "due_status", foreignKey: "due_status_id"});
  due_status.hasMany(due, { as: "dues", foreignKey: "due_status_id"});
  due.belongsTo(due_type, { as: "due_type", foreignKey: "due_type_id"});
  due_type.hasMany(due, { as: "dues", foreignKey: "due_type_id"});
  expense_type.belongsTo(expense_category, { as: "expense_category", foreignKey: "expense_category_id"});
  expense_category.hasMany(expense_type, { as: "expense_types", foreignKey: "expense_category_id"});
  expense.belongsTo(expense_type, { as: "expense_type", foreignKey: "expense_type_id"});
  expense_type.hasMany(expense, { as: "expenses", foreignKey: "expense_type_id"});
  income.belongsTo(income_type, { as: "income_type", foreignKey: "income_type_id"});
  income_type.hasMany(income, { as: "incomes", foreignKey: "income_type_id"});
  saving.belongsTo(saving_type, { as: "saving_type", foreignKey: "saving_type_id"});
  saving_type.hasMany(saving, { as: "savings", foreignKey: "saving_type_id"});
  account.belongsTo(user, { as: "account_user", foreignKey: "account_user_id"});
  user.hasMany(account, { as: "accounts", foreignKey: "account_user_id"});
  budget.belongsTo(user, { as: "budget_user", foreignKey: "budget_user_id"});
  user.hasMany(budget, { as: "budgets", foreignKey: "budget_user_id"});
  due.belongsTo(user, { as: "due_user", foreignKey: "due_user_id"});
  user.hasMany(due, { as: "dues", foreignKey: "due_user_id"});
  expense.belongsTo(user, { as: "expense_user", foreignKey: "expense_user_id"});
  user.hasMany(expense, { as: "expenses", foreignKey: "expense_user_id"});
  forecast.belongsTo(user, { as: "forecast_user", foreignKey: "forecast_user_id"});
  user.hasMany(forecast, { as: "forecasts", foreignKey: "forecast_user_id"});
  income.belongsTo(user, { as: "income_user", foreignKey: "income_user_id"});
  user.hasMany(income, { as: "incomes", foreignKey: "income_user_id"});
  saving.belongsTo(user, { as: "saving_user", foreignKey: "saving_user_id"});
  user.hasMany(saving, { as: "savings", foreignKey: "saving_user_id"});

  return {
    account,
    budget,
    budget_type,
    due,
    due_status,
    due_type,
    expense,
    expense_category,
    expense_type,
    forecast,
    income,
    income_type,
    saving,
    saving_type,
    user,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
