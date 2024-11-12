import PageHeader from "@/components/PageHeader";
import PageViewer from "@/components/PageViewer";
import ReactIcon from "@/components/Reacticon";
import Link from "next/link";
import React, { useState } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import styled from "styled-components";
import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";
import NeedToLogin from "@/components/NeedToLoginScreen";
import { useRouter } from "next/router";
import NoAlarmsSet from "@/components/NoAlarmsSet";
import CustomModal from "@/components/CustomModal";
import { set } from "mongoose";
import Modal from "@/components/InfoModal";
import useSWR from "swr";

export default function Alarm() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const { data, isLoading } = useSWR("/api/getPlantsWithoutDetails");

  if(!session) {
    return (
      <>
      <NeedToLogin />
      </>
    );
  }


  const toggleModal = () => {
    if (isModalOpen) {
      setIsClosing(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setIsClosing(false);
      }, 300);
    } else {
      setIsModalOpen(true);
    }
  };

  function handleModal() {
    setIsModalOpen(!isModalOpen);
  }

  function handleSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const Data = Object.fromEntries(formData);

    console.log(Data);
  }

  const mapArray = data.map((plant) => {
    console.log(plant.plantname);
    console.log(plant._id);
  }
  );
  console.log(mapArray);

      return (
        <>
        <PageHeader />
        <NavigationContainer>
            <IconContainer href="/">
                <ReactIconArrowBack IconComponent={IoArrowBackOutline}/>
            </IconContainer>
            <PageViewer>Alarm</PageViewer>
        </NavigationContainer>
        <StyledWrapper>
        <NoAlarmsSet onClick={handleModal}/>
        {isModalOpen && (
          <Modal
            isOpen={isModalOpen}
            isClosing={isClosing}
            onClose={toggleModal}
            modaltext="Lege hier deine Alarme an, um dich an deine täglichen Aufgaben zu erinnern."
            modalheadline="Alarme"
          >
          <form onSubmit={handleSubmit}>
            <StyledLabel htmlFor="alarmtime">Wähle deine Pflanze</StyledLabel>
            <StyledInputSelect type="time" id="alarmtime" name="alarmtime" required>
              {data && data.map((plant) => (
                <StyledInputOption key={plant._id} value={plant._id}>{plant.plantname}</StyledInputOption>
              ))}
            </StyledInputSelect>
            <StyledLabel htmlFor="alarmtime">Alarmzeit:</StyledLabel>
            <StyledAlarmInput type="time" id="alarmtime" name="alarmtime" required></StyledAlarmInput>
            <button type="submit">Alarm hinzufügen</button>
          </form>
        </Modal>
        )}
        </StyledWrapper>
        <Navbar />
        </>
  );
} 


const StyledLabel = styled.label`
  color: var(--dark-font-color);
  display: flex; 
  flex-direction: column;
  margin-top: 1rem;
  `;

const StyledInputOption = styled.option`
  color: var(--dark-font-color);
  padding: 0.5rem;
  border: 1px solid #cecece;
  border-radius: 5px;
  font-family: poppins;
  font-size: 0.9rem;
`;

const StyledInputSelect = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #cecece;
  border-radius: 5px;
  font-family: poppins;
  font-size: 0.9rem;
  `;

  const StyledAlarmInput = styled.input`
    width: 40%;
    padding: 0.5rem;
    border: 1px solid #cecece;
    border-radius: 5px;
    font-family: poppins;
    font-size: 0.9rem;
  `;


const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: auto;
  height: 100%;
  `;


const ReactIconArrowBack = styled(ReactIcon)`
  font-size: 2rem;
  color: var(--white-font-and-icon-color);
  display: flex;
  align-items: center;
`;

const NavigationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
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

const Headline = styled.h1`
    color: var(--Darker-font-color, #555);
    text-align: center;
    font-size: 1.4375rem;
    font-weight: 500;
    margin: 2rem auto 3rem auto;
`;

