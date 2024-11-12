// components/Navbar.js
import { useRouter } from "next/router";
import styled from "styled-components";
import ReactIcon from "./Reacticon";
import Link from "next/link";
import { PiPottedPlantBold } from "react-icons/pi";
import { MdOutlineQrCode2 } from "react-icons/md";
import { TbBrandGoogleHome } from "react-icons/tb";
import { IoMdAlarm } from "react-icons/io";
import { IoPersonCircle } from "react-icons/io5";

export default function Navbar() {
  const router = useRouter();
  const pathname = router.pathname;

  function handlePathCompare(path) {
    return pathname === path ? "active" : "";
  }

  return (
    <Nav>
      <List>
        <li>
          <Anchor href="/scan">
            <Icon IconComponent={MdOutlineQrCode2} $active={handlePathCompare("/scan")} />
            Scan
          </Anchor>
        </li>

        <li>
          <Anchor href="/addplants">
            <Icon IconComponent={PiPottedPlantBold} $active={handlePathCompare("/addplants")}/>
            Anlegen
          </Anchor>
        </li>

        <li>
          <Anchor href="/">
            <Icon IconComponent={TbBrandGoogleHome} $active={handlePathCompare("/")}/>
            Home
          </Anchor>
        </li>

        <li>
          <Anchor href="/alarm">
            <Icon IconComponent={IoMdAlarm} $active={handlePathCompare("/alarm")} />
            Alarme
          </Anchor>
        </li>

        <li>
          <Anchor href="/profile">
            <Icon IconComponent={IoPersonCircle} $active={handlePathCompare("/profile")}/>
            Profil
          </Anchor>
        </li>
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
  padding: 0rem 1.7rem;
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

const Icon = styled(ReactIcon)`
  margin: 0 0 -1rem 0;
  color: ${props => props.$active ? 'var(--dark-brown-color)' : 'var(--dark-green-color)'};
`;
