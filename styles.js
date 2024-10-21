// styles.js
import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`

@font-face {
    font-family: 'Poppins';
    src: url('/fonts/Poppins/Poppins-Regular.ttf') format('truetype');
    font-weight: 400;
    font-style: normal;
  }

  @font-face {
    font-family: 'Poppins';
    src: url('/fonts/Poppins/Poppins-Medium.ttf') format('truetype');
    font-weight: 500;
    font-style: normal;
  }

  @font-face {
    font-family: 'Poppins';
    src: url('/fonts/Poppins/Poppins-SemiBold.ttf') format('truetype');
    font-weight: 600;
    font-style: normal;
  }

  @font-face {
    font-family: 'Poppins';
    src: url('/fonts/Poppins/Poppins-Bold.ttf') format('truetype');
    font-weight: 700;
    font-style: normal;
  }




  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html {
    margin: 0;
    padding: 0;
    font-family: 'Poppins', sans-serif; 
  }

  body {
    margin: 0;
    padding-bottom: 6.5rem;
    height: 100%;
    width: 100%;
  }

  :root {
    --white-font-and-icon-color: #EEFFEC;
    --light-green-color: #99CEAE;
    --mid-green-color: #98C7A0;
    --dark-green-color: #59996B;
    --dark-brown-color: #978275;
    --dark-font-color: #555555;
    --lightgreen-color: #CBD4C2;
    --font-size-header: 2.1rem;
    --font-size-subheader: 1rem;
    --font-size-description: 0.7rem;
  }

  ::placeholder {
    color: rgba(200, 200, 200, 0.8);
  }
`;
