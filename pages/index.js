import DashboardPlantCard from "@/components/DashboardPlantCard";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import PageViewer from "@/components/PageViewer";
import styled from "styled-components";
import useSWR from "swr";
import { MdAddCircle } from "react-icons/md";
import ReactIcon from "@/components/Reacticon";
import Link from "next/link";
import { handleWateringInterval } from "@/utils";
import QrCodeGenerator from "@/components/QrCodeGenerator";
import { useState } from "react";
import { useSession } from "next-auth/react";
import NeedToLogin from "@/components/NeedToLoginScreen";
import { useRouter } from "next/router";

export default function Home({}) {
  const { data, isLoading } = useSWR("/api/getPlants");
  const [isModalOpen, setModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [plantId, setPlantId] = useState(null);
  const { data: session} = useSession();



  if(!session) {
    return (
      <>
        <NeedToLogin />
      </>
    );
  }



  if (isLoading) return <div>Loading...</div>;


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

  function handleClickedPlant(id) {
    toggleModal();
    if(id !== null) {
      setPlantId(id);
    }
  }


console.log(data);

  return (
    <>
      <PageHeader />
      <NavigationContainer>
        <AddPlantLink href="/addplants">
        <ReactIconAdd IconComponent={MdAddCircle}/>
        </AddPlantLink>
        <PageViewer>Dashboard</PageViewer>
      </NavigationContainer>
      <PlantCardWrapper>
        {data && data.length === 0 && <p>Keine Pflanzen vorhanden</p>}
        {data &&
          data.length > 0 &&
          data.map((plant, index) => (
            <DashboardPlantCard
              Details={[
                { Label: "Größe", value: plant.size ? plant.size + " cm" : "" },
                {
                  Label: "Gießen in",
                  value: handleWateringInterval(plant) ,
                },
                {
                  Label: "Letztes umtopfen",
                  value: new Date(plant.repotting).toLocaleDateString("de-DE"),
                },
                {
                  Label: "letztes Gießen",
                  value: plant.lastwatering
                    ? new Date(plant.lastwatering).toLocaleDateString("de-DE")
                    : "",
                },
              ]}
              href={`/${plant._id}`}
              headline={plant.plantname}
              subheadline={plant.planttype}
              key={index}
              imageUrl={plant.file}
              handleClickedPlant={handleClickedPlant}
              plantId={plant._id}
            />
          ))}
      </PlantCardWrapper>
      <Navbar />
      <QrCodeGenerator
        isOpen={isModalOpen}
        isClosing={isClosing}
        onClose={toggleModal}
        plantId={plantId}
        data={data}
        modalheadline="QR Code für deine Pflanze"
      />
    </>
  );
}

const ReactIconAdd = styled(ReactIcon)`
  font-size: 50px;
  color: var(--dark-green-color);
  margin: 2rem;
`;

const NavigationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
`;

const PlantCardWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 3rem;
  gap: 2rem;
  flex-wrap: wrap;
  padding: 0 1rem;
`;

const AddPlantLink = styled(Link)`
  margin-top: 0.75rem;
  `;