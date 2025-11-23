import PageHeader from "@/components/PageHeader";
import PageViewer from "@/components/PageViewer";
import ReactIcon from "@/components/Reacticon";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import styled from "styled-components";
import { MdVisibility } from "react-icons/md";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import useSWR from "swr";

export default function Profile() {
    const [typeSwitch, setTypeSwitch] = useState('password');
    const { data: session } = useSession();
    const { data } = useSWR("/api/getPlants");
    const [googleSignIn, setGoogleSignIn] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    let PlantCosts = 0;

    if(session && data) {
        for (let i = 0; i < data.length; i++) {
            console.log(data[i].purchaseprice);
            if(data[i].purchaseprice){
                PlantCosts = PlantCosts + data[i].purchaseprice;
            }
            else {
                PlantCosts = PlantCosts + 0;
            }
        }
    }



    function handlePasswortTypeHidden() {
        setTypeSwitch('text');
    }

    function handlePasswortTypeVisibil() {
        setTypeSwitch('password');
    }

    // zurücksetzten der credentials vor dem google sign in aufgrund der signIn Methode von nextauth
    function handleSignIn() {
        setGoogleSignIn(true);
        signIn("google");
    }


      return (
        <>
            <PageHeader />
        {session ? (
            <>
                <NavigationContainer>
                    <IconContainer href="/">
                        <ReactIconArrowBack IconComponent={IoArrowBackOutline}/>
                    </IconContainer>
                    <PageViewer>Profil</PageViewer>
                </NavigationContainer>
                <InputContainer>
                    <StyledLabel htmlFor="name">Name</StyledLabel>
                    <StyledInput type="text" id="name" name="name" placeholder="name" value={session.user?.name} readOnly/>
                </InputContainer>
                <InputContainer>
                    <StyledLabel htmlFor="email">Email adresse</StyledLabel>
                    <StyledInput type="text" id="email" name="email" placeholder="email" value={session.user?.email} readOnly/>
                </InputContainer>
                {data && data.length > 0 && (
                <SmallInputWrapper>
                    <InputContainerSmall>
                        <StyledLabel htmlFor="yourplants">Pflanzen</StyledLabel>
                        <StyledInputSmall type="text" id="yourplants" name="yourplants" placeholder="your plants" value={data.length} readOnly />
                    </InputContainerSmall> 
                    <InputContainerSmall>
                        <StyledLabel htmlFor="costs">Gesamtkosten</StyledLabel>
                        <StyledInputSmall type="text" id="costs" name="costs" placeholder="costs" value={PlantCosts + ",00 €"} readOnly />
                    </InputContainerSmall>
                </SmallInputWrapper>
                )}
                <StyledLogoutButton>
                    <SubmitButtonLogOut onClick={() => signOut()}>Logout</SubmitButtonLogOut>
                </StyledLogoutButton>
                <Navbar />
            </>
        ):(
            <>
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
                    <StyledInput type="text" id="email" name="email" placeholder="email" value={googleSignIn ? "" : email} onChange={(e) => setEmail(e.target.value)} required />
                </InputContainer>
                <InputContainer>
                    <StyledLabel htmlFor="password">Passwort</StyledLabel>
                    <StyledInput type={typeSwitch} id="password" name="password" placeholder="Passwort" value={googleSignIn ? "" : password} onChange={(e) => setPassword(e.target.value)} required/>
                    <VisibilityIconWrapper onTouchEnd={handlePasswortTypeVisibil} onTouchStart={handlePasswortTypeHidden}>
                        <VisibilityIcon IconComponent={MdVisibility}/>
                    </VisibilityIconWrapper>
                </InputContainer>
                <ButtonWrapper>
                    <SubmitButton type="submit">Login</SubmitButton>
                </ButtonWrapper>
                <StyledLine><StyledDiv></StyledDiv><StyledParagraphLine>oder</StyledParagraphLine><StyledDiv></StyledDiv></StyledLine>
                <StyledGoogleWrapper>
                        <StyledGoogleButton onClick={handleSignIn}><Image src="../icons/icons8-google.svg" alt="google-icon" width={22} height={22}/>Login mit Google</StyledGoogleButton>
                </StyledGoogleWrapper>
                <StyledRegisterLink href="/registration">Noch keinen Account? Jetzt Registrieren</StyledRegisterLink>
            </StyledForm>
        
            </>
        )}
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
    margin: 1.5rem auto 2rem auto;
`;

const StyledForm = styled.form`

    `;


const SmallInputWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
`;


const StyledLogoutButton = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 2rem;
    padding: 1rem;
    margin-left: 4rem;
    margin-right: 4rem;
`;

const SubmitButtonLogOut = styled.button`
    color: var(--white-font-and-icon-color);
    background-color: #CA3838;
    border: none;
    border-radius: 1rem;
    width: 100%;
    cursor: pointer;
    height: 44px;
    display: flex; 
    justify-content: center;
    align-items: center;
    font-weight: 500;
    font-size: 1rem;
    display: flex;
    gap: 0.3rem;
`;



const StyledRegisterLink = styled(Link)`
    color: var(--dark-brown-color);
    text-decoration: none;
    font-size: 0.8rem;
    display: flex;
    justify-content: center;
    margin-top: 1rem;

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


const InputContainerSmall = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0rem 2rem 0rem 2rem;
  width: 30%;

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

const StyledInputSmall = styled.input`
    padding: 0.5rem;
    border: 1px solid #CECECE;
    border-radius: 5px;
    font-family: poppins;
    font-size: 0.9rem;
    height: 2rem;
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
    padding: 1rem;
    margin-left: 1rem;
    margin-right: 1rem;
`;


const SubmitButton = styled.button`
    background-color: white;
    color: var(--white-font-and-icon-color);
    background-color: var(--dark-green-color);
    border: none;
    border-radius: 1rem;
    width: 100%;
    cursor: pointer;
    height: 44px;
    display: flex; 
    justify-content: center;
    align-items: center;
    font-weight: 500;
    font-size: 1rem;
    display: flex;
    gap: 0.3rem;
    `;


const StyledLine = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
`;

const StyledDiv = styled.div`
    background-color: var(--dark-font-color);
    height: 1px;
    width: 40%;
`;

const StyledParagraphLine = styled.p`
    color: var(--dark-font-color);
    font-size: 0.8rem;
`;


const StyledGoogleWrapper = styled.div`
    padding: 1rem;
    margin-left: 1rem;
    margin-right: 1rem;
`;

const StyledGoogleButton = styled.button`
    background-color: white;
    color: var(--white-font-and-icon-color);
    background-color: var(--dark-brown-color);
    border: none;
    border-radius: 1rem;
    width: 100%;
    cursor: pointer;
    height: 44px;
    display: flex; 
    justify-content: center;
    align-items: center;
    font-weight: 500;
    font-size: 0.9rem;
    display: flex;
    gap: 0.3rem;
`;


