import Image from "next/image";
import styled, { keyframes } from "styled-components";
import MaterialIcon from "./MaterialIcon";
import { useState } from "react";
import Link from "next/link";

export default function PageHeader() {
    const [isModalOpen, setModalOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    const toggleModal = () => {
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

    return (
        <Section>
            <Headline>Plan-T</Headline>
            <ImageContainer>
                <Headimage
                    src="/images/plant-4427146_640.jpg"
                    alt="Plan-T image"
                    width={100}
                    height={100}
                />
            </ImageContainer>
            <Anchor href="/scan">
                <MaterialIconStyled>qr_code_2</MaterialIconStyled>
            </Anchor>

            <HelpIconContainer onClick={toggleModal}>
                <MaterialIconStyledHelp>help_center</MaterialIconStyledHelp>
            </HelpIconContainer>

            {isModalOpen && (
                <ModalOverlay onClick={toggleModal}>
                    <ModalContent
                        className={isClosing ? "fade-out" : "fade-in"}
                        onClick={(event) => event.stopPropagation()}
                    >
                        <CloseButton onClick={toggleModal}>
                            <MaterialIconStyledClose>close</MaterialIconStyledClose>
                        </CloseButton>
                        <ModalText>
                            Hier steht der erklärende Text zu Plan-T, der den Nutzern
                            hilft, die App zu verstehen.
                        </ModalText>
                    </ModalContent>
                </ModalOverlay>
            )}
        </Section>
    );
}

const fadeIn = keyframes`
    from {
        opacity: 0;
        transform: scale(0.95);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
`;

const fadeOut = keyframes`
    from {
        opacity: 1;
        transform: scale(1);
    }
    to {
        opacity: 0;
        transform: scale(0.95);
    }
`;

const Section = styled.section`
    display: flex;
    position: relative;
    background: linear-gradient(98deg, #98c7a0 16.73%, #59996b 96.82%);
    height: 194px;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.23);
    margin-bottom: 0.5rem;
`;

const Headline = styled.h1`
    position: absolute;
    padding: 0;
    margin: 0;
    bottom: 0.7rem;
    left: 3.5rem;
    color: var(--white-font-and-icon-color);
    font-size: var(--font-size-header);
    font-family: 'Poppins', sans-serif;
    font-weight: 500;
    text-shadow: 5px 3px 4px rgba(107, 107, 107, 0.3);
`;

const ImageContainer = styled.div`
    position: absolute;
    width: 8.5rem;
    height: 6.9375rem;
    top: 0.75rem;
    left: 2.7rem;
`;

const Headimage = styled(Image)`
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 0.5625rem;
    background: linear-gradient(0deg, rgba(152, 199, 160, 0.2) 0%, rgba(152, 199, 160, 0.2) 100%), lightgray 50% / cover no-repeat;
    box-shadow: 1px 4px 4px 0px rgba(73, 116, 81, 0.44);
`;

const MaterialIconStyled = styled(MaterialIcon)`
    color: var(--white-font-and-icon-color);
    font-size: 3.5rem;
`;

const MaterialIconStyledHelp = styled(MaterialIcon)`
    color: var(--white-font-and-icon-color);
    font-size: 2rem;
`;

const Anchor = styled(Link)`
    position: absolute;
    right: 0;
    top: 0;
    padding-right: 0.3rem;
    text-decoration: none;
    color: var(--white-font-and-icon-color);
`;

const HelpIconContainer = styled.div`
    position: absolute;
    right: 1.1rem;
    bottom: 0;
    cursor: pointer;
    color: var(--white-font-and-icon-color);
    font-size: 2rem;
`;

const CloseButton = styled.button`
    position: absolute;
    top: 0.1rem;
    right: 0.1rem;
    background: none;
    border: none;
    cursor: pointer;
`;

const MaterialIconStyledClose = styled(MaterialIcon)`
    color: var(--dark-font-color);
    font-size: 2rem;
`;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    background: white;
    padding: 2rem;
    border-radius: 10px;
    position: relative;
    max-width: 400px;
    width: 100%;

    &.fade-in {
        animation: ${fadeIn} 0.2s ease-in-out forwards;
    }

    &.fade-out {
        animation: ${fadeOut} 0.2s ease-in-out forwards;
    }
`;

const ModalText = styled.p`
    font-size: 1rem;
    color: var(--dark-font-color);
`;


