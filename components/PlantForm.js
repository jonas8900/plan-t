import { useState, useEffect } from "react";
import styled from "styled-components";
import RenderInputField from "./renderInputField";

export default function PlantForm({ handleSubmit, plantData }) {
  const initialFormState = {
    plantname: "",
    planttype: "",
    description: "",
    size: "",
    purchaseprice: "",
    plantprocurement: "",
    lastwatering: "",
    wateringinterval: "",
    repotting: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (plantData) {
      setFormData((prevData) => ({ ...prevData, ...plantData }));
    }
  }, [plantData]);


  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  function formatDateString(dateString) {
    if (!dateString) return ""; 
    const date = new Date(dateString);
    return isNaN(date) ? "" : date.toISOString().split("T")[0];
  };

  const renderInputField = (label, type, name, placeholder, required = false, additionalProps = {}) => (
    <InputContainer>
      <StyledLabel htmlFor={name}>{label}{required && "*"}</StyledLabel>
      <StyledInput
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        value={formData[name]}
        onChange={handleChange}
        required={required}
        {...additionalProps}
      />
    </InputContainer>
  );

  return (
    <Section>
      <HeadlineAddPlant>Pflanzendaten</HeadlineAddPlant>
      <form onSubmit={handleSubmit}>
        <RenderInputField
          label={"Name der Pflanze"}
          type={"text"}
          name={"plantname"}
          placeholder={"z.B. Bonsai"}
          formData={formData}
          handleChange={handleChange}
          required={true}
        />
        <RenderInputField
          label={"Pflanzentyp"}
          type={"text"}
          name={"planttype"}
          placeholder={"z.B. Juniperus chinensis"}
          formData={formData}
          handleChange={handleChange}
          required={true}
        />
        <InputContainer>
          <StyledLabel htmlFor="description">Beschreibung</StyledLabel>
          <StyledTextArea
            id="description"
            name="description"
            placeholder="z.B. Diese Pflanze benötigt extrem viel Licht..."
            rows={3}
            maxLength={120}
            value={formData.description}
            onChange={handleChange}
          />
        </InputContainer>
        <SmallInputWrapper>
          <RenderInputField
            label={"Größe (in cm)"}
            type={"number"}
            name={"size"}
            placeholder={"cm"}
            formData={formData}
            handleChange={handleChange}
            required={false}
            additionalProps={{ min: 1 }}
          />
          <RenderInputField
            label={"Kaufpreis (in €)"}
            type={"number"}
            name={"purchaseprice"}
            placeholder={"€"}
            formData={formData}
            handleChange={handleChange}
            required={false}
            additionalProps={{ min: 0, step: "any" }}
          />
        </SmallInputWrapper>
        <RenderInputField
          label={"Beschaffung der Pflanze"}
          type={"text"}
          name={"plantprocurement"}
          placeholder={"z.B. Ableger"}
          formData={formData}
          handleChange={handleChange}
          required={false}
          />
        <InputContainerFile>
          <StyledFileUploadLabel htmlFor="picture">Bild hochladen</StyledFileUploadLabel>
          <StyledInput type="file" id="picture" name="picture" />
        </InputContainerFile>

        <HeadlineAddPlant>Intervalldaten</HeadlineAddPlant>
        <InputContainer>
          <StyledLabel htmlFor="lastwatering">Letztes Gießen*</StyledLabel>
          <StyledDateInput
            type="date"
            id="lastwatering"
            name="lastwatering"
            value={formatDateString(formData.lastwatering)}
            onChange={handleChange}
            min="2024-01-01"
            max={new Date().toISOString().split("T")[0]}
            required
          />
        </InputContainer>
        <RenderInputField
          label={"Gießintervall (in Tagen)"}
          type={"number"}
          name={"wateringinterval"}
          placeholder={"z.B. 2"}
          formData={formData}
          handleChange={handleChange}
          required={true}
          additionalProps={{ min: 1 }}
        />
        <InputContainer>
          <StyledLabel htmlFor="lastwatering">Letztes Umtopfen*</StyledLabel>
          <StyledDateInput
            type="date"
            id="repotting"
            name="repotting"
            value={formatDateString(formData.repotting)}
            onChange={handleChange}
            min="2024-01-01"
            max={new Date().toISOString().split("T")[0]}
            required
          />
        </InputContainer>
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

const StyledLabel = styled.label`
  color: var(--dark-font-color);
`;

const StyledFileUploadLabel = styled.label`
  background-color: var(--dark-brown-color);
  color: white;
  padding: 0.5rem;
  border-radius: 0.3rem;
  cursor: pointer;
  margin-top: 1rem;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 1.2rem 0;
`;

const SmallInputWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
`;

const InputContainerFile = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 1.2rem 0 2rem 0;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #CECECE;
  border-radius: 5px;
  font-family: poppins;
  font-size: 0.9rem;
`;

const StyledDateInput = styled.input`
  width: 50%;
  padding: 0.5rem;
  border: 1px solid #CECECE;
  border-radius: 5px;
  font-family: poppins;
  font-size: 0.9rem;
`;

const StyledTextArea = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #CECECE;
  border-radius: 5px;
  font-family: poppins;
  font-size: 0.9rem;
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
