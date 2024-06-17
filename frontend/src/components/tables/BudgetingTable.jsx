import React from 'react'
import { Table } from 'antd'
import styled from 'styled-components'
const BudgetingTable = ({ data }) => {
  const columns = [
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (text, record) => {
        if (record.children) {
          return {
            children: text,
            props: {
              colSpan: 4,
            },
          }
        }
        return text
      },
    },
    {
      title: 'Budget',
      dataIndex: 'budget',
      key: 'budget',
      render: (text, record) => (record.children ? { props: { colSpan: 0 } } : text),
    },
    {
      title: 'Actual',
      dataIndex: 'actual',
      key: 'actual',
      render: (text, record) => (record.children ? { props: { colSpan: 0 } } : text),
    },
    {
      title: 'Remaining',
      dataIndex: 'remaining',
      key: 'remaining',
      render: (text, record) => {
        if (record.children) {
          return { props: { colSpan: 0 } }
        }
        const remaining = (record.budget ?? 0) - (record.actual ?? 0)
        return remaining.toFixed(2)
      },
    },
  ]

  const dataSource = data.categories.map((category) => ({
    ...category,
    remaining: (category.budget ?? 0) - (category.actual ?? 0),
  }))

  return (
    <BudgetingTableStyled>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
      />
    </BudgetingTableStyled>
  )
}

const BudgetingTableStyled = styled.div`
.ant-table {
    color: white;
    background-color: transparent;
    .ant-table-title {
      font-size: 1rem;
      font-weight: 600;
      padding-bottom: 1rem;
    }
    .ant-table-content {
      color: white;
      th {
        background: var(--input-color);
        border-radius: 10px;
        color: white;
        height: 20px;
      }
      td {
        font-family: "Courier Prime", monospace;
        font-weight: 400;
      }
      thead > tr:first-child th {
        background-color: transparent;
      }
      .ant-table-cell-row-hover {
        background: var(--color-yellow);
        color: black;
      }
    }
  }
  .ant-pagination {
    justify-content: center;
    margin: 0;
  }
`;
export default BudgetingTable;
