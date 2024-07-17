import React, { useState, useEffect } from 'react'
import { Modal, Radio, Form } from 'antd'
import styled from 'styled-components'

const PayStatusModal = ({ open, onMarkAsPaid, onCancel, paymentType }) => {
    const [form] = Form.useForm()
    const [confirmLoading, setConfirmLoading] = useState(false)
    const [selectedOption, setSelectedOption] = useState('')

    useEffect(() => {
        if (paymentType === 'receivable') {
            setSelectedOption('incomes')
        } else if (paymentType === 'payable') {
            setSelectedOption('needs')
        }
    }, [paymentType])

    const handleOk = async () => {
        setConfirmLoading(true)
        try {
            const values = await form.validateFields()
            // Add data to the appropriate table based on selectedOption
            values.status = 'paid' // Change status

            if (selectedOption === 'incomes') {
                // Add to income table
                await addIncomeToDatabase(values)
            } else {
                // Add to expenses table
                await addExpenseToDatabase(values)
            }
            onMarkAsPaid(values)
        } catch (error) {
            console.log('Validate Failed:', error)
        } finally {
            setConfirmLoading(false)
            onCancel()
        }
    }

    const handleChange = (e) => {
        setSelectedOption(e.target.value)
    }

    const addIncomeToDatabase = async (values) => {
        // Implement the logic to add income data to the income table in the database
        console.log(values)
    }

    const addExpenseToDatabase = async (values) => {
        // Implement the logic to add expense data to the expense table in the database
    }

    return (
        <PayStatusModalStyled>
            <Modal
                open={open}
                title="Mark as paid"
                okText="Mark as paid"
                cancelText="Cancel"
                onCancel={onCancel}
                onOk={handleOk}
                confirmLoading={confirmLoading}
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        paymentSource: selectedOption,
                    }}
                >
                    <Form.Item name="paymentSource">
                        <Radio.Group onChange={handleChange} value={selectedOption}>
                            {paymentType === 'receivable' && (
                                <Radio value="incomes">Incomes</Radio>
                            )}
                            {paymentType === 'payable' && (
                                <>
                                    <Radio value="needs">Needs</Radio>
                                    <Radio value="wants">Wants</Radio>
                                </>
                            )}
                        </Radio.Group>
                    </Form.Item>
                </Form>
            </Modal>
        </PayStatusModalStyled>
    )
}

export default PayStatusModal

const PayStatusModalStyled = styled.div`
.ant-modal {
    background-color: #333;
    color: white;
}

.ant-modal-title {
    color: white;
}

.ant-radio-group {
    display: flex;
    flex-direction: column;
}

.ant-radio-wrapper {
    color: white;
    margin-bottom: 8px;
}

.ant-modal-footer .ant-btn-primary {
    background-color: green;
    border-color: green;
}

.ant-modal-footer .ant-btn {
    border-radius: 5px;
}
`
