import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, DatePicker, Select } from 'antd';
import moment from 'moment';
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux';
import { getIncomeTypeAsync } from '../../reducers/IncomeTypeReducer';

const TransactionModal = ({ type = 'entry', open, onCreate, onCancel }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    // get incomType array from store
    const incomeTypes = useSelector(state => state.incomeTypeReducer.incomeTypes)
    console.log(incomeTypes)

    const dispatch = useDispatch()

    useEffect(() => {
        getIncomeTypes()
    }, [])

    const title = `Add ${type.charAt(0).toUpperCase() + type.slice(1)}`

    const onChange = (value) => console.log(`selected ${value}`)
    const onSearch = (value) => console.log('search:', value)
    // Filter `option.label` match the user type `input`
    const filterOption = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())

    const getIncomeTypes = async () => {
        const action = await getIncomeTypeAsync()
        dispatch(action)
    }

    return (
        <TransactionalModalStyled>
            <Modal
                open={open}
                title={title}
                okText="Add"
                cancelText="Close"
                onCancel={onCancel}
                onOk={() => {
                    setLoading(true); // Start loading
                    form
                        .validateFields()
                        .then((values) => {
                            const transformedValues = {
                                ...values,
                                income_type_id: values.income_type_name, // Assuming the selected value is the ID, despite the misleading name
                                income_created_at: values.income_created_at.format('YYYY-MM-DD'),
                            };
                            delete transformedValues.income_type_name;
                            onCreate(transformedValues)
                        })
                        .catch((info) => {
                            console.log('Validate Failed:', info);
                        })
                        .finally(() => {
                            setLoading(false) // Stop loading
                            onCancel()
                        })
                }}
                confirmLoading={loading}
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        income_amount: 0,
                        income_type_name: '',
                        income_note: '',
                        income_create_at: moment()
                    }}
                >
                    <Form.Item
                        name="income_amount"
                        label="Amount"
                        rules={[{ required: true, message: 'Please input the amount!' }]}
                    >
                        <InputNumber
                            prefix="$"
                            placeholder="Enter amount"
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                    <Form.Item
                        name="income_type_name"
                        label="Type"
                        rules={[{ required: true, message: 'Please select the type!' }]}
                    >
                        <Select
                            showSearch
                            placeholder="Select a type"
                            optionFilterProp="children"
                            onChange={onChange}
                            onSearch={onSearch}
                            filterOption={filterOption}
                        >
                            {incomeTypes.map((type) => (
                                <Select.Option key={type.income_type_id} value={type.income_type_id}>
                                    {type.income_type_name}
                                </Select.Option>
                            ))}
                        </Select>

                    </Form.Item>
                    <Form.Item
                        name="income_created_at"
                        label="Date"
                        rules={[{ required: true, message: 'Please select the date!' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        name="income_note"
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

const TransactionalModalStyled = styled.div`
`