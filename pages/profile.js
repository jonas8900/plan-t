import PageHeader from "@/components/PageHeader";
import PageViewer from "@/components/PageViewer";
import ReactIcon from "@/components/Reacticon";
import Link from "next/link";
import React, { useState } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import styled from "styled-components";
import { MdVisibility } from "react-icons/md";
import Navbar from "@/components/Navbar";

export default function Profile() {
    const [typeSwitch, setTypeSwitch] = useState('password');
    

    function handlePasswortTypeHidden() {
        setTypeSwitch('text');
    }

    function handlePasswortTypeVisibil() {
        setTypeSwitch('password');
    }



      return (
        <>
        <PageHeader />
        <NavigationContainer>
            <IconContainer href="/">
                <ReactIconArrowBack IconComponent={IoArrowBackOutline}/>
            </IconContainer>
            <PageViewer>Profil</PageViewer>
        </NavigationContainer>
        <Headline>Jetzt kostenlos anmelden</Headline>
        <StyledForm>
            <InputContainer>
                <StyledLabel htmlFor="email">Email adresse</StyledLabel>
                <StyledInput type="text" id="email" name="email" required />
            </InputContainer>
            <InputContainer>
                <StyledLabel htmlFor="password">Passwort</StyledLabel>
                <StyledInput type={typeSwitch} id="password" name="password" placeholder="Passwort" required/>
                <VisibilityIconWrapper onTouchEnd={handlePasswortTypeVisibil} onTouchStart={handlePasswortTypeHidden}>
                    <VisibilityIcon IconComponent={MdVisibility}/>
                </VisibilityIconWrapper>
            </InputContainer>
            <ButtonWrapper>
                <SubmitButton type="submit">Login</SubmitButton>
            </ButtonWrapper>
            <ButtonWrapper>
                <RegisterButton type="button">Jetzt registrieren</RegisterButton>
            </ButtonWrapper>
        </StyledForm>
        <Navbar />
        </>
  );
} 




const ReactIconArrowBack = styled(ReactIcon)`
  font-size: 2rem;
  color: var(--white-font-and-icon-color);
  display: flex;
  align-items: center;
`;

const NavigationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
`;

const IconContainer = styled(Link)`
    display: flex;
    align-items: center;
    background-color: var(--dark-green-color);
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
    height: 55%;
    text-decoration: none;
`;

const Headline = styled.h1`
    color: var(--Darker-font-color, #555);
    text-align: center;
    font-size: 1.4375rem;
    font-weight: 500;
    margin: 2rem auto 3rem auto;
`;

const StyledForm = styled.form`

    `;

const StyledLabel = styled.label`
  color: var(--dark-font-color);
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 2rem 2rem;
  position: relative;
`;


const StyledInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #CECECE;
  border-radius: 5px;
  font-family: poppins;
  font-size: 0.9rem;

`;

const VisibilityIconWrapper = styled.div`
    position: absolute;
    right: 0;
    top: 54%;
    cursor: pointer;
`;

const VisibilityIcon = styled(ReactIcon)`
    position: absolute;
    right: 0.5rem;
    top: 54%;
    color: #CECECE;
    font-size: 1.5rem;
    `;

const ButtonWrapper = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 2rem;
`;


const SubmitButton = styled.button`
    background-color: var(--dark-green-color);
    color: var(--white-font-and-icon-color);
    padding: 0.7rem 1rem;
    border: none;
    border-radius: 12px;
    margin-top: 1rem;
    font-size: 1rem;
    font-weight: 600;
    width: 85%;
    `;

const RegisterButton = styled.button`
    background-color: var(--dark-brown-color);
    color: var(--white-font-and-icon-color);
    padding: 0.7rem 1rem;
    border: none;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    width: 85%;
`;