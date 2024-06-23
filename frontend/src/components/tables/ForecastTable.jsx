import React from 'react';
import styled from 'styled-components';
import { Table } from 'antd';

const ForecastTable = ({ data }) => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const columns = [
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            width: '20%',
            fixed: 'left',
            render: (text, record) => {
                if (record.children) {
                    return {
                        children: text,
                        props: {
                            colSpan: 1,
                        },
                    };
                }
                return text;
            },
        },
        ...months.map(month => ({
            title: month,
            dataIndex: month.toLowerCase(),
            key: month.toLowerCase(),
            render: (text) => <span>${text || 0}</span>,
        }))
    ];

    const mergedColumns = columns.map((col) => {
        return {
          ...col,
          onCell: (record) => ({
            record,
            dataIndex: col.dataIndex,
            title: col.title
          }),
        };
      });

    return (
        <ForecastTableStyled>
            <Table
                dataSource={data}
                pagination={false}
                columns={mergedColumns}
                rowKey="key"
                scroll={{ x: 1500 }}
            />
        </ForecastTableStyled>
    );
};


const ForecastTableStyled = styled.div`
  .editable-row .editable-cell-value-wrap {
    padding: 5px 12px;
    cursor: pointer;
  }
  .editable-row:hover .editable-cell-value-wrap {
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    padding: 4px 11px;
  }
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
        color: white;
        height: 20px;
        font-size: .75rem;
      }
      thead > tr:first-child th {
        background: var(--first-col);
      }
      .ant-table-cell-row-hover {
        background-color: transparent;
        color: white;
      }
      span {
        font-family: "Courier Prime", monospace;
        font-weight: 400;
        color: white;
      }
    }
  }
  .ant-pagination {
    justify-content: center;
    margin: 0;
  }

  .ant-table-tbody > tr > td {
    &.parent-row {
      background-color: var(--color-yellow);
    }
  }

  .parent-row > td:first-child {
    background-color: var(--color-yellow) !important;
  }

  .child-row > td:first-child {
    padding-left: 2rem;
  }
  .ant-table-wrapper .ant-table-cell-fix-left {
    background: var(--first-col);
  }
`;

export default ForecastTable;
