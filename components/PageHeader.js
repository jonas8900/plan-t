// PageHeader.js
import Image from "next/image";
import styled from "styled-components";
import { MdOutlineQrCode2, MdOutlineHelpCenter } from "react-icons/md";
import ReactIcon from "@/components/Reacticon";
import { useState } from "react";
import Link from "next/link";
import Modal from "@/components/InfoModal"; 

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
          priority
          width={100}
          height={100}
        />
      </ImageContainer>
      <Anchor href="/scan">
        <ReactIconStyledIcon IconComponent={MdOutlineQrCode2} />
      </Anchor>

      <HelpIconContainer onClick={toggleModal}>
        <ReactIconHelp IconComponent={MdOutlineHelpCenter} />
      </HelpIconContainer>

      <Modal
        isOpen={isModalOpen}
        isClosing={isClosing}
        onClose={toggleModal}
        modaltext="Plan-T ist eine App, die dir hilft, deine Pflanzen zu pflegen. Du kannst deine Pflanzen hinzufügen und verwalten. Die App erinnert dich daran, wann du deine Pflanzen gießen musst und wann du sie umtopfen solltest. Du kannst auch Informationen zu deinen Pflanzen hinzufügen, wie z.B. die Größe, den Typ und eine Beschreibung. Viel Spaß beim Pflanzen!"
        modalheadline="Willkommen bei Plan-T"
      />
    </Section>
  );
}

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
  font-family: "Poppins", sans-serif;
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
  background: linear-gradient(
      0deg,
      rgba(152, 199, 160, 0.2) 0%,
      rgba(152, 199, 160, 0.2) 100%
    ),
    lightgray 50% / cover no-repeat;
  box-shadow: 1px 4px 4px 0px rgba(73, 116, 81, 0.44);
`;

const ReactIconStyled = styled(ReactIcon)`
  color: var(--dark-font-color);
  font-size: 3rem;
`;

const ReactIconStyledIcon = styled(ReactIcon)`
  color: var(--white-font-and-icon-color);
  font-size: 4rem;
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

const ReactIconHelp = styled(ReactIcon)`
  font-size: 2rem;
  position: absolute;
  right: 0;
  bottom: 0;
  text-decoration: none;
  color: var(--white-font-and-icon-color);
`;
