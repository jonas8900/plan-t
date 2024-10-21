import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { QRCodeCanvas } from "qrcode.react";
import { useRef } from "react";
import styled, { keyframes } from "styled-components";
import { IoCloseSharp } from "react-icons/io5";
import ReactIcon from "@/components/Reacticon";

export default function QrCodeGenerator({isOpen, isClosing, onClose, children, plantId, modalheadline}) { 
  const qrRef = useRef();
  if (!isOpen) return null;

  const downloadPdf = () => {
    html2canvas(qrRef.current).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 10, 10);
      pdf.save('qr-code.pdf');
    });
  };

  return (

    <ModalOverlay onClick={onClose}>
    <ModalContent
    className={isClosing ? "fade-out" : "fade-in"}
    onClick={(event) => event.stopPropagation()}
    >
    <CloseButton onClick={onClose}>
        <ReactIcon IconComponent={IoCloseSharp} />
    </CloseButton>
    <ModalHeadline>
        {modalheadline}
    </ModalHeadline>
    <ModalText>
        <StyledQRCodeWrapper>
            <div ref={qrRef} >
              <QRCodeCanvas value={plantId} size={256} />
            </div>
            <StyledButton onClick={downloadPdf}>PDF herunterladen</StyledButton>
        </StyledQRCodeWrapper>
    </ModalText>
        {children}
    </ModalContent>
    </ModalOverlay>

  );
};

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

const CloseButton = styled.button`
    position: absolute;
    top: 0.1rem;
    right: 0.1rem;
    background: none;
    border: none;
    cursor: pointer;
`;

const ModalHeadline = styled.h2`
    font-size: 1.5rem;
    color: var(--dark-font-color);
    margin: 0.2rem auto 1rem 1rem;
`;

const ModalText = styled.p`
    font-size: 1rem;
    color: var(--dark-font-color);
`;


const StyledQRCodeWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    margin-top: 2rem;
    `;

const StyledButton = styled.button`
    background-color: var(--dark-green-color);
    color: var(--white-font-and-icon-color);
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 12px;
    font-size: 1rem;
    cursor: pointer;
`;