import PageHeader from "@/components/PageHeader";
import PageViewer from "@/components/PageViewer";
import ReactIcon from "@/components/Reacticon";
import RegistrationForm from "@/components/Forms/RegistrationForm";
import Link from "next/link";
import { IoArrowBackOutline } from "react-icons/io5";

import styled from "styled-components";

export default function Registration() {
  function handleSubmit(event) {
    event.preventDefault();
    console.log("registration submitted");
  }

  return (
    <>
      <PageHeader />
      <NavigationContainer>
        <IconContainer href="/">
          <ReactIconArrowBack IconComponent={IoArrowBackOutline} />
        </IconContainer>
        <PageViewer>Registrierung</PageViewer>
      </NavigationContainer>
      <RegistrationForm handleSubmit={handleSubmit} />
    </>
  );
}

const NavigationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
`;

const ReactIconArrowBack = styled(ReactIcon)`
  font-size: 2rem;
  color: var(--white-font-and-icon-color);
  display: flex;
  align-items: center;
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
