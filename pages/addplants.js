import ReactIcon from "@/components/Reacticon";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import PageViewer from "@/components/PageViewer";
import PlantForm from "@/components/Forms/PlantForm";
import Link from "next/link";
import styled from "styled-components";
import { IoArrowBackOutline } from "react-icons/io5";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import NeedToLogin from "@/components/NeedToLoginScreen";
import { useState } from "react";

export default function AddPlants() {
  const { data: session } = useSession();
  const [file, setFile] = useState(null);
  const router = useRouter();

  if (!session) {
    return (
      <>
        <NeedToLogin />
      </>
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    // Benutzer-ID hinzufügen
    formData.append("userId", session.user.id);

    if (file) {
      if (file instanceof Blob) {
        const fileWithCorrectType = new File([file], file.name, {
          type: file.type,
        });
        formData.set("image", fileWithCorrectType);
      } else {
        formData.set("image", file);
      }
    }

    if (!formData.get("image")) {
      const data = Object.fromEntries(formData);

      const response = await fetch("/api/addPlantWithoutImage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        alert("Es ist ein Fehler aufgetreten, bitte versuche es erneut");
      } else {
        alert("Pflanze wurde erfolgreich hinzugefügt");
        router.push("/");
      }
      return;
    }

    // Wenn ein Bild vorhanden ist, sende es mit
    const response = await fetch("/api/addPlant", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      alert("Es ist ein Fehler aufgetreten, bitte versuche es erneut");
    } else {
      alert("Pflanze wurde erfolgreich hinzugefügt");
      router.push("/");
    }

    // Formular zurücksetzen
    event.target.reset();
  }

  return (
    <>
      <PageHeader />
      <NavigationContainer>
        <IconContainer href="/">
          <ReactIconArrowBack IconComponent={IoArrowBackOutline} />
        </IconContainer>
        <PageViewer>Pflanze anlegen</PageViewer>
      </NavigationContainer>
      <PlantForm handleSubmit={handleSubmit} setFile={setFile} file={file} />
      <Navbar />
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
