import React, { useState } from 'react';
import { Modal, Form, Input, InputNumber, DatePicker } from 'antd';
import moment from 'moment';
import styled from 'styled-components'

const TransactionModal = ({ type = 'entry', open, onCreate, onCancel }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const title = `Add ${type.charAt(0).toUpperCase() + type.slice(1)}`;

    return (
        <TransactionalModalStyled>
            <Modal
                wrapClassName='custom-transactional-modal'
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
                            onCreate(values)
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
                        amount: 0,
                        type: '',
                        date: moment(),
                        note: ''
                    }}
                >
                    <Form.Item
                        name="amount"
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
                        name="type"
                        label="Type"
                        rules={[{ required: true, message: 'Please select the type!' }]}
                    >
                        <Input placeholder="Enter type of transaction" />
                    </Form.Item>
                    <Form.Item
                        name="date"
                        label="Date"
                        rules={[{ required: true, message: 'Please select the date!' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        name="note"
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