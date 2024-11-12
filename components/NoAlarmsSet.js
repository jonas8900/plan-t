import styled from "styled-components";
import ReactIcon from "./Reacticon";
import { MdAddCircle } from "react-icons/md";
import { useState } from "react";

export default function NoAlarmsSet({ className, onClick }) {


  return (
    <StyledContainer className={className}>
      <StyledHeadline>Derzeit sind keine Alarme gestellt</StyledHeadline>
      <StyledButton onClick={onClick}>
        <ReactIconAdd IconComponent={MdAddCircle}/>
      </StyledButton>
      <StyledParagraph>neuen Alarm hinzufügen</StyledParagraph>
    </StyledContainer>
  );
}




const StyledContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 20%;
`;


const StyledHeadline = styled.h1`
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 0;
`;

const StyledParagraph = styled.p`
    font-size: 14px;
    font-weight: 400;
    margin-top: 0;
`;

const ReactIconAdd = styled(ReactIcon)`
  font-size: 8rem;
  color: var(--dark-green-color);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  `;

  const StyledButton = styled.button`
  background-color: transparent;
  cursor: pointer;
  border-radius: 50%;
  border: none;
  `;