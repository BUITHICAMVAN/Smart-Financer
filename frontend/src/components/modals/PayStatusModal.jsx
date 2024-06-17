import React, { useState } from 'react'
import { Modal, Radio, Form } from 'antd'
import styled from 'styled-components'

const PayStatusModal = ({ open, onMarkAsPaid, onCancel }) => {
    const [form] = Form.useForm()
    const [confirmLoading, setConfirmLoading] = useState(false)
    const [selectedOption, setSelectedOption] = useState('savings')

    const handleOk = async () => {
        setConfirmLoading(true)
        try {
            const values = await form.validateFields()
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
                        paymentSource: 'savings',
                    }}
                >
                    <Form.Item name="paymentSource">
                        <Radio.Group onChange={handleChange} value={selectedOption}>
                            <Radio value="savings">Savings</Radio>
                            <Radio value="miscellaneous">Miscellaneous</Radio>
                            <Radio value="needs">Needs</Radio>
                            <Radio value="wants">Wants</Radio>
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
