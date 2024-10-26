
import PageHeader from "@/components/PageHeader";
import PageViewer from "@/components/PageViewer";
import ReactIcon from "@/components/Reacticon";
import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";
import useSWR from "swr";
import { IoArrowBackOutline } from "react-icons/io5";
import Image from "next/image";
import { handleWateringInterval } from "@/utils";
import { useState } from "react";
import Modal from "@/components/InfoModal";
import Navbar from "@/components/Navbar";
import QrCodeGenerator from "@/components/QrCodeGenerator";
import { useSession } from "next-auth/react";
import NeedToLogin from "@/components/NeedToLoginScreen";

export default function PlantDetails() {
  const router = useRouter();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isQRCodeModalOpen, setQRCodeModalOpen] = useState(false);
  const [isQRCodeClosing, setIsQRCodeClosing] = useState(false);
  const { data: session } = useSession();
  const { id } = router.query;
  const { data, error, isLoading } = useSWR(id ? `/api/getSinglePlant?id=${id}` : null);

  if (!session) {
    return (
      <>
        <NeedToLogin />
      </>
    );
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading plant details</div>;
  if (!data) return <div>No plant details available</div>;

  if(data.error) {
    alert("Diese Pflanze existiert nicht oder gehört nicht dir");
    router.push("/");
  }

  function toggleModal() {
    if (isModalOpen) {
      setIsClosing(true);
      setTimeout(() => {
        setModalOpen(false);
        setIsClosing(false);
      }, 300);
    } else {
      setModalOpen(true);
    }
  };

  function toggleQrCodeModal() {
    if (isQRCodeModalOpen) {
      setIsQRCodeClosing(true);
      setTimeout(() => {
        setQRCodeModalOpen(false);
        setIsQRCodeClosing(false);
      }, 300);
    } else {
      setQRCodeModalOpen(true);
    }
  }


  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    if(data.userId !== session.user.id) {
      alert("Du hast keine Berechtigung für diese Aktion");
      return false;
    }

    const response = await fetch(`/api/changePlantDates?id=${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  
    if (!response.ok) {
      alert("Es ist ein fehler aufgetreten, bitte versuche es erneut");
    } else {
      await response.json(); 
      alert("Daten wurden erfolgreich aktualisiert");
      toggleModal();
    }
  }

  async function handleDeletePlant() {
    const response = await fetch(`/api/deletePlant?id=${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      alert("Es ist ein fehler aufgetreten, bitte versuche es erneut");
    } else {
      alert("Pflanze wurde erfolgreich gelöscht");
      router.push("/");
    }
  }


  function handleRoutingToEditForm() {
    router.push(`/changeplant/${id}`);
  }


  return (
      <>
          <PageHeader />
          <NavigationContainer>
              <IconContainer href="/">
                  <ReactIconArrowBack IconComponent={IoArrowBackOutline}/>
              </IconContainer>
          <PageViewer>Pflanzendetails</PageViewer>
          </NavigationContainer>
          <PlantHeadline>{data.plantname}</PlantHeadline>
          <PlantSubHeadline>{data.planttype}</PlantSubHeadline>
          <PlantDescription>{data.description}</PlantDescription>
          <StyledButton onClick={toggleModal}>Update eintragen</StyledButton>
          <PlantDetailsContainer>
          <PlantImage src="/images/plant-4427146_640.jpg" alt="Plant image" width={100} height={100}/>
        <DetailsContainer>
          <DetailsCustomFlexContainer>
            {data.size && (
              <DetailsWrapper>
                <DetailCaption>Größe</DetailCaption>
                <DetailValue>{data.size} cm</DetailValue>
              </DetailsWrapper>
            )}
            <DetailsWrapper>
              <DetailCaption>Gießen in</DetailCaption>
              <DetailValue>{handleWateringInterval(data)}</DetailValue>
            </DetailsWrapper>
          </DetailsCustomFlexContainer>
          <DetailsWrapper>
            <DetailCaption>Letztes gießen</DetailCaption>
            <DetailValue>{new Date(data.lastwatering).toLocaleDateString("de-DE")}</DetailValue>
          </DetailsWrapper>
          <DetailsWrapper>
            <DetailCaption>Letztes umtopfen</DetailCaption>
            <DetailValue>{new Date(data.repotting).toLocaleDateString("de-DE")}</DetailValue>
          </DetailsWrapper>
          {data.plantprocurement && (
            <DetailsWrapper>
              <DetailCaption>Beschaffung der Pflanze</DetailCaption>
              <DetailValue>{data.plantprocurement}</DetailValue>
            </DetailsWrapper>
          )}
          {data.purchaseprice && (
            <DetailsWrapper>
              <DetailCaption>Kaufpreis</DetailCaption>
              <DetailValue>{data.purchaseprice},00 €</DetailValue>
            </DetailsWrapper>
          )}
        </DetailsContainer>
        </PlantDetailsContainer>
        <StyledButtonWrapper>
          <StyledQRCodeButton onClick={toggleQrCodeModal}>QR Code drucken</StyledQRCodeButton>
        </StyledButtonWrapper>
      <Modal
        isOpen={isModalOpen}
        isClosing={isClosing} 
        onClose={toggleModal}
        modalheadline={"Termine updaten"}
      >
        <StyledForm onSubmit={handleSubmit}>
          <InputContainer>
            <StyledLabel htmlFor="actionselect">Aktion</StyledLabel>
              <StyledSelect id="actionselect" name="actionselect">
                <option value="lastwatering">gegossen am</option>
                <option value="repotting">umgetopft am</option>
              </StyledSelect>
          </InputContainer>
          <InputContainer>
            <StyledLabel htmlFor="dateforchange">Datum</StyledLabel>
            <StyledInput type="date" id="dateforchange" name="dateforchange" min="2024-01-01" max={new Date().toISOString().split("T")[0]} required></StyledInput>
          </InputContainer>
          <StyledButtonWrapper>
            <StyledButton type="submit">Speichern</StyledButton>
          </StyledButtonWrapper>
        </StyledForm>
      </Modal>
      <PageViewerContainer>
        <StyledChangeButton onClick={handleRoutingToEditForm}>Daten ändern</StyledChangeButton>
        <StyledDeleteButton onClick={handleDeletePlant}>Pflanze löschen</StyledDeleteButton>
      </PageViewerContainer>
      <Navbar />
      <QrCodeGenerator
        isOpen={isQRCodeModalOpen}
        isClosing={isQRCodeClosing}
        onClose={toggleQrCodeModal}
        plantId={data._id}
        data={data}
        modalheadline="QR Code für deine Pflanze"
      />
      </>
  );
}




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

const NavigationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
`;

const PlantHeadline = styled.h1`
  color: var(--Darker-font-color, #555);
  margin: 0.5rem 0 0 2rem;
  font-size: 1.4rem;
  font-style: normal;
  font-weight: 500;
`;

const PlantSubHeadline = styled.h2`
  color: var(--Darker-font-color, #555);
  margin: 0rem 0 0 2rem;
  font-size: 1.2rem;
  font-style: normal;
  font-weight: 400;
`;

const PlantDescription = styled.p`
  color: var(--Darker-font-color, #555);
  margin: 0.5rem 2rem;
  font-size: 0.9rem;
  font-style: normal;
  font-weight: 400;
`;

const StyledButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledButton = styled.button`
  background-color: var(--dark-green-color);
  color: white;
  padding: 0.65rem 1rem;
  border: none;
  border-radius: 12px;
  margin: 0.5rem 2rem;
  font-size: 1rem;
  width: 10rem;
  cursor: pointer;
  height: 2.6rem;
  `;

const StyledQRCodeButton = styled.button`
  background-color: var(--dark-green-color);
  color: white;
  padding: 0.65rem 1rem;
  border: none;
  border-radius: 12px;
  margin: 0.5rem 2rem;
  font-size: 1rem;
  width: 10rem;
  cursor: pointer;
  height: 2.6rem;
  `;

const PlantDetailsContainer = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 2fr;
  grid-template-rows: 1fr;
  margin: 1.5rem 0 1.5rem 0;
`;

const PlantImage = styled(Image)`
  object-fit: cover;
  height: 100%;
  width: 100%;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
`;

const DetailsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  flex-wrap: wrap;
  margin: 0.4rem 1rem 0rem 1rem;
  width: 80%;
  gap: 0.8rem;
`;

const DetailsCustomFlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
`;

const DetailsWrapper = styled.div`
  display: flex; 
  flex-wrap: wrap;
  flex-direction: column;
`;

const DetailCaption = styled.h3`
  font-size: 1rem;
  color: var(--Darker-font-color, #555);
  font-weight: 500;
  margin: 0;
  padding: 0;
`;

const DetailValue = styled.p`
  font-size: 1rem;
  color: var(--Darker-font-color, #555);
  font-weight: 400;
  margin: -8px 0 0 0;
  padding: 0;
`;

const StyledForm = styled.form`
    margin: 2rem 0rem 2rem 0rem;
    `;

const StyledSelect = styled.select`   
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #CECECE;
    border-radius: 5px;
    font-family: sans-serif;
    font-size: 0.9rem;
    `;
    
const StyledLabel = styled.label`   
  color: var(--dark-font-color);
`;

const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin: 1.2rem 0rem 1.2rem 0rem;
    `;


const StyledInput = styled.input`   
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #CECECE;
    border-radius: 5px;
    font-family: poppins;
    font-size: 0.9rem;
    `;


const PageViewerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 3rem;
`;

const StyledChangeButton = styled.button`
  background-color: var(--dark-brown-color);
  color: white;
  padding: 0.4rem;
  border: none;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  font-size: 1rem;
  width: 10rem;
  cursor: pointer;
  height: 2rem;
`;

const StyledDeleteButton = styled.button` 
  background-color: #CA3838;
  color: white;
  padding: 0.4rem;
  border: none;

  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
  font-size: 1rem;
  width: 10rem;
  cursor: pointer;
  height: 2rem;
`;