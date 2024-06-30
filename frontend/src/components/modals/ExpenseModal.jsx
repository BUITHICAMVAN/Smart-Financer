import React, { useEffect, useState } from 'react';
import { Modal, Form, InputNumber, DatePicker, Select } from 'antd';
import moment from 'moment';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { getExpenseTypeId, getExpenseTypeName } from '../../utils/mapping/ExpenseTypeMapping';
import useTransaction from '../../customHooks/TransactionHook';
import { calculateTotalAmount } from '../../utils/calculate/totalAmount';
import { useEssentialExpensesAmount, useNonEssentialExpensesAmount } from '../../utils/calculate/totalCurrentExpense';
import { fetchCurrentMonthExpensesByTypeAsync } from '../../reducers/ExpenseReducer';
import { getUserPercentAsync } from '../../reducers/UserReducer';

const ExpenseModal = ({ open, onCreate, onCancel, onEdit, initialData }) => {
  const dispatch = useDispatch()
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const { fetchTransactions: fetchIncomes, fetchMonthlyTransaction } = useTransaction('incomes')
  const expenseTypes = useSelector(state => state.expenseTypeReducer.expenseTypes);
  const currentMonthTransactions = useSelector(state => state.transactionReducer.currentMonthTransactions);
  const customPercent = useSelector(state => state.userReducer.customPercent);

  // current month income
  const incomes = currentMonthTransactions.incomes || [];
  const currentMonthIncome = calculateTotalAmount(incomes, 'income_amount');

  //current expenses
  const totalEssentialSpent = useEssentialExpensesAmount();
  const totalNonEssentialSpent = useNonEssentialExpensesAmount();

  const maxNeedsAmount = (currentMonthIncome * customPercent.needPercent) / 100;
  const maxWantsAmount = (currentMonthIncome * customPercent.wantPercent) / 100;

  const needBalance = maxNeedsAmount - totalEssentialSpent
  const wantBalance = maxWantsAmount - totalNonEssentialSpent

  const handleOk = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();
      const expenseTypeId = getExpenseTypeId(values.expense_type_name, expenseTypes);
      const transformedValues = {
        ...values,
        expense_type_id: expenseTypeId,
        expense_created_at: values.expense_created_at.format('YYYY-MM-DD')
      };
      delete transformedValues.expense_type_name;
      if (initialData) {
        onEdit(initialData.expense_id, transformedValues);
      } else {
        onCreate(transformedValues);
      }
    } catch (error) {
      console.log('Validate Failed:', error);
    } finally {
      setLoading(false);
      onCancel();
    }
  };

  useEffect(() => {
    if (open) {
      if (initialData) { // if it has data
        const expenseTypeName = getExpenseTypeName(initialData.expense_type_id, expenseTypes);
        form.setFieldsValue({
          expense_category: initialData.expense_category,
          expense_amount: initialData.expense_amount,
          expense_type_name: expenseTypeName,
          expense_created_at: moment(initialData.expense_created_at)
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          expense_created_at: moment()
        });
      }
    }
  }, [open, initialData, form, expenseTypes]);

  useEffect(() => {
    fetchIncomes()
  }, [])


  useEffect(() => {
    dispatch(getUserPercentAsync());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchCurrentMonthExpensesByTypeAsync())
  }, [totalEssentialSpent, totalNonEssentialSpent])

  useEffect(() => {
    fetchMonthlyTransaction();
  }, [])



  return (
    <ExpenseModalStyled>
      <Modal
        open={open}
        title={initialData ? 'Edit Expense' : 'Add Expense'}
        okText={initialData ? 'Save' : 'Add'}
        cancelText="Close"
        onCancel={onCancel}
        onOk={handleOk}
        confirmLoading={loading}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            expense_created_at: moment(),
            expense_category: '',
            expense_amount: 0,
            expense_type_name: ''
          }}
        >
          <Form.Item
            name="expense_amount"
            label="Amount"
            rules={[{ required: true, message: 'Please input the amount!' }]}
          >
            <InputNumber
              prefix="$"
              placeholder="Enter amount"
              style={{ width: '100%' }}
              max={form.getFieldValue('expense_type_name') === 'Needs' ? needBalance : wantBalance}
            />
          </Form.Item>
          <BalanceRow>
              <BalanceLabel>Needs Balance: <span>${needBalance.toFixed(2)}</span></BalanceLabel>
              <BalanceLabel>Wants Balance: <span>${wantBalance.toFixed(2)}</span></BalanceLabel>
            </BalanceRow>
          <Form.Item
            name="expense_type_name"
            label="Expense Type"
            rules={[{ required: true, message: 'Please select the type!' }]}
          >
            <Select
              showSearch
              placeholder="Select a type"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {expenseTypes.map((item) => (
                <Select.Option key={item.expense_type_id} value={item.expense_type_name}>
                  {item.expense_type_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="expense_created_at"
            label="Date"
            rules={[{ required: true, message: 'Please select the date!' }]}
          >
            <DatePicker
              style={{ width: '100%' }}
              format="YYYY-MM-DD"
              disabledDate={(current) => current && current > moment().endOf('day')}
            />
          </Form.Item>
        </Form>
      </Modal>
    </ExpenseModalStyled>
  );
};

export default ExpenseModal;

const ExpenseModalStyled = styled.div``;

const BalanceRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const BalanceLabel = styled.div`
  font-weight: bold;
  span {
    margin-left: 5px;
    color: var(--color-yellow);
  }
`;
