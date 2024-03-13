import React from 'react'
import styled from 'styled-components'
import { signout } from '../../utils/Icons'
import { menuItems } from '../../utils/MenuItems'
import { accountItems } from '../../utils/MenuItems'
import BoxSx from '../../utils/BoxSx'

function Navigation({ active, setActive }) {

    return (
        <NavStyled>
            <div className="app-name">
                <img src="../../img/logo_bee" alt="logo_bee" />
                <h2>SmartFinancer</h2>
            </div>
            <ul className="menu-items">
                <div className='menu-name'>
                    <BoxSx mainColor={"#FACC15"} />
                    <h2>Main Menu</h2>
                </div>
                {menuItems.map((item) => {
                    return <li
                        key={item.id}
                        onClick={() => setActive(item.id)}
                        className={active === item.id ? 'active' : ''}
                    >
                        {item.icon}
                        <span>{item.title}</span>
                    </li>
                })}
            </ul>
            <ul className="menu-items">
                <div className='menu-name'>
                    <BoxSx mainColor={"#FACC15"} />
                    <h2>Account</h2>
                </div>
                {accountItems.map((item) => {
                    return <li
                        key={item.id}
                        onClick={() => setActive(item.id)}
                        className={active === item.id ? 'active' : ''}
                    >
                        {item.icon}
                        <span>{item.title}</span>
                    </li>
                })}
            </ul>
            <div className="bottom-nav">
                <li>
                    {signout} Sign Out
                </li>
            </div>
        </NavStyled>
    )
}

const NavStyled = styled.nav`
    padding: 1.5rem 1rem 0;
    height: 100%; 
    display: flex;
    flex-direction: column;
    color: var(--color-white);
    .app-name {
        height: 100px;
        display: flex;
        align-items: center;
        img {
            width: 50px;
            height: 50px;
            object-fit: cover;
            padding: .2rem;
            box-shadow: 0px 1px 17px rgba(0, 0, 0, 0.06);
        }
        h2 {
            color: var(--color-yellow);
            font-size: 1.25rem;
            font-weight: 700;
        }
        p {
            color: var(--color-white);
        }
    }

    .menu-items {
        display: flex;
        flex-direction: column;
        padding: 0;
        .menu-name {
            display: flex;
            align-items: center;s
        }
        .menu-name h2 {
            font-size: 1rem;
            margin: 0 
        }
        li {
            display: grid;
            grid-template-columns: 40px auto;
            align-items: center;
            margin: .5rem 2rem;
            font-weight: 500;
            font-size: .875rem;
            cursor: pointer;
            transition: all .4s ease-in-out;
            color: var(--color-grey);
            position: relative;
            i {
                color: var(--color-grey);
                font-size: 1rem;
                transition: all .4s ease-in-out;
            }
        
        }
    }
    
    .active {
        color: var(--color-yellow) !important;
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
            margin-left: -0.5rem
        }
    }

    .bottom-nav {
        flex: 1;
    }

    @media (max-width: 1280px) {
        width: 100%;
        position: fixed;
        top: 0;
        left: 0;
        transform: translateX(-100%);
        transition: transform 0.3s ease-in-out;
        
        &.active {
            transform: translateX(0);
        }
    }
`;


export default Navigation