import { styled } from "styled-components";

export const DashboardStyled = styled.div`
  .amount-con {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    margin: 1.25rem 0;
  }
  .income,
    .saving,
    .expense,
    .monthly-saving,
    .history-con,
    .history-overview {
      background: var(--component-color);
      border: 2px solid #191a16;
      box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
      border-radius: 20px;
      padding: 1rem 1.25rem;
  }

  .table, th, td {
    --bs-table-bg: transparent;
    border: none;
  }

  .histories-con {
    display: grid;
    grid-template-columns: 4fr 2fr;
    gap: 1rem;
    .history-title {
      display: flex;
      justify-content: space-between;
    }
    .history-detail {
        text-decoration: none;
    }
    .history-detail h2 {
        text-decoration: none;
        color: var(--color-yellow);
        font-weight: 500;
    }
    .history-table {
      thead {
        span {
          font-weight: 600;
          color: white;
        }
      }
      tbody > tr {
        background-color: var(--table-row);
        border-radius: 0.5rem; 
      }
    }
    .edit-btn {
      color: var(--edit-btn);
    }
    .del-btn {
      color: var(--delete-btn); 
    }
    .history-overview {
      thead > tr {
        background-color: rgba(39, 39, 42, 1);
      }
    }
  }
`;
