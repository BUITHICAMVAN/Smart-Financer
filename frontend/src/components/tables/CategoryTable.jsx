import React from 'react'
import { Table } from 'antd'
import styled from 'styled-components';

const CustomTable = ({ columns, dataSource, title }) => {
  return (
    <CustomTableStyled>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        title={() => title}
        size="middle"
        border
        className='custom-table'
      />
    </CustomTableStyled>
  );
};

const CustomTableStyled = styled.div`
  .custom-table {
    text-align: left;
    .ant-table {
      background-color: var(--category-color);
      color: white;
      border-radius: 0.5rem;
      font-weight: 300;
      font-style: normal;
      .ant-table-title {
        font-weight: 600;
      }
      .ant-table-container {
        /* .ant-table-cell {
          background-color: var(--category-color);
          color: white;
        } */
        .ant-table-cell-row-hover {
          background: var(--color-yellow);
          color: black;
        }
      }
    }
    .ant-table-thead > tr > th {
      border-bottom: none; 
    }
    .ant-table-tbody > tr > td {
      border-bottom: none; // Remove border from table cells
    }
  }
`

export default CustomTable