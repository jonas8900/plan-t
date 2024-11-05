import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import RenderInputField from "./renderInputField";
import Image from "next/image";
import { IoMdCloseCircle } from "react-icons/io";
import { set } from "mongoose";
import CustomModal from "./CustomModal";

export default function PlantForm({ handleSubmit, plantData, handleDeleteFile }) {
  const initialFormState = {
    plantname: "",
    planttype: "",
    description: "",
    size: "",
    purchaseprice: "",
    plantprocurement: "",
    lastwatering: "",
    file: "",
    wateringinterval: "",
    repotting: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [file, setFile] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const fileInputRef = useRef(null);


  useEffect(() => {
    if (plantData) {
      setFormData((prevData) => ({ ...prevData, ...plantData }));
    }
  }, [plantData]);

  useEffect(() => {
    if (file === null && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [file]);


  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }

  function formatDateString(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return isNaN(date) ? "" : date.toISOString().split("T")[0];
  }

  function handleFileChange(event) {
    
    const selectedFile = event.target.files[0];
    


    if (selectedFile) {
      if (selectedFile.size > 3 * 1024 * 1024) {
        alert("Datei ist zu groß. Maximale Größe ist 3MB.");
        return;
      }
      setFile(URL.createObjectURL(selectedFile));
      setFormData((prevData) => ({ ...prevData, file: selectedFile.name }));
    } 
  }

  function handleEmptyImage() {
    if(plantData && plantData.file) {
      if(file === null) {
        handleDeleteFile();
      }
    }
    setFile(null);
    setModalOpen(false);
    
  }


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
            additionalprops={{ min: 1 }}
          />
          <RenderInputField
            label={"Kaufpreis (in €)"}
            type={"number"}
            name={"purchaseprice"}
            placeholder={"€"}
            formData={formData}
            handleChange={handleChange}
            required={false}
            additionalprops={{ min: 0, step: "any" }}
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
          <StyledFileUploadLabel htmlFor="image">
            Bild hochladen
          </StyledFileUploadLabel>
          <StyledInput 
          type="file" 
          id="image" 
          name="image" 
          accept="image/*"
          formData={formData}
          onChange={handleFileChange}
          ref={fileInputRef}
          disabled={plantData.file ? true : false}
          />
          {plantData.file && (
            <p>Um ein neues Bild hochzuladen, muss das alte entfernt werden</p>
          )}
        </InputContainerFile>
        {(file || (plantData && plantData.file)) && (
        <InputContainer>
          <StyledPreviewImageContainer>
            <ReactIcon onClick={() => setModalOpen(true)} />
            <StyledPreviewImage
              src={file ? file : plantData.file}
              alt="Vorschau"
              width={200}
              height={200}
            />
          </StyledPreviewImageContainer>
        </InputContainer>
        )}
        {modalOpen && (
          <CustomModal message={"Wenn Sie auf Bestätigen drücken, wird ihr bisheriges Bild gelöscht"} onCancel={() => setModalOpen(false)} onConfirm={handleEmptyImage} />
        )}
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
          additionalprops={{ min: 1 }}
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
  border: 1px solid #cecece;
  border-radius: 5px;
  font-family: poppins;
  font-size: 0.9rem;
`;

const StyledPreviewImageContainer = styled.div`
  position: relative;
`;

const StyledPreviewImage = styled(Image)`
  width: 100%;
  height: auto;
  border-radius: 12px;
`;

const StyledDateInput = styled.input`
  width: 50%;
  padding: 0.5rem;
  border: 1px solid #cecece;
  border-radius: 5px;
  font-family: poppins;
  font-size: 0.9rem;
`;

const StyledTextArea = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #cecece;
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

const ReactIcon = styled(IoMdCloseCircle)`
  font-size: 2rem;
  color: #CA3838;;
  position: absolute;
  top: -1rem;
  right: -1rem;
`;