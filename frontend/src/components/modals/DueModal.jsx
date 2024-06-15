import React, { useEffect, useState } from 'react'
import { Modal, Form, Input, InputNumber, DatePicker } from 'antd'
import moment from 'moment'
import styled from 'styled-components'

const DueModal = ({ open, onCreate, onCancel, onEdit, initialData, dueType }) => {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)

    const handleOk = async () => {
        setLoading(true)
        try {
            const values = await form.validateFields()
            console.log(values)
            const transformedValues = {
                ...values,
                due_type_id: dueType, // Map the dueType name to its ID
                due_due_date: values.due_date.format('YYYY-MM-DD')
            }
            console.log(dueType)
            console.log('Transformed Values:', transformedValues)
            if (initialData) {
                onEdit(initialData.due_id, transformedValues)
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

    const getTitle = () => {
        if (initialData) {
            return dueType === 'payable' ? 'Edit Due Payable' : 'Edit Due Receivable'
        } else {
            return dueType === 'payable' ? 'Add Due Payable' : 'Add Due Receivable'
        }
    }

    useEffect(() => {
        if (open) {
            if (initialData) { // if it has data
                form.setFieldsValue({
                    due_details: initialData.due_details,
                    due_amount: initialData.due_amount,
                    due_date: moment(initialData.due_date)
                })
            } else {
                form.resetFields()
                form.setFieldsValue({
                    due_date: moment()
                })
            }
        }
    }, [open, initialData, form])

    return (
        <DueModalStyled>
            <Modal
                open={open}
                title={getTitle()}
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
                        due_date: moment(),
                        due_details: '',
                        due_amount: 0,
                    }}
                >
                    <Form.Item
                        name="due_amount"
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
                        name="due_details"
                        label="Due Description"
                        rules={[{ required: true, message: 'Please input a description!' }]}
                    >
                        <Input
                            placeholder="E.g., Pending payment to bank"
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                    <Form.Item
                        name="due_date"
                        label="Due Date"
                        rules={[{ required: true, message: 'Please select the due date!' }]}
                    >
                        <DatePicker
                            style={{ width: '100%' }}
                            format="YYYY-MM-DD"
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </DueModalStyled>
    )
}

export default DueModal

const DueModalStyled = styled.div``
