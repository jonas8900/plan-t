import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import RenderInputField from "../renderInputField";
import Image from "next/image";
import { IoMdCloseCircle } from "react-icons/io";
import CustomModal from "../Modals/CustomModal";
import imageCompression from "browser-image-compression";
import { useSession } from "next-auth/react";
import Loading from "../Animations/Loading";

export default function PlantForm({
  handleSubmit,
  plantData,
  handleDeleteFile,
  file,
  setFile,
}) {
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

  if (!plantData) {
    plantData = {};
  }

  const [formData, setFormData] = useState(initialFormState);
  const [modalOpen, setModalOpen] = useState(false);
  const [changedFile, setChangedFile] = useState(false);
  const { data: session } = useSession();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (Object.keys(plantData).length > 0) {
      setFormData(plantData);
    }
  }, [plantData]);

  useEffect(() => {
    if (changedFile) {
      console.log("file changed");
    }
  }, [changedFile]);

  useEffect(() => {
    if (file === null && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [file, modalOpen]);


  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    if (name === "image") {
      setChangedFile(!changedFile);
    }
  }

  function formatDateString(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return isNaN(date) ? "" : date.toISOString().split("T")[0];
  }

  function blobToFile(blob, filename) {
    return new File([blob], filename, { type: blob.type });
  }

  async function handleImageUploadConverter(file) {
    const options = {
      maxSizeMB: 0.3,
      quality: 0.8,
      maxWidthOrHeight: 900,
      useWebWorker: true,
      fileType: "image/webp",
      preserveExif: true,
    };

    try {
      const compressedBlob = await imageCompression(file, options);
      const compressedFile = blobToFile(compressedBlob, file.name);

      return compressedFile;
    } catch (error) {
      console.error("Fehler bei der Komprimierung:", error);
      return file;
    }
  }

  function handleFileChange(event) {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        alert("Datei ist zu groß. Maximale Größe ist 10MB.");
        return;
      }

      handleImageUploadConverter(selectedFile).then((compressedFile) => {
        setFile(compressedFile);
      });
    }
  }

  function handleEmptyImage() {
    if (plantData && plantData.file) {
      if (file === null) {
        handleDeleteFile();
      }
    }
    setFile(null);
    setModalOpen(false);
  }

  async function handleRecognizePlant() {

    if (!session) {
      alert("Bitte melden Sie sich an, um diese Funktion zu nutzen.");
      return;
    }

    if (!file) {
      alert("Bitte zuerst ein Bild auswählen.");
      return;
    }


    setLoading(true);

    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result;
          const base64 = result.split(",")[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

    const imageBase64 = await toBase64(file);

    const data = {
      userId: session.user.id,
      imageBase64,
    };

    const response = await fetch("/api/recognizePlant", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      setLoading(false);
      alert("Es ist ein Fehler aufgetreten, bitte versuche es erneut");
    } else {
      const data = await response.json();

      if (data.error) {
        alert(
          data.error
        );
        setLoading(false);
        return;
      }

      setFormData((prevData) => ({
        ...prevData,
        plantname: data.plantname || prevData.plantname,
        planttype: data.planttype || prevData.planttype,
        description: data.description || prevData.description,
        wateringinterval: data.wateringinterval || prevData.wateringinterval,
      }));

      alert("Pflanze erfolgreich erkannt und Daten ausgefüllt.");
    }
    setLoading(false);
  }

  return (
    <Section>
      <HeadlineAddPlant>Pflanzendaten</HeadlineAddPlant>
      {loading && <Loading />}
      <form onSubmit={(e) => handleSubmit(e, formData)}>
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
          <>
            <InputContainer>
              <StyledPreviewImageContainer>
                <ReactIcon onClick={() => setModalOpen(true)} />
                <StyledPreviewImage
                  src={
                    file instanceof File
                      ? URL.createObjectURL(file)
                      : file || plantData?.file || ""
                  }
                  alt="Vorschau"
                  width={200}
                  height={200}
                />
              </StyledPreviewImageContainer>
            </InputContainer>
            <ButtonContainer>
              <Button type="button" onClick={handleRecognizePlant}>
                Pflanze erkennen
              </Button>
            </ButtonContainer>
          </>
        )}
        {modalOpen && (
          <CustomModal
            message={
              "Wenn Sie auf Bestätigen drücken, wird ihr bisheriges Bild gelöscht"
            }
            onCancel={() => setModalOpen(false)}
            onConfirm={handleEmptyImage}
          />
        )}
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
  color: #ca3838;
  position: absolute;
  top: -1rem;
  right: -1rem;
`;
