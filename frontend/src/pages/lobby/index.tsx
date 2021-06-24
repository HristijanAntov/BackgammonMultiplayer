import React from "react";

import styled from "styled-components";

import Lobby from "../../game/components/lobby";

const LobbyPage: React.FC = () => (
  <Page>
    <Lobby />
  </Page>
);

const Page = styled.div``;

export default LobbyPage;
