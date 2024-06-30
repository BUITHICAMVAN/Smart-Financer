import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, DatePicker, Select } from 'antd';
import moment from 'moment';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import useTransactionType from '../../customHooks/TransactionTypeHook';
import { getUserPercentAsync } from '../../reducers/UserReducer';
import { calculateTotalAmount } from '../../utils/calculate/totalAmount';
import useTransaction from '../../customHooks/TransactionHook';

const TransactionModal = ({ type, open, onCreate, onCancel, onEdit, initialData }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const { fetchTransactions: fetchIncomes, fetchMonthlyTransaction } = useTransaction('incomes');
    const { fetchTransactionTypes } = useTransactionType(type);

    const transactionTypes = useSelector(state => state.transactionTypeReducer.transactionTypes[`${type}Types`]);
    const currentMonthTransactions = useSelector(state => state.transactionReducer.currentMonthTransactions);
    const customPercent = useSelector(state => state.userReducer.customPercent);

    // current month income
    const incomes = currentMonthTransactions.incomes || [];
    const currentMonthIncome = calculateTotalAmount(incomes, 'income_amount');

    // current month saving, save duoc bao nhieu roi
    const savings = currentMonthTransactions.savings || [];
    const currentMonthSaving = calculateTotalAmount(savings, 'saving_amount');

    const maxSavingsAmount = (currentMonthIncome * customPercent.savingPercent) / 100;
    const savingBalance = maxSavingsAmount - currentMonthSaving;

    useEffect(() => {
        if (open && !transactionTypes[`${type}Types`]) {
            fetchTransactionTypes();
        }
        if (open && initialData) {
            const typeName = transactionTypes.find(item => item[`${type}_type_id`] === initialData[`${type}_type_id`])?.[`${type}_type_name`] || '';
            form.setFieldsValue({
                [`${type}_amount`]: initialData[`${type}_amount`],
                [`${type}_type_id`]: initialData[`${type}_type_id`],
                [`${type}_note`]: initialData[`${type}_note`],
                [`${type}_created_at`]: moment(initialData[`${type}_created_at`])
            });
        } else if (open) {
            form.resetFields();
        }
    }, [open, initialData, form]);

    useEffect(() => {
        dispatch(getUserPercentAsync());
    }, [dispatch]);

    useEffect(() => {
        fetchIncomes();
    }, []);

    useEffect(() => {
        fetchMonthlyTransaction();
    }, []);

    useEffect(() => {
        fetchTransactionTypes();
    }, []);

    const handleOk = async () => {
        setLoading(true);
        try {
            const values = await form.validateFields();
            const transformedValues = {
                ...values,
                [`${type}_type_id`]: values[`${type}_type_id`],
                [`${type}_created_at`]: values[`${type}_created_at`].format('YYYY-MM-DD')
            };
            if (initialData) {
                onEdit(transformedValues, initialData[`${type}_id`]);
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

    return (
        <TransactionalModalStyled>
            <Modal
                open={open}
                title={`${initialData ? 'Edit' : 'Add'} ${type.charAt(0).toUpperCase() + type.slice(1)}`}
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
                        [`${type}_amount`]: 0,
                        [`${type}_type_id`]: '',
                        [`${type}_note`]: '',
                        [`${type}_created_at`]: moment()
                    }}
                >
                    <Form.Item
                        name={`${type}_amount`}
                        label="Amount"
                        rules={[
                            { required: true, message: 'Please input the amount!' }
                        ]}
                    >
                        <InputNumber
                            prefix="$"
                            placeholder="Enter amount"
                            style={{ width: '100%' }}
                            max={type === 'saving' ? Math.max(0, savingBalance) : undefined}
                        />
                    </Form.Item>
                    {type === 'saving' && (
                        <SavingBalanceLabel>June balance: <span>${Math.max(0, savingBalance).toFixed(2)}</span></SavingBalanceLabel>
                    )}
                    <Form.Item
                        name={`${type}_type_id`}
                        label="Type"
                        rules={[{ required: true, message: 'Please select the type!' }]}
                    >
                        <Select
                            showSearch
                            placeholder="Select a type"
                            optionFilterProp="children"
                        >
                            {transactionTypes.map((item) => (
                                <Select.Option key={item[`${type}_type_id`]} value={item[`${type}_type_id`]}>
                                    {item[`${type}_type_name`]}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name={`${type}_created_at`}
                        label="Date"
                        rules={[{ required: true, message: 'Please select the date!' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        name={`${type}_note`}
                        label="Note"
                    >
                        <Input.TextArea rows={4} placeholder="Enter any notes here" />
                    </Form.Item>
                </Form>
            </Modal>
        </TransactionalModalStyled>
    );
};

export default TransactionModal;

const TransactionalModalStyled = styled.div``;

const SavingBalanceLabel = styled.div`
    display: flex;
    justify-content: flex-end;
    font-weight: normal;
    span {
        margin-left: 5px;
        color: var(--color-yellow);
    }
`;
