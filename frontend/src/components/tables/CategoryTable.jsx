import React from "react"
import { Table } from "antd"
import styled from "styled-components"

const CategoryTable = ({ columns, dataSource, title }) => {
  return (
    <CategoryTableStyled>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        title={title ? () => title : null}
        size="medium"
        borderless
      />
    </CategoryTableStyled>
  )
}

const CategoryTableStyled = styled.div`
  .ant-table {
    color: white;
    text-align: center;
    background-color: transparent;
    .ant-table-thead > tr > th {
      border-bottom: none;
    }
    .ant-table-tbody > tr > td {
      border-bottom: none; // Remove border from table cells
    }
    .ant-table-title {
      font-size: 0.875rem;
      font-weight: 600;
      padding-bottom: 1rem;
    }
    .ant-table-content {
      color: white;
      th {
        background: var(--input-color);
        border-radius: 10px;
        color: white;
        text-align: center;
        height: 40px;
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

export default CategoryTable;
