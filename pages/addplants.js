import MaterialIcon from "@/components/MaterialIcon";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import PageViewer from "@/components/PageViewer";
import PlantForm from "@/components/PlantForm";
import Link from "next/link";
import styled from "styled-components";

export default function AddPlants() {
    return (
        <>
        <PageHeader />
        <NavigationContainer>
            <IconContainer href="/">
                <MaterialIconAdd>arrow_back</MaterialIconAdd>
            </IconContainer>
                <PageViewer>Pflanze anlegen</PageViewer>
        </NavigationContainer>
        <PlantForm />
        <Navbar />
        </>
    );
}


const MaterialIconAdd = styled(MaterialIcon)`
  font-size: 2rem;
  color: var(--white-font-and-icon-color);
  margin: 0rem;
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
