import styled from "styled-components";

const StyledAnotherPage = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  font-size: 2.3rem;
  padding: 3rem;
  border: solid 1px pink;
`;

const AnotherPage = () => {
  return (
    <StyledAnotherPage>pages/another-page/AnotherPage.tsx</StyledAnotherPage>
  );
};

export default AnotherPage;
