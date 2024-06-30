import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Table } from 'antd';
import { formatForecastData } from '../../utils/format/ForecastDataFormat';

const ForecastTable = ({ data }) => {
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    if (data) {
      setDataSource(formatForecastData(data));
    }
  }, [data]);

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const nextMonth = (currentMonth + 1) % 12;

  const months = [];
  for (let i = nextMonth; i < 12; i++) {
    months.push(new Date(0, i).toLocaleString('default', { month: 'long' }).toLowerCase());
  }

  const columns = [
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: '20%',
      fixed: 'left',
    },
    ...months.map(month => ({
      title: month.charAt(0).toUpperCase() + month.slice(1),
      dataIndex: month,
      key: month,
      render: (text) => <span>{typeof text === 'number' ? `$${text.toFixed(2)}` : 'N/A'}</span>,
    })),
  ];

  return (
    <ForecastTableStyled>
      <Table
        dataSource={dataSource}
        pagination={false}
        columns={columns}
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
