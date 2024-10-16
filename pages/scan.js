import dynamic from 'next/dynamic';
import { useState } from 'react';
import styled from 'styled-components';

const QrScanner = dynamic(() => import('react-qr-scanner'), { ssr: false });


export default function Scan() {
    const [result, setResult] = useState(null);

    function handleScan(result) {
        if (result && result.text) {
            setResult(result.text);  // Nur den QR-Code-Inhalt setzen
            console.log(result.text);
        }
    }
    

    function handleError(error) {
        console.error(error);
    }


    return (
        <div>
        <StyledScanner 
          delay={300}
          onError={handleError}
          onScan={handleScan}
        />
        <p>{result ? `Gescannter QR-Code: ${result}` : 'Bitte scanne einen QR-Code'}</p>
        </div>
    );
}


const StyledScanner = styled(QrScanner)`
    height: 300px;
    width: 300px;
`;