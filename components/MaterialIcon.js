import styled from "styled-components";

export default function MaterialIcon({ children, $active, className }) {
  return (
    <MaterialIconStyled $active={$active} className={className}>
      {children}
    </MaterialIconStyled>
  );
}

const MaterialIconStyled = styled.span`
  font-family: 'Material Symbols Outlined'; 
  font-size: 35px;
  color: ${props => props.$active ? 'var(--dark-brown-color)' : 'var(--dark-green-color)'};
`;