// styles.js
import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`

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

  input[type="date"]::-webkit-calendar-picker-indicator {
    filter: invert(1);
  }

`;
