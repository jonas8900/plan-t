import PageHeader from "@/components/PageHeader";
import PageViewer from "@/components/PageViewer";
import ReactIcon from "@/components/Reacticon";
import RegistrationForm from "@/components/Forms/RegistrationForm";
import Link from "next/link";
import { IoArrowBackOutline } from "react-icons/io5";

import styled from "styled-components";
import { useState } from "react";
import { useRouter } from "next/router";
import ErrorMessage from "@/components/Toast/ErrorMessage";
import SuccessMessage from "@/components/Toast/SuccessMessage";

export default function Registration() {
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [registered, setRegistered] = useState(false);
  const router = useRouter();


  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    const response = await fetch(`/api/login/registrate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      setShowError(true);
      setToastMessage("Etwas ist schiefgelaufen!");
      setLoading(false);
      setTimeout(() => {
        setShowError(false);
        setToastMessage("");
      }, 5000);
      return;
    } else {
      setShowSuccess(true);
      setToastMessage("Erfolgreich Registriert! 🎉");
      setLoading(false);
      setTimeout(() => {
        setShowSuccess(false);
        setToastMessage("");
        setRegistered(false);
        router.push("/profile");
      }, 5000);
    }
  }

  return (
    <>

      <PageHeader />
      {showError && <ErrorMessage message={toastMessage} />}
      {showSuccess && <SuccessMessage message={toastMessage} />}
      <NavigationContainer>
        <IconContainer href="/">
          <ReactIconArrowBack IconComponent={IoArrowBackOutline} />
        </IconContainer>
        <PageViewer>Registrierung</PageViewer>
      </NavigationContainer>
      <RegistrationForm handleSubmit={handleSubmit} loading={loading} />
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
