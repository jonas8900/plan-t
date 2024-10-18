import DashboardPlantCard from "@/components/DashboardPlantCard";
import MaterialIcon from "@/components/MaterialIcon";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import PageViewer from "@/components/PageViewer";
import styled from "styled-components";
import useSWR from "swr";


export default function Home({}) {
  const { data, isLoading} = useSWR("/api/getPlant");


  if(isLoading) return <div>Loading...</div>;

  return (
    <>
      <PageHeader />
      <NavigationContainer>
        <MaterialIconAdd>add_circle</MaterialIconAdd>
        <PageViewer>Dashboard</PageViewer>
      </NavigationContainer>
      <PlantCardWrapper>
        {data && data.length === 0 && <p>Keine Pflanzen vorhanden</p>}
        {data && data.length > 0 && data.map((plant, index) => (
          <DashboardPlantCard 
          Details={[
            {Label: "Größe", value: plant.size},
            {Label: "Gießen in", value: plant.location},
            {Label: "Letztes umtopfen", value: new Date(plant.repotting).toLocaleDateString('de-DE')},
            {Label: "Letztes Gießen", value: plant.wateringinterval}
          ]}
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

const MaterialIconAdd = styled(MaterialIcon)`
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