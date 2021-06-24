import React from "react";

import styled from "styled-components";

import Playground from "../../game/components/playground";

const PlaygroundPage: React.FC = () => (
  <Page>
    <Playground />
  </Page>
);

const Page = styled.div``;

export default PlaygroundPage;
