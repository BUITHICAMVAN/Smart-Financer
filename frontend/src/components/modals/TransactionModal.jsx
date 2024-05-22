import React, { useEffect, useState } from 'react'
import { Modal, Form, Input, InputNumber, DatePicker, Select } from 'antd'
import moment from 'moment'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import useTransactionType from '../../customHooks/TransactionTypeHook'

const TransactionModal = ({ type, open, onCreate, onCancel, onEdit, initialData }) => {
    const { fetchTransactionTypes } = useTransactionType(type) // pass in the type to retrive 
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)

    // Selector for transaction types with a shallow comparison for performance
    const transactionTypes = useSelector(state => state.transactionTypeReducer.transactionTypes[`${type}Types`])

    useEffect(() => {
        if (open && !transactionTypes[`${type}Types`]) { // Only fetch if there are no types
            fetchTransactionTypes() 
        }
        if (open && initialData) { // if there is initial data - edit 
            form.setFieldsValue({
                [`${type}_amount`]: initialData[`${type}_amount`],
                [`${type}_type_id`]: initialData[`${type}_type_name`],
                [`${type}_note`]: initialData[`${type}_note`],
                [`${type}_created_at`]: moment(initialData[`${type}_created_at`])
            })
        } else if (open) {
            form.resetFields();
        }
    }, [open, initialData, form])

    const handleOk = async () => {
        setLoading(true)
        try {
            const values = await form.validateFields()
            const transformedValues = {
                ...values,
                [`${type}_type_id`]: values[`${type}_type_name`],
                [`${type}_created_at`]: values[`${type}_created_at`].format('YYYY-MM-DD')
            }
            delete transformedValues[`${type}_type_name`]
            if (initialData) {
                onEdit(transformedValues, initialData[`${type}_id`])
            } else {
                onCreate(transformedValues)
            }
        } catch (error) {
            console.log('Validate Failed:', error)
        } finally {
            setLoading(false)
            onCancel()
        }
    }

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
                        [`${type}_type_name`]: '',
                        [`${type}_note`]: '',
                        [`${type}_created_at`]: moment()
                    }}
                >
                    <Form.Item
                        name={`${type}_amount`}
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
                        name={`${type}_type_name`}
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
                        name={`${type}_created_at`} // Ensure the name matches the key used in the state
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
    )
}

export default TransactionModal

const TransactionalModalStyled = styled.div`
`