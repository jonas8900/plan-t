import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import { CheckCircle } from "lucide-react";

export default function SuccessMessage({
  message = "Erfolgreich gespeichert!",
}) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <ToastContainer
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          <IconWrapper>
            <CheckCircle size={24} />
          </IconWrapper>
          <MessageText>{message}</MessageText>
        </ToastContainer>
      )}
    </AnimatePresence>
  );
}


const ToastContainer = styled(motion.div)`
  position: fixed;
  top: 2.5rem;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  color: #1f2937;
  border: 1px solid #22c55e;
  border-radius: 1rem;
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  z-index: 9999;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);


`;

const IconWrapper = styled.div`
  color: #22c55e; 
  display: flex;
  align-items: center;
`;

const MessageText = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
`;
