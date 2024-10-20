import styled from "styled-components";

export default function ReactIcon({ IconComponent, $active, className }) {
  return (
    <MaterialIconStyled $active={$active} className={className}>
      <IconComponent />
    </MaterialIconStyled>
  );
}

const MaterialIconStyled = styled.span`
  font-size: 35px;
  color: ${props => props.$active ? 'var(--dark-brown-color)' : 'var(--dark-green-color)'};
`;
