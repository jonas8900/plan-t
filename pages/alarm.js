import PageHeader from "@/components/PageHeader";
import PageViewer from "@/components/PageViewer";
import ReactIcon from "@/components/Reacticon";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import styled from "styled-components";
import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";
import NeedToLogin from "@/components/NeedToLoginScreen";
import NoAlarmsSet from "@/components/NoAlarmsSet";
import Modal from "@/components/Modals/InfoModal";
import useSWR from "swr";
import { isPushSupported, requestPushSubscription } from "@/utils";
import { MdAddCircle } from "react-icons/md";
import { FaTrash } from "react-icons/fa";

export default function Alarm() {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const { data: plants, isLoading } = useSWR("/api/getPlantsWithoutDetails");
  const { data: alarmData } = useSWR("/api/getAlarms");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [alarmID, setAlarmID] = useState(null);
  const [isAlarmActive, setIsAlarmActive] = useState({});
  const timeoutRef = useRef(null);

  if (!session) {
    return (
      <>
        <NeedToLogin />
      </>
    );
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  function toggleModal() {
    if (isModalOpen) {
      setIsClosing(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setIsClosing(false);
      }, 300);
    } else {
      setIsModalOpen(true);
    }
  }

  function handleModal() {
    setIsModalOpen(!isModalOpen);
  }

  function handleTouchStart(id) {
    timeoutRef.current = setTimeout(() => {
      setDeleteModalOpen(true);
      setAlarmID(id);
    }, 500);
  }

  function handleTouchEnd() {
    clearTimeout(timeoutRef.current);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    console.log("saved");

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    const alarmTime = new Date(data.alarmtime).toLocaleString([], {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    try {
      const subscription = await requestPushSubscription();

      if (subscription) {
        const saveSubscriptionResponse = await fetch("/api/saveSubscription", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            plantId: data.alarmplant,
            subscription,
          }),
        });

        if (!saveSubscriptionResponse.ok) {
          console.log("Fehler beim Speichern der Subscription");
          throw new Error("Fehler beim Speichern der Subscription");
        }

        const addAlarmResponse = await fetch("/api/addAlarm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            plantId: data.alarmplant,
            alarmTime,
            alarmActive: true,
          }),
        });

        if (!addAlarmResponse.ok) {
          throw new Error("Fehler beim Hinzufügen des Alarms");
        }

        alert("Alarm erfolgreich gesetzt!");
        toggleModal();
      } else {
        alert("Push-Benachrichtigungen konnten nicht aktiviert werden");
      }
    } catch (error) {
      console.error(error);
      alert("Es gab ein Problem beim Hinzufügen des Alarms.");
    }
  }

  async function handleDeleteAlarm(id) {
    console.log(id);
    const response = await fetch("/api/deleteAlarms", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (response.ok) {
      alert("Alarm erfolgreich gelöscht!");
      setDeleteModalOpen(false);
    } else {
      alert("Es gab ein Problem beim Löschen des Alarms.");
    }
  }

  async function handleToggle(id) {
    console.log("ID:", id);

    try {
      const response = await fetch("/api/updateAlarm", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error("Fehler beim Aktualisieren des Alarms");
      }

      const data = await response.json();
      if (data) {
        setIsAlarmActive({
          ...isAlarmActive,
          [data.plant.alarmID]: data.plant.alarmActive,
        });
      }
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Alarms:", error);
    }
  }

  function handleCheckIfAlarmIsActive(alarmID) {
    return isAlarmActive[alarmID];
  }

  return (
    <>
      <PageHeader />
      <NavigationContainer>
        <IconContainer href="/">
          <ReactIconArrowBack IconComponent={IoArrowBackOutline} />
        </IconContainer>
        <PageViewer>Alarm</PageViewer>
      </NavigationContainer>
      <StyledWrapper>
        {alarmData && alarmData.length > 0 ? (
          <>
            <StyledButton onClick={handleModal}>
              <ReactIconAdd IconComponent={MdAddCircle} />
            </StyledButton>
            {alarmData.map((alarm) => (
              <AlarmDiv
                key={alarm._id}
                onMouseDown={() => handleTouchStart(alarm._id)}
                onMouseUp={handleTouchEnd}
                onTouchStart={() => handleTouchStart(alarm._id)}
                onTouchEnd={handleTouchEnd}>
                <StyledHeadline>{alarm.alarmTime.split(",")[1]}</StyledHeadline>
                <StyledContainerForAlarmHeadline>
                  <StyledPlantName>{alarm.plantname}</StyledPlantName>
                  <p>{alarm.alarmTime.split(",")[0]}</p>
                </StyledContainerForAlarmHeadline>

                <StyledAlarmInputCheckbox
                  type="checkbox"
                  id="toggle"
                  checked={isAlarmActive[alarm.alarmID] == true ? true : false}
                  onChange={() => handleToggle(alarm._id)}
                />
                <StyledLabelAlarmToggle htmlFor="toggle" />
              </AlarmDiv>
            ))}
            {deleteModalOpen && (
              <Modal
                isOpen={deleteModalOpen}
                isClosing={isClosing}
                onClose={() => setDeleteModalOpen(false)}
                modaltext="Möchtest du diesen Alarm wirklich löschen?"
                modalheadline="Alarm löschen">
                <StyledButtonWrapper>
                  <StlyedModalButton
                    onClick={() => setDeleteModalOpen(false)}
                    $background={"var(--dark-font-color)"}>
                    Abbrechen
                  </StlyedModalButton>
                  <StlyedModalButton
                    onClick={() => handleDeleteAlarm(alarmID)}
                    $background={"var(--dark-green-color)"}>
                    Löschen
                  </StlyedModalButton>
                </StyledButtonWrapper>
              </Modal>
            )}
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
            modalheadline="Alarme">
            <StyledForm onSubmit={handleSubmit}>
              <StyledLabel htmlFor="alarmplant">
                Wähle deine Pflanze
              </StyledLabel>
              <StyledInputSelect id="alarmplant" name="alarmplant" required>
                {plants &&
                  plants.map((plant) => (
                    <StyledInputOption key={plant._id} value={plant._id}>
                      {plant.plantname}
                    </StyledInputOption>
                  ))}
              </StyledInputSelect>
              <StyledLabel htmlFor="alarmtime">Alarmzeit:</StyledLabel>
              <StyledDateInputWrapper>
                <StyledAlarmInput
                  type="datetime-local"
                  id="alarmtime"
                  name="alarmtime"
                  required></StyledAlarmInput>
                <StyledSubmitButton type="submit">
                  Alarm hinzufügen
                </StyledSubmitButton>
              </StyledDateInputWrapper>
            </StyledForm>
          </Modal>
        )}
      </StyledWrapper>
      <Navbar />
    </>
  );
}

