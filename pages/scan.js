import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import dynamic from "next/dynamic";
import { useState } from "react";
import styled from "styled-components";
import ReactIcon from "@/components/Reacticon";
import PageViewer from "@/components/PageViewer";
import Link from "next/link";
import { IoArrowBackOutline } from "react-icons/io5";
import { useSession } from "next-auth/react";
import NeedToLogin from "@/components/NeedToLoginScreen";
import { useRouter } from "next/router";
import { MdCameraswitch } from "react-icons/md";

const QrScanner = dynamic(() => import("react-qr-scanner"), { ssr: false });

export default function Scan() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null); // Zustand für Fehler
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    return <NeedToLogin />;
  }

  function handleScan(result) {
    if (result && result.text) {
      setResult(result.text);
      console.log(result.text);
    }
  }

  function handleError(error) {
    console.error("Fehler beim Zugriff auf die Kamera:", error);
    setError("Fehler beim Zugriff auf die Kamera."); // Fehlerstatus setzen
  }

  function handleRouteToPlant() {
    router.push(`/${result}`);
  }

  return (
    <div>
      <PageHeader />
      <NavigationContainer>
        <IconContainer href="/">
          <ReactIconArrowBack IconComponent={IoArrowBackOutline} />
        </IconContainer>
        <PageViewer>Scanner</PageViewer>
      </NavigationContainer>
      <Navbar />
      <ScanContainer>
        <StyledScanner 
          delay={300} 
          onError={handleError} 
          onScan={handleScan}  
          constraints={{
            video: {
              facingMode: 'environment', 
              video: true,
            }
          }}
        />
        {error && <ErrorText>{error}</ErrorText>}
        <p>
          {result
            ? handleRouteToPlant()
            : "Bitte scanne einen QR-Code"}
        </p>
      </ScanContainer>
    </div>
  );
}

const StyledScanner = styled(QrScanner)`
  width: 80%;
  height: 100%;
  border: 2px solid var(--dark-font-color);
  box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.2);
`;


const ReactIconArrowBack = styled(ReactIcon)`
  font-size: 2rem;
  color: var(--white-font-and-icon-color);
  margin: 0rem;
  display: flex;
  align-items: center;
`;

const NavigationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
`;

const ScanContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3rem;
  margin: 4rem 0 4rem 0;
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

const ErrorText = styled.p`
  color: red; 
  margin-top: 1rem;
`;