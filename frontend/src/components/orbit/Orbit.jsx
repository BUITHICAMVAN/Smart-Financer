import React from 'react'
import styled, { keyframes } from 'styled-components'
import { useWindowSize } from '../../utils/UseWindowSize';

function Orbit() {

    const {width, height} = useWindowSize()

    console.log(width, height)

    const moveOrb = keyframes`
        0%{
            transform: translate(0, 0);
        }
        50%{
            transform: translate(${width}px, ${height/2}px);
        }
        100%{
            transform: translate(0, 0);
        }
    `

    const OrbStyled = styled.div`
        width: 35vh;
        height: 35vh;
        position: absolute;
        border-radius: 50%;
        margin-left: -37vh;
        margin-top: -37vh;
        background: linear-gradient(180deg, #FFEB3B 0%, #FFA726 100%);
        filter: blur(400px);
        animation: ${moveOrb} 10s alternate linear infinite;
    `;

    return (
        <OrbStyled></OrbStyled>
    )
}

export default Orbit