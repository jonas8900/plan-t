import Image from "next/image";
import PlantDetailsInCard from "./PlantDetailsInCard";
import styled from "styled-components";
import ReactIcon from "@/components/Reacticon";
import Link from "next/link";
import { FaPrint } from "react-icons/fa";

export default function DashboardPlantCard({
  headline,
  subheadline,
  Details = [],
  href,
  handleClickedPlant,
  plantId,
  imageUrl,
}) {


  return (
    <PlantCard>
      <PlantImage
        src={imageUrl ? imageUrl : "/images/placeholder.jpg"}
        alt="Plant image"
        width={100}
        height={100}
      />
      <ContentWrapper>
        <Headline>{headline}</Headline>
        <Subheadline>{subheadline}</Subheadline>
        {Details.map((Detail, index) => (
          <PlantDetailsInCard
            key={index}
            DetailsLabel={Detail.Label}
            DetailsValue={Detail.value}
          />
        ))}
      </ContentWrapper>
      <ActionWrapper>
        <Button href={href}>Details</Button>
        <ButtonToPrintQRCode onClick={() => handleClickedPlant(plantId)}  href="/scan">
          <ReactIconScan IconComponent={FaPrint}/>
        </ButtonToPrintQRCode>
      </ActionWrapper>
    </PlantCard>
  );
}

const PlantImage = styled(Image)`
  object-fit: cover;
  height: 100%;
  width: 100%;
  grid-area: 1 / 1 / 3 / 2;
`;

const PlantCard = styled.div`
  display: grid;
  grid-template-columns: 2fr 3.5fr;
  border-radius: 0.75rem;
  background: linear-gradient(110deg, #497451 22.72%, #99ceae 98.84%);
  box-shadow: 1px 4px 4px 0px rgba(0, 0, 0, 0.25);
  width: 100%;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0.4rem 1rem 0rem 1rem;
  width: 80%;
  grid-area: 1 / 2 / 2 / 3;
`;

const Headline = styled.h1`
  font-size: 1.3rem;
  color: var(--white-font-and-icon-color);
  font-weight: 500;
  margin: 0;
  padding: 0;
`;

const Subheadline = styled.h2`
  font-size: 1rem;
  color: var(--white-font-and-icon-color);
  font-weight: 400;
  margin: 0 0 0.5rem 0;
  padding: 0;
`;

const ActionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.4rem 1rem 0rem 1rem;
  grid-area: 2 / 2 / 3 / 3;
  padding: 0;
`;

const Button = styled(Link)`
  background-color: var(--white-font-and-icon-color);
  color: var(--dark-brown-color);
  border: none;
  border-radius: 0.75rem;
  width: 40%;
  height: 60%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  cursor: pointer;
  text-decoration: none;
`;

const ButtonToPrintQRCode = styled.button`
  text-decoration: none;
  border: none;
  background-color: transparent;
  cursor: pointer;
`;

const ReactIconScan = styled(ReactIcon)`
    color: var(--dark-brown-color);
    font-size: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0.35rem;
    `;


