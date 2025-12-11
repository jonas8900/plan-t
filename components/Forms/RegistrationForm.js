import { useState } from "react";
import styled from "styled-components";
import RenderInputField from "../renderInputField";
import Image from "next/image";
import { IoMdCloseCircle } from "react-icons/io";
import { handleChange } from "@/lib/helper";

export default function RegistrationForm({ handleSubmit, loading }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    username: "",
  });


  return (
    <Section>
      <HeadlineAddPlant>Registrieren</HeadlineAddPlant>
      <form onSubmit={(e) => handleSubmit(e, formData)}>
        <RenderInputField
          label={"Benutzername"}
          type={"text"}
          name={"username"}
          placeholder={"Pflanzenfreund123"}
          formData={formData}
          handleChange={(event) => handleChange(event, setFormData)}
          required
        />

        <RenderInputField
          label={"Name"}
          type={"text"}
          name={"name"}
          placeholder={"z.B. Max Mustermann"}
          formData={formData}
          handleChange={(event) => handleChange(event, setFormData)}
          required
        />

        <RenderInputField
          label={"E-mail Adresse"}
          type={"email"}
          name={"email"}
          placeholder={"z.B. max.mustermann@example.com"}
          formData={formData}
          handleChange={(event) => handleChange(event, setFormData)}
          required
        />

        <RenderInputField
          label={"Passwort"}
          type={"password"}
          name={"password"}
          placeholder={"Ihr Passwort"}
          formData={formData}
          handleChange={(event) => handleChange(event, setFormData)}
          required
        />

        <ButtonContainer>
          <Button type="submit" disabled={loading}>{loading ? "Lädt..." : "Speichern"}</Button>
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
