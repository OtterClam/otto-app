import styled from "styled-components";
import twitter from "../assets/socials/twitter.svg";
import discord from "../assets/socials/discord.svg";

interface SocialType {
  image: string;
  link: string;
}

const socials: SocialType[] = [
  {
    image: twitter,
    link: "https://twitter.com/ChaseManning_NZ",
  },
  {
    image: discord,
    link: "https://discord.gg/CaR7RhfDZ6",
  },
];

const StyledSocials = styled.div`
  display: flex;
  align-items: center;
`;

const SocialLink = styled.a`
  margin: 0 0.6rem;
`;

const SocialImage = styled.img`
  height: 2.7rem;
`;

const Socials = () => {
  return (
    <StyledSocials>
      {socials.map((social: SocialType) => (
        <SocialLink
          key={social.link}
          href={social.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          <SocialImage src={social.image} />
        </SocialLink>
      ))}
    </StyledSocials>
  );
};

export default Socials;
