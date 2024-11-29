import ReactIcon from "@/components/Reacticon";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import PageViewer from "@/components/PageViewer";
import PlantForm from "@/components/PlantForm";
import Link from "next/link";
import styled from "styled-components";
import { IoArrowBackOutline } from "react-icons/io5";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useState } from "react";

export default function ChangePlant() {
  const router = useRouter();
  const [file, setFile] = useState(null);

  const { id } = router.query;
  const { data, error, isLoading } = useSWR(id ? `/api/getSinglePlant?id=${id}` : null);
  console.log(data, "Data");

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    if (file) {
      if (file instanceof Blob) {
          const fileWithCorrectType = new File([file], file.name, { type: file.type });
          formData.set("image", fileWithCorrectType); 
      } else {
          formData.set("image", file); 
      }
  }

    if(formData.get("image")) {
      const response = await fetch(`/api/changePlantWithFile?id=${id}`, {
        method: "PUT",
        body: formData,
      });
  
      if (!response.ok) {
        alert("Es ist ein fehler aufgetreten, bitte versuche es erneut");
      } else {
        alert("Pflanze wurde erfolgreich geändert");
        router.push("/");
      }
  
      event.target.reset();

      
    } else {
      const response = await fetch(`/api/changePlant?id=${id}`, {
        method: "PUT",
        headers: {
         "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        alert("Es ist ein fehler aufgetreten, bitte versuche es erneut");
      } else {
        alert("Pflanze wurde erfolgreich geändert");
        router.push("/");
      }
  
      event.target.reset();
    }
}


  async function handleDeleteFile() {

    const response = await fetch(`/api/deleteFile?id=${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      alert("Es ist ein fehler aufgetreten, bitte versuche es erneut");
    } else {
      alert("Datei wurde erfolgreich gelöscht");
    }
  }



  return (
    <>
      <PageHeader />
      <NavigationContainer>
        <IconContainer href="/">
          <ReactIconArrowBack IconComponent={IoArrowBackOutline}/>
        </IconContainer>
        <PageViewer>Pflanze ändern</PageViewer>
      </NavigationContainer>
      <PlantForm handleSubmit={handleSubmit} plantData={data} handleDeleteFile={handleDeleteFile} file={file} setFile={setFile}/>
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
