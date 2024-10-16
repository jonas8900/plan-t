import MaterialIcon from "@/components/MaterialIcon";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import PageViewer from "@/components/PageViewer";
import styled from "styled-components";


export default function Home({}) {
  return (
    <>
      <PageHeader />
      <NavigationContainer>
        <MaterialIconAdd>add_circle</MaterialIconAdd>
        <PageViewer>Dashboard</PageViewer>
      </NavigationContainer>
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
