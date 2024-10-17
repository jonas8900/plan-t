import styled from "styled-components";


export default function PlantDetailsInCard({
DetailsLabel,
DetailsValue,
className,
}) {
    return (
        <>
        <DetailsWrapper className={className}>
            <Paragraph>{DetailsLabel}</Paragraph>
            <Paragraph>{DetailsValue}</Paragraph>
        </DetailsWrapper>
        </>
    );
}

const DetailsWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 0.1rem 0 0rem 0;
`;

const Paragraph = styled.p`
    font-size: 0.8rem;
    margin: 0;
    color: var(--white-font-and-icon-color);
`;