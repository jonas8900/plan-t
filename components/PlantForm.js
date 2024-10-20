import { set } from "mongoose";
import { useRouter } from "next/router";
import { useState } from "react";
import styled from "styled-components";

export default function PlantForm({handleSubmit, plantData}) {
    const router = useRouter();

    console.log(plantData);

    function formatDateString(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`; 
    }
    
    

    
    return (
        <Section>
            <HeadlineAddPlant>Pflanzendaten</HeadlineAddPlant>
            <form onSubmit={handleSubmit}>
                <InputContainer>
                    <StyledLabel htmlFor="plantname">Name der Pflanze*</StyledLabel>
                    <StyledInput type="text" id="plantname" name="plantname" placeholder="z.B. Bonsai" maxLength={60} value={plantData && plantData.plantname ? plantData.plantname : ''} required ></StyledInput>
                </InputContainer>
                <InputContainer>
                    <StyledLabel htmlFor="planttype">Pflanzentyp*</StyledLabel>
                    <StyledInput type="text" id="planttype" name="planttype" placeholder="z.B. Juniperus chinensis" maxLength={60} value={plantData && plantData.planttype ? plantData.planttype : ''} required></StyledInput>
                </InputContainer>
                <InputContainer>
                    <StyledLabel htmlFor="description">Beschreibung</StyledLabel>
                    <StyledTextArea type="textarea" id="description" name="description" placeholder="z.B. Diese Pflanze benötigt extrem Viel licht..." rows={3} maxLength={120} value={plantData && plantData.description ? plantData.description : ''}></StyledTextArea>
                </InputContainer>
                <SmallInputWrapper>
                    <InputContainerSmall>
                        <StyledLabel htmlFor="size">Größe (in cm)</StyledLabel>
                        <StyledInput type="number" id="size" name="size" placeholder="cm" min={1} value={plantData && plantData.size ? plantData.size : ''}></StyledInput>
                    </InputContainerSmall>
                    <InputContainerSmall>
                        <StyledLabel htmlFor="purchaseprice">Kaufpreis (in €)</StyledLabel>
                        <StyledInput type="number" id="purchaseprice" name="purchaseprice" placeholder="€" step="any" min={0} value={plantData && plantData.purchaseprice ? plantData.purchaseprice : ''}/>
                    </InputContainerSmall>
                </SmallInputWrapper>
                <InputContainer>
                    <StyledLabel htmlFor="plantprocurement">Beschaffung der Pflanze</StyledLabel>
                    <StyledInput type="text" id="plantprocurement" name="plantprocurement" maxLength={60} placeholder="z.B. Ableger" value={plantData && plantData.plantprocurement ? plantData.plantprocurement : ''}></StyledInput>
                </InputContainer>
                <InputContainerFile>
                        <StyledFileUploadLabel htmlFor="picture">Bild hochladen</StyledFileUploadLabel>
                        <StyledInput type="file" id="picture" name="picture" ></StyledInput>
                </InputContainerFile>
                <HeadlineAddPlant>Intervalldaten</HeadlineAddPlant>
                <InputContainer>
                    <StyledLabel htmlFor="repotting">Letztes Gießen*</StyledLabel>
                    <StyledInput type="date" id="lastwatering" name="lastwatering" required value={plantData && plantData.lastwatering ? formatDateString(plantData.lastwatering) : ''} ></StyledInput>
                </InputContainer>
                <InputContainer>
                    <StyledLabel htmlFor="wateringinterval">Gießintervall* (in Tagen)</StyledLabel>
                    <StyledInput placeholder="z.B. 2 (jeden zweiten Tag)" type="number" id="wateringinterval" min={1} name="wateringinterval" required value={plantData && plantData.wateringinterval ? plantData.wateringinterval : ''}/>
                </InputContainer>
                <InputContainer>
                    <StyledLabel htmlFor="repotting">Letztes umtopfen*</StyledLabel>
                    <StyledInput type="date" id="repotting" name="repotting" required value={plantData && plantData.lastwatering ? formatDateString(plantData.lastwatering) : ''} ></StyledInput>
                </InputContainer>
                <ButtonContainer>
                    <Button type="submit" >Speichern</Button>
                </ButtonContainer>
            </form>
        </Section>
    )
}

const Section = styled.section`
    margin: auto 2rem auto 2rem;
    `;

const HeadlineAddPlant = styled.h1`
    font-size: 1.125rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    text-decoration-line: underline;
    color: var(--dark-font-color);
    `;

const StyledLabel = styled.label`   
      color: var(--dark-font-color);
    `;

const StyledFileUploadLabel = styled.label`
    background-color: var(--dark-brown-color);
    color: white;
    padding: 0.5rem;
    font-family: sans-serif;
    border-radius: 0.3rem;
    cursor: pointer;
    margin-top: 1rem;
    `;	

const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin: 1.2rem 0rem 1.2rem 0rem;
    `;

const SmallInputWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    `;

const InputContainerSmall = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin: 1.2rem 0rem 1.2rem 0rem;
    width: 40%;
    `;

const InputContainerFile = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin: 1.2rem 0rem 2rem 0rem;
    `;

const StyledInput = styled.input`   
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #CECECE;
    border-radius: 5px;
    font-family: poppins;
    font-size: 0.9rem;
    `;

const StyledTextArea = styled.textarea`
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #CECECE;
    border-radius: 5px;
    font-family: poppins;
    font-size: 0.9rem;
    `;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    `;

const Button = styled.button`
    background-color: var(--dark-green-color);
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 5px;
    margin-top: 1rem;
    width: 100%;
    `;
