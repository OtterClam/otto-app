import styled from "styled-components";
import Socials from "./Socials";

const StyledFooter = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 3rem;
  border: solid 1px green;
`;

const Logo = styled.div`
  font-size: 2.3rem;
`;

const Footer = () => {
  return (
    <StyledFooter>
      <Logo>components/Footer.tsx</Logo>
      <Socials />
    </StyledFooter>
  );
};

export default Footer;
