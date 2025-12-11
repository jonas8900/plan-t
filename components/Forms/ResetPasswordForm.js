import { useState } from "react";
import styled from "styled-components";
import RenderInputField from "../renderInputField";
import ErrorMessage from "../Toast/ErrorMessage";
import SuccessMessage from "../Toast/SuccessMessage";
import { useRouter } from "next/router";
import { handleChange } from "@/lib/helper";


export default function ResetPasswordForm() {
      const router = useRouter();
      const [newPassword, setNewPassword] = useState("");
      const [confirmPassword, setConfirmPassword] = useState("");
      const [error, setError] = useState("");
      const [loading, setLoading] = useState(false);
      const [toastMessage, setToastMessage] = useState("");
      const [showError, setShowError] = useState(false);
      const [showSuccess, setShowSuccess] = useState(false);
      const [disabled, setDisabled] = useState(false);
      const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: "",
      });


      async function handleSubmit(e){
    
        e.preventDefault();
        setLoading(true);
        setError("");
        setDisabled(true);

    
    
        if (formData.newPassword !== formData.confirmPassword) {
          setError("Die Passwörter stimmen nicht überein.");
          setLoading(false);
          return;
        }
    
        if (formData.newPassword.length < 8) {
          setError("Das Passwort muss mindestens 8 Zeichen lang sein.");
          setLoading(false);
          return;
        }
           
        const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (!specialCharacterRegex.test(formData.newPassword)) {
            setError("Das Passwort muss mindestens ein Sonderzeichen enthalten.");
            setLoading(false);
            return;
          }
     console.log("Submitting new password:", formData.newPassword);
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
            }),
          });
    
            const data = await response.json();
            if (!response.ok) {
                setShowError(true);
                setError(data.message || "Fehler beim Zurücksetzen des Passworts.");
                setLoading(false);
                return;
                }
            setError("");
            setNewPassword("");
            setConfirmPassword("");
                
            
            setShowSuccess(true);
            setToastMessage("Passwort erfolgreich zurückgesetzt! 🎉");
            setTimeout(() => {
              setShowSuccess(false);
              setToastMessage("");
              router.push("/profile");
              setLoading(false);
            }, 5000);
        }
        catch (error) {
          console.error("Fehler beim Zurücksetzen des Passworts:", error);
          setShowError(true);
          setError("Fehler beim Zurücksetzen des Passworts.");
          setLoading(false);
          setTimeout(() => {
              setShowError(false);
              setToastMessage("");
            }, 5000);
        }
        setDisabled(false);
      };
    

    return (
      <>

        <Section>
          <HeadlineAddPlant>Passwort zurücksetzen</HeadlineAddPlant>
          {showError && <ErrorMessage message={toastMessage} /> }
          {showSuccess && <SuccessMessage message={toastMessage} />}
          <form onSubmit={(e) => handleSubmit(e, formData)}>
            <RenderInputField
              label={"Neues Passwort"}
              type={"password"}
              name={"newPassword"}
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
              <Button type="submit">Speichern</Button>
            </ButtonContainer>
          </form>
        </Section>
      </>
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

