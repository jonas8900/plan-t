import styled from "styled-components";

export default function Loading() {
    return (
        <Overlay>
            <AlertBox>
                <StyledHeadline>Erkenne Pflanze...</StyledHeadline>
                <StyledImage src="/images/animation.gif" alt="Loading" width={500} height={500} />
            </AlertBox>
        </Overlay>
    );
}


const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  transition: opacity 0.3s ease-in-out;
`;

const AlertBox = styled.div`
  width: 90%;
  max-width: 400px;
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;


const StyledImage = styled.img`
    width: 100px;
    height: 100px;  
    z-index: 9999;
`;

const StyledHeadline = styled.h1`
    z-index: 9999;
    color: var(--dark-brown-color);
    font-size: 1.5rem;
    font-weight: 500;
    text-align: center;
`;