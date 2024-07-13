import styled from "styled-components";

export const MainLayout = styled.div`
    height: 100%;
    display: flex;
    gap: 1rem;

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 0.5rem;
     }
`;

export const InnerLayout = styled.div`
    padding: 2rem 1.5rem;
    width: 100%;
    @media (max-width: 768px) {
        padding: 1rem;
    }
`;
