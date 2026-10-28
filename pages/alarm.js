import PageHeader from "@/components/PageHeader";
import PageViewer from "@/components/PageViewer";
import ReactIcon from "@/components/Reacticon";
import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import styled from "styled-components";
import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";
import NeedToLogin from "@/components/NeedToLoginScreen";
import NoAlarmsSet from "@/components/NoAlarmsSet";
import Modal from "@/components/Modals/InfoModal";
import ErrorMessage from "@/components/Toast/ErrorMessage";
import SuccessMessage from "@/components/Toast/SuccessMessage";
import useSWR from "swr";
import {
  calculateSuggestedAlarmDate,
  formatAlarmDateTime,
  formatDateTimeLocalInput,
  isPushSupported,
  requestPushSubscription,
} from "@/utils";
import { MdAddCircle } from "react-icons/md";
import { FaTrash } from "react-icons/fa";

export default function Alarm() {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAlarmId, setSelectedAlarmId] = useState(null);
  const [selectedPlantId, setSelectedPlantId] = useState("");
  const [alarmTimeInput, setAlarmTimeInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ type: null, message: "" });
  const timeoutRef = useRef(null);
  const toastTimerRef = useRef(null);

  const { data: plants, isLoading } = useSWR(
    session ? "/api/getPlantsWithoutDetails" : null
  );
  const { data: alarmData, mutate: mutateAlarms } = useSWR(
    session ? "/api/getAlarms" : null
  );

  const plantList = useMemo(
    () => (Array.isArray(plants) ? plants : []),
    [plants]
  );

  const selectedPlant = useMemo(
    () => plantList.find((plant) => plant._id === selectedPlantId) || null,
    [plantList, selectedPlantId]
  );

  function applySuggestedAlarmForPlant(plant) {
    if (!plant) {
      setAlarmTimeInput("");
      return;
    }
    const suggestedDate = calculateSuggestedAlarmDate(plant);
    setAlarmTimeInput(formatDateTimeLocalInput(suggestedDate));
  }

  function showNotificationToast(type, message) {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToast({ type, message });
    toastTimerRef.current = setTimeout(() => {
      setToast({ type: null, message: "" });
    }, 5000);
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isModalOpen && plantList.length > 0 && !selectedPlantId) {
      const initialPlant = plantList[0];
      setSelectedPlantId(initialPlant._id);
      applySuggestedAlarmForPlant(initialPlant);
    }
  }, [isModalOpen, plantList, selectedPlantId]);

  useEffect(() => {
    if (!session) {
      return undefined;
    }

    async function triggerDueAlarmsCheck() {
      try {
        const response = await fetch("/api/checkAlarmsCron");
        if (!response.ok) {
          return;
        }
        const result = await response.json();
        if (result?.sentCount > 0) {
          mutateAlarms();
        }
      } catch {
        return;
      }
    }

    triggerDueAlarmsCheck();
    const intervalId = setInterval(triggerDueAlarmsCheck, 30 * 1000);

    return () => clearInterval(intervalId);
  }, [session, mutateAlarms]);

  if (!session) {
    return <NeedToLogin />;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  function openCreateModal() {
    if (plantList.length > 0) {
      const initialPlant =
        plantList.find((plant) => plant._id === selectedPlantId) || plantList[0];
      setSelectedPlantId(initialPlant._id);
      applySuggestedAlarmForPlant(initialPlant);
    }
    setIsModalOpen(true);
  }

  function closeCreateModal() {
    setIsClosing(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setIsClosing(false);
    }, 300);
  }

  function toggleModal() {
    if (isModalOpen) {
      closeCreateModal();
    } else {
      openCreateModal();
    }
  }

  function handlePlantSelectionChange(event) {
    const newPlantId = event.target.value;
    setSelectedPlantId(newPlantId);
    const chosenPlant = plantList.find((plant) => plant._id === newPlantId);
    applySuggestedAlarmForPlant(chosenPlant);
  }

  function openDeleteConfirmation(id) {
    setSelectedAlarmId(id);
    setDeleteModalOpen(true);
  }

  function handleTouchStart(id) {
    timeoutRef.current = setTimeout(() => {
      openDeleteConfirmation(id);
    }, 500);
  }

  function handleTouchEnd() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);

    const alarmTime = new Date(alarmTimeInput);

    if (!selectedPlantId || Number.isNaN(alarmTime.getTime())) {
      showNotificationToast(
        "error",
        "Bitte wähle eine Pflanze und eine gültige Uhrzeit."
      );
      setSubmitting(false);
      return;
    }

    try {
      if (!isPushSupported()) {
        throw new Error(
          "Push-Benachrichtigungen werden von diesem Browser nicht unterstützt."
        );
      }

      const subscription = await requestPushSubscription();
      if (!subscription) {
        throw new Error(
          "Push-Benachrichtigungen konnten nicht aktiviert werden."
        );
      }

      const saveSubscriptionResponse = await fetch("/api/saveSubscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plantId: selectedPlantId,
          subscription,
        }),
      });

      if (!saveSubscriptionResponse.ok) {
        throw new Error("Fehler beim Speichern der Push-Subscription.");
      }

      const addAlarmResponse = await fetch("/api/addAlarm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plantId: selectedPlantId,
          alarmTime: alarmTime.toISOString(),
          alarmActive: true,
        }),
      });

      if (!addAlarmResponse.ok) {
        throw new Error("Fehler beim Speichern des Alarms.");
      }

      await mutateAlarms();
      closeCreateModal();
      showNotificationToast("success", "Wiederkehrender Alarm erfolgreich gesetzt!");
    } catch (error) {
      showNotificationToast(
        "error",
        error.message || "Es gab ein Problem beim Hinzufügen des Alarms."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteAlarm(id) {
    if (!id) {
      return;
    }

    try {
      const response = await fetch("/api/deleteAlarms", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error("Es gab ein Problem beim Löschen des Alarms.");
      }

      await mutateAlarms();
      setDeleteModalOpen(false);
      setSelectedAlarmId(null);
      showNotificationToast("success", "Alarm erfolgreich gelöscht!");
    } catch (error) {
      showNotificationToast(
        "error",
        error.message || "Es gab ein Problem beim Löschen des Alarms."
      );
    }
  }

  async function handleToggle(id) {
    try {
      const response = await fetch("/api/updateAlarm", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error("Fehler beim Aktualisieren des Alarms.");
      }

      await mutateAlarms();
    } catch (error) {
      showNotificationToast(
        "error",
        error.message || "Fehler beim Aktualisieren des Alarms."
      );
    }
  }

  const alarms = Array.isArray(alarmData) ? alarmData : [];
  const selectedIntervalDays =
    Number(selectedPlant?.wateringinterval) > 0
      ? Number(selectedPlant.wateringinterval)
      : 7;
  const selectedLastWateringLabel = selectedPlant?.lastwatering
    ? new Date(selectedPlant.lastwatering).toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : null;

  return (
    <>
      <PageHeader />
      {toast.type === "error" && <ErrorMessage message={toast.message} />}
      {toast.type === "success" && <SuccessMessage message={toast.message} />}
      <NavigationContainer>
        <IconContainer href="/">
          <ReactIconArrowBack IconComponent={IoArrowBackOutline} />
        </IconContainer>
        <PageViewer>Alarm</PageViewer>
      </NavigationContainer>
      <StyledWrapper>
        {alarms.length > 0 ? (
          <>
            <StyledButton type="button" onClick={toggleModal}>
              <ReactIconAdd IconComponent={MdAddCircle} />
            </StyledButton>
            {alarms.map((alarm) => {
              const { dateLabel, timeLabel } = formatAlarmDateTime(
                alarm.alarmTime
              );
              const intervalDays =
                Number(alarm.wateringinterval) > 0
                  ? Number(alarm.wateringinterval)
                  : 7;
              const toggleId = `toggle-${alarm._id}`;
              const isChecked = Boolean(alarm.alarmActive);

              return (
                <AlarmDiv
                  key={alarm._id}
                  onMouseDown={() => handleTouchStart(alarm._id)}
                  onMouseUp={handleTouchEnd}
                  onMouseLeave={handleTouchEnd}
                  onTouchStart={() => handleTouchStart(alarm._id)}
                  onTouchEnd={handleTouchEnd}
                >
                  <StyledHeadline>{timeLabel}</StyledHeadline>
                  <StyledContainerForAlarmHeadline>
                    <StyledPlantName>{alarm.plantname}</StyledPlantName>
                    <p>
                      {dateLabel} · alle {intervalDays} Tage
                    </p>
                  </StyledContainerForAlarmHeadline>

                  <StyledAlarmInputCheckbox
                    type="checkbox"
                    id={toggleId}
                    checked={isChecked}
                    onChange={() => handleToggle(alarm._id)}
                  />
                  <StyledLabelAlarmToggle htmlFor={toggleId} />

                  <StyledDeleteIconButton
                    type="button"
                    aria-label={`Alarm für ${alarm.plantname} löschen`}
                    onClick={() => openDeleteConfirmation(alarm._id)}
                  >
                    <StyledTrashIcon />
                  </StyledDeleteIconButton>
                </AlarmDiv>
              );
            })}
            {deleteModalOpen && (
              <Modal
                isOpen={deleteModalOpen}
                isClosing={isClosing}
                onClose={() => setDeleteModalOpen(false)}
                modaltext="Möchtest du diesen Alarm wirklich löschen?"
                modalheadline="Alarm löschen"
              >
                <StyledButtonWrapper>
                  <StyledModalButton
                    type="button"
                    onClick={() => setDeleteModalOpen(false)}
                    $background={"var(--dark-font-color)"}
                  >
                    Abbrechen
                  </StyledModalButton>
                  <StyledModalButton
                    type="button"
                    onClick={() => handleDeleteAlarm(selectedAlarmId)}
                    $background={"var(--dark-green-color)"}
                  >
                    Löschen
                  </StyledModalButton>
                </StyledButtonWrapper>
              </Modal>
            )}
          </>
        ) : (
          <NoAlarmsSet onClick={toggleModal} />
        )}
        {isModalOpen && (
          <Modal
            isOpen={isModalOpen}
            isClosing={isClosing}
            onClose={toggleModal}
            modaltext="Der nächste Gießtermin wird automatisch aus dem letzten Gießen und dem Gießintervall vorgeschlagen und wiederholt sich danach im Intervall."
            modalheadline="Gieß-Alarm"
          >
            <StyledForm onSubmit={handleSubmit}>
              <StyledLabel htmlFor="alarmplant">
                Wähle deine Pflanze
              </StyledLabel>
              <StyledInputSelect
                id="alarmplant"
                name="alarmplant"
                value={selectedPlantId}
                onChange={handlePlantSelectionChange}
                required
              >
                {plantList.map((plant) => (
                  <StyledInputOption key={plant._id} value={plant._id}>
                    {plant.plantname}
                  </StyledInputOption>
                ))}
              </StyledInputSelect>
              {selectedPlant && (
                <StyledHintText>
                  Wiederkehrend alle {selectedIntervalDays} Tage
                  {selectedLastWateringLabel
                    ? ` · Zuletzt gegossen am ${selectedLastWateringLabel}`
                    : ""}
                </StyledHintText>
              )}
              <StyledLabel htmlFor="alarmtime">
                Nächste Erinnerung (Vorschlag):
              </StyledLabel>
              <StyledDateInputWrapper>
                <StyledAlarmInput
                  type="datetime-local"
                  id="alarmtime"
                  name="alarmtime"
                  value={alarmTimeInput}
                  onChange={(event) => setAlarmTimeInput(event.target.value)}
                  required
                />
                <StyledSubmitButton type="submit" disabled={submitting}>
                  {submitting ? "Speichert..." : "Alarm hinzufügen"}
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
  margin-left: 0.6rem;
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

const StyledHintText = styled.p`
  font-size: 0.78rem;
  color: var(--dark-font-color);
  align-self: flex-start;
  margin: 0.4rem 0 0 0;
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
    background-color: ${({ checked }) =>
      checked ? "var(--dark-green-color)" : "#ccc"};
  }

  &:checked + label:before {
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
  padding-bottom: 5rem;
`;

const StyledSubmitButton = styled.button`
  background-color: var(--dark-green-color);
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
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
  grid-template-columns: 1fr 2fr auto auto;
  justify-content: space-between;
  align-items: center;
  width: 90%;
  border: 1px solid rgba(0, 0, 0, 0.13);
  border-radius: 20px;
  gap: 1rem;
  margin: 0.75rem 1rem;
  padding: 0.5rem 1rem;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.13);
`;

const StyledDeleteIconButton = styled.button`
  background: transparent;
  border: none;
  padding: 0.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const StyledTrashIcon = styled(FaTrash)`
  font-size: 1rem;
  color: var(--dark-font-color);
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

const StyledModalButton = styled.button`
  background-color: ${({ $background }) => $background};
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  margin: 1rem;
  cursor: pointer;
`;

const ReactIconAdd = styled(ReactIcon)`
  font-size: 3rem;
  color: var(--dark-green-color);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;
