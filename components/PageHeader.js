// PageHeader.js
import Image from "next/image";
import styled from "styled-components";
import { MdOutlineQrCode2, MdOutlineHelpCenter } from "react-icons/md";
import ReactIcon from "@/components/Reacticon";
import { useState } from "react";
import Link from "next/link";
import Modal from "@/components/InfoModal"; 
import { useSession } from "next-auth/react";

export default function PageHeader() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const { data: session } = useSession();

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

 console.log(session);

  return (
    <Section>
      <Headline>Plan-T</Headline>
      <ImageContainer>
        <Headimage
          src="/images/Favicon Logo.png"
          alt="Plan-T image"
          priority
          width={160}
          height={160}
        />
      </ImageContainer>
      {session  ? (
        <>
          <AnchorLoggedIn href="/profile">
            <ProfilePicture src={session?.user.image} alt="user image" width={40} height={40}/>
          </AnchorLoggedIn>
          <WelcomeParagraph>Hey {session?.user.name}</WelcomeParagraph>
        </>
      ) : (
  
        <Anchor href="/profile">
        Login
      </Anchor>
      )}
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
  top: 0.7rem;
  right: 4.7rem;
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
  top: 1rem;
  left: 1rem;
`;

const Headimage = styled(Image)`
  border-radius: 50%;
  object-fit: cover;
  filter: drop-shadow(1px 4px 4px rgba(73, 116, 81, 0.44));
`;

const Anchor = styled(Link)`
  position: absolute;
  right: 1rem;
  top: 1rem;
  padding: 1rem 0.5rem;
  background-color: var(--light-brown-color);
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  color: var(--dark-font-color);
`;

const AnchorLoggedIn = styled(Link)`
  position: absolute;
  right: 1rem;
  top: 1rem;
  padding: 1rem 0.5rem;
  text-decoration: none;
  border-radius: 12px;
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

const ProfilePicture = styled(Image)`
  border-radius: 12px;
  `;

const WelcomeParagraph = styled.p`
  position: absolute;
  right: 1rem;
  top: 4rem;
  color: var(--white-font-and-icon-color);
  font-size: 1rem;
  font-weight: 500;
  font-family: "Poppins", sans-serif;
  text-shadow: 5px 3px 4px rgba(107, 107, 107, 0.3);
`;

