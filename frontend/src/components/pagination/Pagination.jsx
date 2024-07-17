import React from 'react';
import styled from 'styled-components';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <PaginationStyled>
            {Array.from({ length: totalPages }, (_, index) => (
                <button
                    key={index + 1}
                    className={currentPage === index + 1 ? 'active' : ''}
                    onClick={() => onPageChange(index + 1)}
                >
                    {index + 1}
                </button>
            ))}
        </PaginationStyled>
    );
};

const PaginationStyled = styled.div`
    position: relative;
    z-index: 1000;
    display: flex;
    justify-content: center;
    margin-top: .75rem;
    button {
        background: none;
        border: none;
        color: var(--color-white);
        cursor: pointer;
        border-radius: 10px;
        transition: background 0.3s ease;

        &.active {
            background: var(--color-yellow);
            color: var(--color-black);
        }

        &:hover {
            background: rgba(255, 255, 255, 0.1);
        }
    }
    @media screen and (max-width: 768px) {
        font-size: 10px;
    }
`;

export default Pagination;
