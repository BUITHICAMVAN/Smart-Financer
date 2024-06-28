import React, { useState } from "react";
import styled from "styled-components";
import { NavLink, useLocation } from "react-router-dom";
import {
    budgeting,
    customize,
    dashboard,
    expenses,
    income,
    piggy,
    profile,
    report,
    signout,
} from "../../utils/icons/Icons";
import BoxSx from "../box/BoxSx";

const Navigation = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();
    const isDashboardActive = location.pathname === "/" || location.pathname === "/dashboard-page";

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <NavWrapper>
            <ToggleButton onClick={toggleSidebar}>
                ☰
            </ToggleButton>
            <NavStyled className={isSidebarOpen ? "active" : ""}>
                <div className="app-name">
                    <h1>SmartFinancer</h1>
                </div>
                <ul className="menu-items">
                    <div className="menu-name">
                        <BoxSx mainColor={"#FACC15"} />
                        <h1>Main Menu</h1>
                    </div>
                    <li>
                        <NavLink
                            to="/dashboard-page"
                            className={isDashboardActive ? "active" : ""}
                        >
                            {dashboard} <span>Dashboard</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/income-page">
                            {income} <span>Income</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="budgeting-page">
                            {budgeting} <span>Budgeting</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="forecast-page">
                            {budgeting} <span>Forecasting</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/saving-page">
                            {piggy} <span>Savings</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/expense-page" >
                            {expenses} <span>Expenses</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/due-page" >
                            {report} <span>Dues</span>
                        </NavLink>
                    </li>
                </ul>
                <ul className="menu-items">
                    <div className="menu-name">
                        <BoxSx mainColor={"#FACC15"} />
                        <h1>Account</h1>
                    </div>
                    <li>
                        <NavLink to="/category-page">
                            {customize} <span>Customize</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/profile-page">
                            {profile} <span>Profile</span>
                        </NavLink>
                    </li>
                </ul>
                <div className="bottom-nav">
                    <li>{signout} Sign Out</li>
                </div>
            </NavStyled>
            {isSidebarOpen && <Overlay onClick={toggleSidebar} />}
        </NavWrapper>
    );
};

const NavWrapper = styled.div`
    position: relative;
`;

const ToggleButton = styled.button`
    position: absolute;
    top: 1rem;
    left: 1rem;
    background: var(--color-yellow);
    border: none;
    padding: 0.5rem 1rem;
    font-size: 1.5rem;
    cursor: pointer;
    display: none;

    @media (max-width: 1280px) {
        display: block;
    }
`;

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1;
`;

const NavStyled = styled.nav`
    padding: 0 1rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    color: var(--color-white);
    span {
        font-weight: 400;
    }
    .app-name {
        height: 100px;
        display: flex;
        align-items: center;
        h1 {
            color: var(--color-yellow);
            font-size: 1.25rem;
            font-weight: 700;
        }
    }
    .menu-items {
        display: flex;
        flex-direction: column;
        padding: 0;
        h1 {
            font-size: 0.875rem;
            line-height: 1.25rem;
            font-weight: 600;
        }
        .menu-name {
            display: flex;
            align-items: center;
        }
        li a {
            display: grid;
            grid-template-columns: 40px auto;
            text-decoration: none;
            align-items: center;
            margin: 0.5rem 2rem;
            font-weight: 500;
            font-size: 0.875rem;
            cursor: pointer;
            transition: all 0.4s ease-in-out;
            color: var(--color-grey);
            position: relative;
            i {
                color: var(--color-grey);
                font-size: 1rem;
                transition: all 0.4s ease-in-out;
            }
        }
    }
    .active {
        span {
            color: var(--color-yellow);
            font-weight: 600;
        }
        i {
            color: var(--color-yellow) !important;
        }
        &::before {
            content: "";
            position: absolute;
            left: 0;
            top: 0;
            width: 4px;
            height: 100%;
            background-color: var(--color-yellow);
            border-radius: 0 10px 10px 0;
            margin-left: -0.5rem;
        }
    }
    .bottom-nav {
        flex: 1;
    }
    @media (max-width: 1280px) {
        width: 250px;
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        background: var(--background-color);
        z-index: 2;
        transform: translateX(-100%);
        transition: transform 0.3s ease-in-out;
        
        &.active {
            transform: translateX(0);
        }
    }
`;

export default Navigation;
