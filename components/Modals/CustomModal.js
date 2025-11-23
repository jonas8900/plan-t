import React from "react";
import styled from "styled-components";

export default function CustomModal({ message, onConfirm, onCancel }) {
  return (
    <Overlay>
      <AlertBox>
        <Message>{message}</Message>
        <ButtonContainer>
          <CancelButton type="button" onClick={onCancel}>Abbrechen</CancelButton>
          <ConfirmButton type="button" onClick={onConfirm}>Bestätigen</ConfirmButton>
        </ButtonContainer>
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
`;

const AlertBox = styled.div`
  width: 90%;
  max-width: 400px;
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  text-align: center;
`;

const Message = styled.p`
  font-size: 1rem;
  color: var(--dark-font-color);
  margin-bottom: 20px;
  font-family: 'Poppins', sans-serif;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;

const CancelButton = styled.button`
  flex: 1;
  background-color: var(--light-brown-color);
  color: var(--dark-font-color);
  padding: 10px;
  border: none;
  border-radius: 5px;
  font-size: 0.9rem;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;

  &:hover {
    background-color: #e0c5b5;
  }
`;

const ConfirmButton = styled.button`
  flex: 1;
  background-color: var(--dark-green-color);
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  font-size: 0.9rem;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;

  &:hover {
    background-color: #4a875c;
  }
`;
