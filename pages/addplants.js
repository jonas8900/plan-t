import ReactIcon from "@/components/Reacticon";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import PageViewer from "@/components/PageViewer";
import PlantForm from "@/components/PlantForm";
import Link from "next/link";
import styled from "styled-components";
import { IoArrowBackOutline } from "react-icons/io5";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import NeedToLogin from "@/components/NeedToLoginScreen";

export default function AddPlants() {
  const { data: session } = useSession();
  const router = useRouter();

  if(!session) {
    return (
      <>
        <NeedToLogin />
      </>
    );
  }


async function handleSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  formData.append("userId", session.user.id); 

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

  event.target.reset();
}



  return (
    <>
      <PageHeader />
      <NavigationContainer>
        <IconContainer href="/">
          <ReactIconArrowBack IconComponent={IoArrowBackOutline}/>
        </IconContainer>
        <PageViewer>Pflanze anlegen</PageViewer>
      </NavigationContainer>
      <PlantForm handleSubmit={handleSubmit} />
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
