// components/Navbar.js
import { useRouter } from 'next/router';
import styled from 'styled-components';
import MaterialIcon from './MaterialIcon';
import Link from 'next/link';


export default function Navbar() {
    const router = useRouter();
    const pathname = router.pathname;

    function handlePathCompare(path) {
        return pathname === path ? "active" : "";
    }   


  return (
    <Nav>
      <List>
        <Item>
            <Anchor href="/scan">
                <MaterialIcon $active={handlePathCompare("/scan")}>qr_code_2</MaterialIcon> Scan 
            </Anchor>
        </Item>
    
        <Item>
            <Anchor href="/addplants">
                <MaterialIcon $active={handlePathCompare("/addplants")}>potted_plant</MaterialIcon> Anlegen
            </Anchor>
        </Item>

        <Item>
            <Anchor href="/">
                <MaterialIcon $active={handlePathCompare("/")}>Home_app_logo</MaterialIcon> Home
            </Anchor>
        </Item>

        <Item>
            <Anchor href="/alarm">
                <MaterialIcon $active={handlePathCompare("/alarm")}>Alarm</MaterialIcon> Alarme
            </Anchor>
        </Item>
        
        <Item>
            <Anchor href="/profile">
                <MaterialIcon $active={handlePathCompare("/profile")}>Person</MaterialIcon> Profil
            </Anchor>
        </Item>

      </List>
    </Nav>
  );
}


const Nav = styled.nav`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: white;
    margin-top: 6rem;
`;

const List = styled.ul`
    list-style: none;
    margin: 0;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid rgba(128, 128, 128, 0.25);

`;

const Anchor = styled(Link)`
    text-decoration: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: var(--dark-font-color);
    font-size: 0.7rem;
`;

const Item = styled.li`
`;
