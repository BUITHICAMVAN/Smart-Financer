import {createGlobalStyle} from 'styled-components'

export const GlobalStyle = createGlobalStyle`
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        list-style: none;
    }

    :root{
        --background-color: rgba(40, 41, 35, 255);
        --component-color:
        --primary-color: #222260;
        --primary-color2: 'color: rgba(34, 34, 96, .6)';
        --primary-color3: 'color: rgba(34, 34, 96, .4)';
        --color-green: #42AD00;
        --color-grey: #aaa;
        --color-white: #ffff;
        --color-accent: #F56692;
        --color-delete: #FF0000;
        --color-yellow: #FACC15;
        --color-grey: #A8A29E;
    }

    h1, h2, h3, h4, h5, h6{
        color: var(--color-white);
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

    body {
        font-family: "Montserrat", sans-serif;
        letter-spacing: .025rem
    }
`;