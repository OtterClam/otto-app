import { Link } from "react-router-dom";
import styled from "styled-components";
import Connector from "./Connector";

interface NavItemType {
  label: string;
  link: string;
}

// We can delete this after launch
const navItems: NavItemType[] = [
  {
    label: "Home",
    link: "/",
  },
  {
    label: "Another Page",
    link: "/another",
  },
];

const StyledHeader = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 3rem;
  border: solid 1px blue;
`;

const Logo = styled.div`
  font-size: 2.3rem;
`;

const NavItems = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  transform: translate(-50%, -50%);
`;

const NavItem = styled(Link)`
  margin: 0 1rem;
  font-size: 2rem;
`;

const Header = () => {
  return (
    <StyledHeader>
      <Logo>components/Header.tsx</Logo>
      <NavItems>
        {navItems.map((navItem: NavItemType) => (
          <NavItem key={navItem.link} to={navItem.link}>
            {navItem.label}
          </NavItem>
        ))}
      </NavItems>
      <Connector />
    </StyledHeader>
  );
};

export default Header;
