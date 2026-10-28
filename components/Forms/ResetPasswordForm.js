import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import RenderInputField from "../renderInputField";
import ErrorMessage from "../Toast/ErrorMessage";
import SuccessMessage from "../Toast/SuccessMessage";
import { useRouter } from "next/router";
import { handleChange } from "@/lib/helper";

export default function ResetPasswordForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  function triggerErrorToast(message) {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setShowError(false);
    setError(message);
    setTimeout(() => {
      setShowError(true);
    }, 0);

    timerRef.current = setTimeout(() => {
      setShowError(false);
      setError("");
    }, 5000);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setDisabled(true);

    try {
      const { token } = router.query;
      const response = await fetch("/api/login/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword: formData.newPassword,
          confirmedPassword: formData.confirmPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        triggerErrorToast(
          data?.message || "Fehler beim Zurücksetzen des Passworts."
        );
        setDisabled(false);
        return;
      }

      setShowError(false);
      setError("");
      setShowSuccess(true);
      setToastMessage("Passwort erfolgreich zurückgesetzt! 🎉");

      timerRef.current = setTimeout(() => {
        setShowSuccess(false);
        setToastMessage("");
        router.push("/profile");
      }, 5000);
    } catch (err) {
      console.error("Fehler beim Zurücksetzen des Passworts:", err);
      triggerErrorToast("Fehler beim Zurücksetzen des Passworts.");
      setDisabled(false);
    }
  }

  return (
    <Section>
      <HeadlineAddPlant>Passwort zurücksetzen</HeadlineAddPlant>
      {showError && <ErrorMessage message={error} />}
      {showSuccess && <SuccessMessage message={toastMessage} />}
      <form onSubmit={(e) => handleSubmit(e, formData)}>
        <RenderInputField
          label={"Neues Passwort"}
          type={"password"}
          name={"newPassword"}
          infotext={
            "Das Passwort benötigt mindestens 8 Zeichen, eine Zahl, einen Klein- sowie einen Großbuchstaben und ein Sonderzeichen"
          }
          placeholder={"Ihr neues Passwort"}
          formData={formData}
          handleChange={(event) => handleChange(event, setFormData)}
          required
        />

        <RenderInputField
          label={"Passwort bestätigen"}
          type={"password"}
          name={"confirmPassword"}
          placeholder={"Ihr Passwort bestätigen"}
          formData={formData}
          handleChange={(event) => handleChange(event, setFormData)}
          required
        />

        <ButtonContainer>
          <Button type="submit" disabled={disabled}>
            Speichern
          </Button>
        </ButtonContainer>
      </form>
    </Section>
  );
}

const Section = styled.section`
  margin: auto 2rem;
`;

const HeadlineAddPlant = styled.h1`
  font-size: 1.125rem;
  text-decoration-line: underline;
  color: var(--dark-font-color);
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const Button = styled.button`
  background-color: var(--dark-green-color);
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  margin-top: 1rem;
  width: 100%;
`;
