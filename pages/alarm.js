import PageHeader from "@/components/PageHeader";
import PageViewer from "@/components/PageViewer";
import ReactIcon from "@/components/Reacticon";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import styled from "styled-components";
import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";
import NeedToLogin from "@/components/NeedToLoginScreen";
import NoAlarmsSet from "@/components/NoAlarmsSet";
import Modal from "@/components/InfoModal";
import useSWR from "swr";
import { isPushSupported, requestPushSubscription } from "@/utils";
import { MdAddCircle } from "react-icons/md";

export default function Alarm() {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const { data: plants, isLoading } = useSWR("/api/getPlantsWithoutDetails");
  const { data: alarmData } = useSWR("/api/getAlarms");


  if(!session) {
    return (
      <>
      <NeedToLogin />
      </>
    );
  }

  if (isLoading) {
    return <div>Loading...</div>;
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



  async function handleSubmit(event) {
    event.preventDefault();
    console.log('saved');
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
  
    const alarmTime = new Date(data.alarmtime).toLocaleString([], { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    console.log(alarmTime);

  
    try {
      const subscription = await requestPushSubscription();

      if (subscription) {
        const saveSubscriptionResponse = await fetch('/api/saveSubscription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            plantId: data.alarmplant,
            subscription,
          }),
        });
  
        if (!saveSubscriptionResponse.ok) {
          console.log('Fehler beim Speichern der Subscription');
          throw new Error('Fehler beim Speichern der Subscription');
        }
  
        const addAlarmResponse = await fetch('/api/addAlarm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            plantId: data.alarmplant,
            alarmTime,
            alarmActive: true,
          }),
        });
        console.log(addAlarmResponse);
  
        if (!addAlarmResponse.ok) {
          throw new Error('Fehler beim Hinzufügen des Alarms');
        }
  
        alert('Alarm erfolgreich gesetzt!');
      } else {
        alert('Push-Benachrichtigungen konnten nicht aktiviert werden');
      }
    } catch (error) {
      console.error(error);
      alert('Es gab ein Problem beim Hinzufügen des Alarms.');
    }
  }
  


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
        {alarmData && alarmData.length > 0 ? (
          <>
            <StyledButton onClick={handleModal}>
              <ReactIconAdd IconComponent={MdAddCircle}/>
            </StyledButton>
            {alarmData.map((alarm) => (
              <AlarmDiv key={alarm._id}>
               <p>{alarm.alarmTime.split(",")[1]}</p>
                <p>{alarm.plantname}</p>
                <p>{alarm.alarmTime.split(",")[0]}</p>
                <div>
                  <input type="radio" defaultChecked={alarm.alarmActive} />
                </div>
              </AlarmDiv>
            ))}
          </>
        ) : (
          <NoAlarmsSet onClick={handleModal} />
        )}
        {isModalOpen && (
          <Modal
            isOpen={isModalOpen}
            isClosing={isClosing}
            onClose={toggleModal}
            modaltext="Lege hier deine Alarme an, um dich an deine täglichen Aufgaben zu erinnern."
            modalheadline="Alarme"
          >
          <StyledForm onSubmit={handleSubmit}>
            <StyledLabel htmlFor="alarmplant">Wähle deine Pflanze</StyledLabel>
            <StyledInputSelect id="alarmplant" name="alarmplant" required>
              {plants && plants.map((plant) => (
                <StyledInputOption key={plant._id} value={plant._id}>{plant.plantname}</StyledInputOption>
              ))}
            </StyledInputSelect>
              <StyledLabel htmlFor="alarmtime">Alarmzeit:</StyledLabel>
              <StyledDateInputWrapper>
              <StyledAlarmInput type="datetime-local" id="alarmtime" name="alarmtime" required></StyledAlarmInput>
              <StyledSubmitButton type="submit">Alarm hinzufügen</StyledSubmitButton>
            </StyledDateInputWrapper>
          </StyledForm>
        </Modal>
        )}
        </StyledWrapper>
        <Navbar />
        </>
  );
} 


const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: auto;
`;

const StyledDateInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const StyledLabel = styled.label`
  color: var(--dark-font-color);
  display: flex; 
  flex-direction: column;
  margin-top: 1rem;
  align-self: flex-start;
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
  width: fit-content;
  margin-bottom: 2rem;
  `;


const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: auto;
  height: 100%;
  `;

const StyledSubmitButton = styled.button`
  background-color: var(--dark-green-color);
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;

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

const AlarmDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 92%;
  border: 1px solid rgba(0, 0, 0, 0.13);
  border-radius: 20px;
  margin: 1rem;
  padding: 0.5rem;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.13);
`;

const StyledButton = styled.button`
  background-color: transparent;
  cursor: pointer;
  border-radius: 50%;
  border: none;
`;

const ReactIconAdd = styled(ReactIcon)`
  font-size: 3rem;
  color: var(--dark-green-color);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;