import React, { useState, useEffect, useContext, useRef } from 'react';
import { Table, Input, Form } from 'antd'
import styled from 'styled-components'

const EditableContext = React.createContext(null)

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm()
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false)
  const inputRef = useRef(null)
  const form = useContext(EditableContext)

  useEffect(() => {
    if (editing) {
      inputRef.current.focus()
    }
  }, [editing])

  const toggleEdit = () => {
    setEditing(!editing)
    form.setFieldsValue({ [dataIndex]: record[dataIndex] })
  }

  const save = async () => {
    try {
      const values = await form.validateFields()
      toggleEdit()
      handleSave({ ...record, ...values })
    } catch (errInfo) {
      console.log('Save failed:', errInfo)
    }
  }

  let childNode = children

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    )
  }

  return <td {...restProps}>{childNode}</td>
}

const BudgetingTable = ({ data }) => {
  const [dataSource, setDataSource] = useState([])

  useEffect(() => {
    if (Array.isArray(data.categories)) {
      setDataSource(data.categories)
    }
  }, [data])

  const handleSave = (row) => {
    const updateData = (items) => {
      return items.map((item) => {
        if (item.key === row.key) {
          return { ...item, ...row }
        }
        if (item.children) {
          return { ...item, children: updateData(item.children) }
        }
        return item
      })
    }
    setDataSource(updateData(dataSource))
  }

  const columns = [
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: '40%',
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
      width: '20%',
      editable: true,
      render: (text, record) => (record.children ? { props: { colSpan: 0 } } : text),
    },
    {
      title: 'Actual',
      dataIndex: 'actual',
      key: 'actual',
      width: '20%',
      render: (text, record) => (record.children ? { props: { colSpan: 0 } } : text),
    },
    {
      title: 'Remaining',
      dataIndex: 'remaining',
      key: 'remaining',
      width: '20%',
      render: (text, record) => {
        if (record.children) {
          return { props: { colSpan: 0 } }
        }
        const remaining = (record.budget ?? 0) - (record.actual ?? 0)
        return remaining.toFixed(2)
      },
    },
  ]

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    }
  })

  return (
    <BudgetingTableStyled>
      <Table
        components={{
          body: {
            row: EditableRow,
            cell: EditableCell,
          },
        }}
        rowClassName={() => 'editable-row'}
        dataSource={dataSource}
        columns={mergedColumns}
        pagination={false}
      />
    </BudgetingTableStyled>
  )
}

const BudgetingTableStyled = styled.div`
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
