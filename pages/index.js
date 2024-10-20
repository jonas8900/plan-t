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

export default function Home({}) {
  const { data, isLoading } = useSWR("/api/getPlants");

  if (isLoading) return <div>Loading...</div>;



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
            />
          ))}
      </PlantCardWrapper>
      <Navbar />
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