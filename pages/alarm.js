import PageHeader from "@/components/PageHeader";
import PageViewer from "@/components/PageViewer";
import ReactIcon from "@/components/Reacticon";
import Link from "next/link";
import React, { useState } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import styled from "styled-components";
import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";
import NeedToLogin from "@/components/NeedToLoginScreen";
import { useRouter } from "next/router";

export default function Alarm() {
  const { data: session } = useSession();
  const router = useRouter();

  if(!session) {
    return (
      <>
      <NeedToLogin />
      </>
    );
  }



      return (
        <>
        <PageHeader />
        <NavigationContainer>
            <IconContainer href="/">
                <ReactIconArrowBack IconComponent={IoArrowBackOutline}/>
            </IconContainer>
            <PageViewer>Alarm</PageViewer>
        </NavigationContainer>
        <Headline>Hier entsteht eine Alarmseite :)</Headline>
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

