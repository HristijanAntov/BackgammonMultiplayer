import React, { useState, useEffect } from "react";

import { Container, Title, Body, Paragraph } from "../ui/styles";

//components

interface Props {}

const AboutComponent: React.FC<Props> = () => {
  return (
    <Container>
      <Title>About</Title>
      <Body>
        <Paragraph>Author: Hristijan Antov</Paragraph>
        <Paragraph>
          This is a game I started developing for my undegraduate thesis. It
          tries to simulate the ancient board game called Backgammon, in a
          multiplayer fashion.
        </Paragraph>

        <Paragraph>
          <label>The technologies used to support this project are:</label>
          <label>
            <label>React</label>,<label>Typescript</label>
          </label>
        </Paragraph>
      </Body>
    </Container>
  );
};

export default AboutComponent;
