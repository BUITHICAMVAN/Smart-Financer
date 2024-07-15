// ReturnButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const ReturnButton = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(-1);
    };

    return (
        <ReturnedButtonStyled onClick={handleClick}>
            <span>&lt;</span>
        </ReturnedButtonStyled>
    );
};

export default ReturnButton;

const ReturnedButtonStyled = styled.button`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border: solid grey .1px;
  border-radius: 10px;
  background-color: transparent;
  cursor: pointer;
  z-index: 1000;
  span {
    font-size: 1.5rem;
    color: white;
  }

  &:hover {
    background-color: var(--button-hover-bg-color, #e0e0e0);
  }

  @media screen and (min-width: 1280px) {
    display: none;
  }
`;
