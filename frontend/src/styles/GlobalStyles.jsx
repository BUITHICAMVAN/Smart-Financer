import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        list-style: none;
        font-family: "Montserrat", sans-serif;
        letter-spacing: .025rem
    }
    .courier-prime-regular {
        font-family: "Courier Prime", monospace;
        font-weight: 400;
        font-style: normal;
    }
    .courier-prime-bold {
        font-family: "Courier Prime", monospace;
        font-weight: 700;
        font-style: normal;
    }
    :root{
        --background-color: rgba(40, 41, 35, 255);
        --component-color: rgba(24, 24, 21, 1);
        --primary-color: #222260;
        --primary-color2: rgba(34, 34, 96, .6);
        --primary-color3: rgba(34, 34, 96, .4);
        --color-green: #42AD00;
        --color-grey: #aaa;
        --color-white: #ffff;
        --color-accent: #F56692;
        --color-delete: #FF0000;
        --color-yellow: #FACC15;
        --color-grey: #A8A29E;
        --color-h2: rgba(168, 162, 158, 1);
        --table-color: rgba(28, 25, 23, 1);
        --input-color: rgba(39, 39, 42, 1);
        --category-color: rgba(51, 53, 43, 1);
        --edit-btn: rgba(187, 139, 17, 1);
        --delete-btn: rgba(219, 72, 72, 1);
        --bracket-color: rgba(168, 162, 158, 1);
        --table-row: rgba(40, 41, 35, 1);
        --select-color: rgba(24, 24, 27, 1);
        --modal-color: rgba(24, 24, 27, 1);
    }

    h1, h2, h3, h4, h5, h6{
        color: var(--color-white);
    }

    h3 {
        font-size: 1.5rem;
        font-weight: 600;
        letter-spacing: -.025em;
        line-height: 1;
        margin: 0;
    }

    h2 {
    color: var(--color-h2);
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 400;
    padding: 5px 0;
    } 

    h1 {
        font-size: 1.875rem;
        line-height: 2.25rem;
        font-weight: 600;
    }

    span {
        font-size: 0.875rem;
        line-height: 1.25rem;
        font-weight: bold;
        color: rgba(168, 162, 158, 1);
    }

    p {
        font-size: 2.25rem;
        line-height: 2.5rem;
        font-weight: 700;
    }

    hr {
        margin: 1rem -2rem;
    }

    button {
        border-radius: 20px;
        padding: 0.5rem 1rem;
    }
    .component {
        background: var(--component-color);
        border: 2px solid var(--component-color);
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        border-radius: 20px;
        padding: 1rem 1.25rem;
    }

    .content-container {
        border-radius: 1rem;
        background: var(--table-color);
        padding: 2rem;
    }
    .courier-prime-regular {
        font-family: "Courier Prime", monospace;
        font-weight: 400;
        font-style: normal;
    }
    .courier-prime-bold {
        font-family: "Courier Prime", monospace;
        font-weight: 700;
        font-style: normal;
    }

    .error{
        color: red;
        animation: shake 0.5s ease-in-out;
        @keyframes shake {
            0%{
                transform: translateX(0);
            }
            25%{
                transform: translateX(10px);
            }
            50%{
                transform: translateX(-10px);
            }
            75%{
                transform: translateX(10px);
            }
            100%{
                transform: translateX(0);
            }
        }
    }
`;