const StyledHeadline = styled.h1`
  font-size: 1.2rem;
  color: var(--dark-font-color);
  margin-left: 1.2rem;
`;

const StyledPlantName = styled.p`
  font-size: 1rem;
  color: var(--dark-font-color);
`;

const StyledContainerForAlarmHeadline = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  p {
    margin: 0;
    padding: 0;
  }

  :last-child {
    font-size: 0.7rem;
  }
`;

const StyledLabelAlarmToggle = styled.label`
  display: inline-block;
  width: 50px;
  height: 24px;
  background-color: #ccc;
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s;
  justify-self: flex-end;
  margin-left: 2rem;
  &:before {
    content: "";
    position: absolute;
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    top: 2px;
    left: 2px;
    transition: transform 0.3s;
  }
`;

const StyledAlarmInputCheckbox = styled.input`
  display: none;

  &:checked + label {
    /* background-color: #4caf50; */
    background-color: ${({ checked }) =>
      checked ? "var(--dark-green-color)" : "#ccc"};
  }

  &:checked + label:before {
    /* transform: translateX(26px); */
    transform: ${({ checked }) =>
      checked ? "translateX(26px)" : "translateX(0)"};
  }
`;

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
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 1fr;

  justify-content: space-between;
  align-items: center;
  width: 90%;
  border: 1px solid rgba(0, 0, 0, 0.13);
  border-radius: 20px;
  gap: 2rem;
  margin: 1rem;
  padding: 0.5rem;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.13);
`;

const StyledTrashIcon = styled(FaTrash)`
  font-size: 1rem;
  color: var(--dark-font-color);
  cursor: pointer;
`;

const StyledButton = styled.button`
  background-color: transparent;
  cursor: pointer;
  border-radius: 50%;
  border: none;
`;

const StyledButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const StlyedModalButton = styled.button`
  background-color: ${({ $background }) => $background};
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  margin: 1rem;
`;

const ReactIconAdd = styled(ReactIcon)`
  font-size: 3rem;
  color: var(--dark-green-color);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;
