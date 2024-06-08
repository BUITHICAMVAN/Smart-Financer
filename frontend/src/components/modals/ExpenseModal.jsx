import React, { useEffect, useState } from 'react'
import { Modal, Form, Input, InputNumber, DatePicker, Radio } from 'antd'
import moment from 'moment'
import styled from 'styled-components'
import { getExpenseTypeID, getExpenseTypeName } from '../../utils/ExpenseTypeMapping'

const ExpenseModal = ({ open, onCreate, onCancel, onEdit, initialData }) => {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)

    const handleOk = async () => {
        setLoading(true)
        try {
            const values = await form.validateFields()
            const expenseTypeId = getExpenseTypeID(values.expense_type_name)
            const transformedValues = {
                ...values,
                expense_type_id: expenseTypeId,
                expense_created_at: values.expense_created_at.format('YYYY-MM-DD')
            }
            delete transformedValues.expense_type_name
            if (initialData) {
                onEdit(initialData.expense_id, transformedValues )
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

    useEffect(() => {
        if (open) {
            if (initialData) { // if it has data
                const expenseTypeName = getExpenseTypeName(initialData.expense_type_id)
                form.setFieldsValue({
                    expense_category: initialData.expense_category,
                    expense_amount: initialData.expense_amount,
                    expense_type_name: expenseTypeName,
                    expense_created_at: moment(initialData.expense_created_at)
                })
            } else {
                form.resetFields()
                form.setFieldsValue({
                    expense_created_at: moment()
                })
            }
        }
    }, [open, initialData, form])

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
                        />
                    </Form.Item>
                    <Form.Item
                        name="expense_category"
                        label="Expense Description"
                        rules={[{ required: true, message: 'Please input a description!' }]}
                    >
                        <Input
                            placeholder="E.g., Coffee"
                            style={{ width: '100%' }}
                        />
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
                    <Form.Item
                        name="expense_type_name"
                        label="Expense Type"
                        rules={[{ required: true, message: 'Please select the type!' }]}
                    >
                        <StyledRadioGroup>
                            <StyledRadio value="essentials">
                                <RadioWrapper>
                                    <RadioContent>
                                        <span>Needs</span>
                                        <Description>It's a necessity.</Description>
                                    </RadioContent>
                                    <RadioButton />
                                </RadioWrapper>
                            </StyledRadio>
                            <StyledRadio value="nonEssentials">
                                <RadioWrapper>
                                    <RadioContent>
                                        <span>Wants</span>
                                        <Description>It's a luxury.</Description>
                                    </RadioContent>
                                    <RadioButton />
                                </RadioWrapper>
                            </StyledRadio>
                        </StyledRadioGroup>
                    </Form.Item>
                </Form>
            </Modal>
        </ExpenseModalStyled>
    )
}

export default ExpenseModal

const ExpenseModalStyled = styled.div``;

const StyledRadioGroup = styled(Radio.Group)`
  display: flex;
  gap: 20px;
`;

const StyledRadio = styled(Radio)`
  display: flex;
  align-items: center;
`;

const RadioWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const RadioContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-right: 10px;
`;

const RadioButton = styled.div`
  .ant-radio-inner {
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }

  .ant-radio-checked .ant-radio-inner {
    background-color: #52c41a;
    border-color: #52c41a;
  }
`;

const Description = styled.span`
  font-size: 12px;
  color: #888;
  font-weight: lighter;
`;
