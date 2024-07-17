import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, DatePicker } from 'antd';
import moment from 'moment';
import styled from 'styled-components';

const DueModal = ({ open, onCreate, onCancel, onEdit, initialData, dueType }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleOk = async () => {
        setLoading(true);
        try {
            const values = await form.validateFields();
            const transformedValues = {
                ...values,
                due_type_id: dueType,
                due_due_date: values.due_date.format('YYYY-MM-DD')
            };
            if (initialData) {
                await onEdit(initialData.due_id, transformedValues);
            } else {
                await onCreate(transformedValues);
            }
        } catch (error) {
            console.log('Validate Failed:', error);
        } finally {
            setLoading(false);
            onCancel();
        }
    };

    const getTitle = () => {
        if (initialData) {
            return dueType === 1 ? 'Edit Due Receivable' : 'Edit Due Payable';
        } else {
            return dueType === 1 ? 'Add Due Receivable' : 'Add Due Payable';
        }
    };

    useEffect(() => {
        if (open) {
            if (initialData) {
                form.setFieldsValue({
                    due_details: initialData.due_details,
                    due_amount: initialData.due_amount,
                    due_date: moment(initialData.due_due_date)
                });
            } else {
                form.resetFields();
                form.setFieldsValue({
                    due_date: moment()
                });
            }
        }
    }, [open, initialData, form]);

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
    );
};

export default DueModal;

const DueModalStyled = styled.div``;
