import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { InnerLayout } from '../../styles/Layouts';
import useTransaction from '../../customHooks/TransactionHook';
import { useDispatch, useSelector } from 'react-redux';
import TransactionModal from '../../components/modals/TransactionModal';
import { dateFormat } from '../../utils/format/DateFormat';
import { calculateTotalAmount } from '../../utils/calculate/totalAmount';
import { getCurrencySymbol } from '../../utils/format/CurrencySymbol';
import { setCurrentCurrencyAsync } from '../../reducers/UserReducer';

const SavingPage = () => {
  const dispatch = useDispatch();
  const { fetchMonthlyTransaction, addTransaction, removeTransaction, editTransaction } = useTransaction('savings');
  const [confirmLoading, setConfirmLoading] = useState(false); // loading
  const [open, setOpen] = useState(false); // open modal
  const [initialData, setInitialData] = useState(null); // table data for editing modal
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const currentMonthTransactions = useSelector(state => state.transactionReducer.currentMonthTransactions);
  const savings = currentMonthTransactions.savings || [];
  const savingTypes = useSelector(state => state.transactionTypeReducer.transactionTypes.savingTypes);

  const totalAmount = calculateTotalAmount(savings, 'saving_amount');
  const currentUnit = useSelector(state => state.userReducer.userCurrencyUnit);

  const showModal = () => {
    setInitialData(null); // Clear initial data for adding
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
    setInitialData(null); // Clear initial data when closing modal
  };

  const handleCreate = async (formData) => {
    setConfirmLoading(true);
    try {
      await addTransaction(formData);
      setOpen(false);
    } catch (error) {
      console.error('Failed to add transaction:', error);
      alert('Failed to add transaction.');
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleDelete = (id) => {
    removeTransaction(id);
  };

  const handleEdit = (data) => {
    setInitialData(data); // Set data to edit
    setOpen(true);
  };

  const handleSaveEdit = (data, id) => {
    setConfirmLoading(true);
    try {
      editTransaction(data, id);
      setOpen(false);
    } catch (error) {
      console.error('Failed to edit transaction:', error);
      alert('Failed to edit transaction.');
    } finally {
      setConfirmLoading(false);
    }
  };

  const getSavingTypeName = (id) => {
    const savingType = savingTypes.find(type => type.saving_type_id === id);
    return savingType ? savingType.saving_type_name : 'Unknown';
  };

  useEffect(() => {
    fetchMonthlyTransaction();
  }, []);

  useEffect(() => {
    dispatch(setCurrentCurrencyAsync());
  }, [dispatch]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = savings.slice(indexOfFirstItem, indexOfFirstItem + itemsPerPage);

  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(savings.length / itemsPerPage); i++) {
      pageNumbers.push(i);
    }
    return (
      <Pagination>
        {pageNumbers.map(number => (
          <PaginationItem key={number} onClick={() => handlePageChange(number)} active={number === currentPage}>
            {number}
          </PaginationItem>
        ))}
      </Pagination>
    );
  };

  return (
    <SavingPageStyled>
      <InnerLayout>
        <div className="container">
          <div className="content-container text-center">
            <div className="income-total">
              <p>{getCurrencySymbol(currentUnit)}{totalAmount}</p>
              <h2>Savings Balance</h2>
            </div>
            <div className="btn-con">
              <button className="btn btn-warning" onClick={showModal}>Add Entry</button>
            </div>
            <TransactionModal
              type="saving"
              open={open}
              onCreate={handleCreate}
              onEdit={handleSaveEdit}
              onCancel={handleCancel}
              initialData={initialData}
            />
            <hr />
            <div className="income-content">
              <table className='table'>
                <thead>
                  <tr>
                    <th><span>Date & Time</span></th>
                    <th><span>Saving type</span></th>
                    <th><span>Amount</span></th>
                    <th><span>Note</span></th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((saving) => (
                    <tr key={saving.saving_id}>
                      <td><span className="white-text">{dateFormat(saving.saving_created_at)}</span></td>
                      <td><span className="white-text">{getSavingTypeName(saving.saving_type_id)}</span></td>
                      <td><span className="white-text">{getCurrencySymbol(currentUnit)}{saving.saving_amount}</span></td>
                      <td><span className="white-text">{saving.saving_note}</span></td>
                      <td><span className='edit-btn' onClick={() => handleEdit(saving)}>Edit</span></td>
                      <td><span className='del-btn' onClick={() => handleDelete(saving.saving_id)}>Delete</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {renderPagination()}
            </div>
          </div>
        </div>
      </InnerLayout>
    </SavingPageStyled>
  );
};

const SavingPageStyled = styled.div`
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
  .white-text {
    color: white;
    font-weight: 400;
  }
  .edit-btn {
    color: var(--edit-btn);
  }
  .del-btn {
    color: var(--delete-btn); 
  }
`;

const Pagination = styled.ul`
  display: flex;
  justify-content: center;
  padding: 1rem 0;
  list-style: none;
`;

const PaginationItem = styled.li`
  margin: 0 0.5rem;
  cursor: pointer;
  color: ${({ active }) => (active ? '#fff' : '#fff')};
  background-color: ${({ active }) => (active ? 'var(--color-yellow)' : 'transparent')};
  padding: 0.5rem 1rem;
  border-radius: 4px;
  &:hover {
    background-color: ${({ active }) => (active ? 'var(--color-yellow)' : '#f0f0f0')};
  }
`;

export default SavingPage;
