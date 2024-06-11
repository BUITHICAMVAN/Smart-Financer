import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Using useNavigate for navigation
import { useSelector } from "react-redux";
import { Card, Divider, Tooltip, Button, Input, Table, Tag } from "antd";
import { QuestionCircleOutlined } from '@ant-design/icons';
import styled from "styled-components";

const DuePage = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [dueEntries, setDueEntries] = useState([]);
    const navigate = useNavigate();

    const currentUserCurrencyUnit = useSelector(state => state.userReducer.userCurrencyUnit);

    useEffect(() => {
        // Mock data for the current user and due entries
        const fetchData = async () => {
            const user = {
                monthlyIncome: 5000,
                duePayable: 200,
                dueReceivable: 20,
                savingsBalance: 3000,
                currency: currentUserCurrencyUnit
            };
            if (!user.monthlyIncome) {
                navigate("/onboarding");
            } else {
                setCurrentUser(user);
                const dueEntries = [
                    { id: 1, description: 'Alo', amount: 200, type: 'payable', date: '28 May, 24', status: 'Pending' },
                    { id: 2, description: 'ola', amount: 20, type: 'receivable', date: '30 May, 24', status: 'Pending' }
                ];
                setDueEntries(dueEntries);
            }
        };

        fetchData();
    }, [navigate, currentUserCurrencyUnit]);

    if (!currentUser) {
        return <div>Loading...</div>;
    }

    const columns = [
        {
            title: 'Date & Time',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Details',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount) => <span>{currentUser.currency}{amount}</span>,
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (type) => (
                <Tag color={type === 'payable' ? 'red' : 'green'}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                </Tag>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: () => <Tag color="orange">Pending</Tag>,
        },
        {
            title: 'Due Date',
            dataIndex: 'date',
            key: 'dueDate',
            render: (date) => <span>{date}</span>,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <span>
                    <Button type="link">Mark as paid</Button>
                    <Button type="link">Edit</Button>
                    <Button type="link" danger>Delete</Button>
                </span>
            ),
        },
    ];

    return (
        <DuePageStyled>
            <Card className="due-page-card">
                <div className="tooltip-container">
                    <Tooltip
                        title={
                            <div>
                                <p><strong>Dues</strong></p>
                                <p>1. Keep track of your pending dues and mark them as paid when cleared.</p>
                                <p>2. Once marked as paid, it will be reflected in the account you choose.</p>
                            </div>
                        }
                    >
                        <QuestionCircleOutlined className="tooltip-icon" />
                    </Tooltip>
                </div>
                <div className="amount-summary">
                    <div className="amount-container">
                        <span className={`amount-text ${parseFloat(currentUser.duePayable) < 0 ? "amount-text-negative" : ""}`}>
                            <span>{parseFloat(currentUser.duePayable) < 0 ? "-" : ""}</span>
                            <span>{currentUser.currency}</span>
                            {Math.abs(parseFloat(currentUser.duePayable)).toLocaleString()}
                        </span>
                        <p className="amount-label">Due Payable</p>
                    </div>
                    <div className="amount-container">
                        <span className={`amount-text ${parseFloat(currentUser.dueReceivable) < 0 ? "amount-text-negative" : ""}`}>
                            <span>{parseFloat(currentUser.dueReceivable) < 0 ? "-" : ""}</span>
                            <span>{currentUser.currency}</span>
                            {Math.abs(parseFloat(currentUser.dueReceivable)).toLocaleString()}
                        </span>
                        <p className="amount-label">Due Receivable</p>
                    </div>
                </div>
                <div className="button-group">
                    <Button type="primary">Due Payable</Button>
                    <Button>Due Receivable</Button>
                </div>
                <Divider />
                <Table columns={columns} dataSource={dueEntries} pagination={false} />
            </Card>
        </DuePageStyled>
    );
};

const DuePayment = ({ currency, dueType }) => {
    return (
        <Card>
            <h3>{dueType === "payable" ? "Add Payable Due" : "Add Receivable Due"}</h3>
            <Input placeholder="Description" />
            <Input placeholder="Amount" />
            <Button type="primary">Add {dueType}</Button>
        </Card>
    );
};

// Mock DueCard component
const DueCard = ({ initialDues, savingBalance, currency }) => {
    return (
        <div>
            {initialDues.map(due => (
                <Card key={due.id} style={{ marginBottom: '16px' }}>
                    <p>Description: {due.description}</p>
                    <p>Amount: {currency}{due.amount.toLocaleString()}</p>
                    <p>Type: {due.type}</p>
                </Card>
            ))}
            <p>Savings Balance: {currency}{savingBalance.toLocaleString()}</p>
        </div>
    );
};

export default DuePage;
const DuePageStyled = styled.div`
  p {
    font-weight: 500;
  }
  button {
    border-radius: 20px;
    padding: 0.5rem 1rem;
  }
  span {
    font-size: .875rem;
    line-height: 1.25rem;
    font-weight: 500;
  }
  .btn-con {
    margin: 2rem 0;
  }
  .table, th, td {
    --bs-table-bg: transparent;
    border: none;
    thead {
      span {
        font-weight: 600;
        color: white;
      }
    }
  }
  .edit-btn {
    color: var(--edit-btn);
  }
  .del-btn {
    color: var(--delete-btn);
  }

  .due-page-card {
    background-color: #1e1e1e;
    color: #ffffff;
  }

  .tooltip-container {
    position: absolute;
    top: 1rem;
    left: 1rem;
  }

  .tooltip-icon {
    font-size: 16px;
    color: #8c8c8c;
  }

  .amount-summary {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 2rem;
    padding: 1rem;
  }

  .amount-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .amount-text {
    font-size: 2rem;
    color: #ffffff;
  }

  .amount-text-negative {
    color: #ff4d4f;
  }

  .amount-label {
    font-size: 0.875rem;
    color: #8c8c8c;
    text-align: center;
  }

  .button-group {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin: 1rem 0;
  }

  .ant-card {
    background-color: #1e1e1e;
  }

  .ant-card-bordered, .ant-card-head-title, .ant-card-body {
    color: #ffffff;
  }

  .ant-btn-primary {
    background-color: #52c41a;
    border-color: #52c41a;
  }

  .ant-btn-link {
    color: #ffffff;
  }

  .ant-divider-horizontal {
    border-top: 1px solid #ffffff;
  }

  .ant-table {
    background-color: #1e1e1e;
  }

  .ant-table-thead > tr > th {
    background-color: #1e1e1e;
    color: #ffffff;
  }

  .ant-table-tbody > tr > td {
    color: #ffffff;
  }
`;
