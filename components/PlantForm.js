import styled from "styled-components";

export default function PlantForm() {

    async function handleSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
		const data = Object.fromEntries(formData);


        const response = await fetch("/api/addPlant", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			alert("Es ist ein fehler aufgetreten, bitte versuche es erneut");
		} else {
			alert("Job wurde erfolgreich hinzugefügt");
		}
		event.target.reset();
    }

    return (
        <Section>
            <HeadlineAddPlant>Pflanzendaten</HeadlineAddPlant>
            <form onSubmit={handleSubmit}>
                <InputContainer>
                    <StyledLabel htmlFor="plantname">Name der Pflanze*</StyledLabel>
                    <StyledInput type="text" id="plantname" name="plantname" placeholder="z.B. Bonsai" required></StyledInput>
                </InputContainer>
                <InputContainer>
                    <StyledLabel htmlFor="planttype">Pflanzentyp*</StyledLabel>
                    <StyledInput type="text" id="planttype" name="planttype" placeholder="z.B. Juniperus chinensis" required></StyledInput>
                </InputContainer>
                <SmallInputWrapper>
                    <InputContainerSmall>
                        <StyledLabel htmlFor="size">Größe</StyledLabel>
                        <StyledInput type="text" id="size" name="size" placeholder="cm"></StyledInput>
                    </InputContainerSmall>
                    <InputContainerSmall>
                        <StyledLabel htmlFor="purchaseprice">Kaufpreis</StyledLabel>
                        <StyledInput type="text" id="purchaseprice" name="purchaseprice" placeholder="€"></StyledInput>
                    </InputContainerSmall>
                </SmallInputWrapper>
                <InputContainer>
                    <StyledLabel htmlFor="plantprocurement">Beschaffung der Pflanze</StyledLabel>
                    <StyledInput type="text" id="plantprocurement" name="plantprocurement" placeholder="z.B. Ableger" required></StyledInput>
                </InputContainer>
                {/* <InputContainerFile>
                        <StyledFileUploadLabel htmlFor="picture">Bild hochladen</StyledFileUploadLabel>
                        <StyledInput type="file" id="picture" name="picture" ></StyledInput>
                </InputContainerFile> */}
                <HeadlineAddPlant>Intervalldaten</HeadlineAddPlant>
                <InputContainer>
                    <StyledLabel htmlFor="wateringinterval">Gießintervall*</StyledLabel>
                    <StyledInput placeholder="Anzahl gießen in Tagen z.B. 2 (jeden zweiten Tag)" type="text" id="wateringinterval" name="wateringinterval"/>
                </InputContainer>
                <InputContainer>
                    <StyledLabel htmlFor="repotting">Letztes umtopfen*</StyledLabel>
                    <StyledInput type="date" id="repotting" name="repotting" required></StyledInput>
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