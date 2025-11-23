import { useState } from "react";
import styled from "styled-components";
import RenderInputField from "../renderInputField";
import Image from "next/image";
import { IoMdCloseCircle } from "react-icons/io";

export default function RegistrationForm({ handleSubmit }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    username: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prevData) => {
      return {
        ...prevData,
        [name]: value,
      };
    });
  }

  return (
    <Section>
      <HeadlineAddPlant>Pflanzendaten</HeadlineAddPlant>
      <form onSubmit={(e) => handleSubmit(e, formData)}>
        <RenderInputField
          label={"Benutzername"}
          type={"text"}
          name={"username"}
          placeholder={"Pflanzenfreund123"}
          formData={formData}
          handleChange={handleChange}
          required
        />

        <RenderInputField
          label={"Name"}
          type={"text"}
          name={"name"}
          placeholder={"z.B. Max Mustermann"}
          formData={formData}
          handleChange={handleChange}
          required
        />

        <RenderInputField
          label={"E-mail Adresse"}
          type={"email"}
          name={"email"}
          placeholder={"z.B. max.mustermann@example.com"}
          formData={formData}
          handleChange={handleChange}
          required
        />

        <RenderInputField
          label={"Passwort"}
          type={"password"}
          name={"password"}
          placeholder={"Ihr Passwort"}
          formData={formData}
          handleChange={handleChange}
          required
        />

        <ButtonContainer>
          <Button type="submit">Speichern</Button>
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
