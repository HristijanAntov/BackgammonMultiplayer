import React, { useState, useEffect } from "react";

//styles
import { Container, Title, Body, Paragraph } from "../ui/styles";
import { StyledLink } from "./styles";

interface Props {}

const AboutComponent: React.FC<Props> = () => {
  return (
    <Container>
      <Title>About</Title>
      <Body>
        <Paragraph>
          Author:{" "}
          <StyledLink
            href="https://www.linkedin.com/in/hristijan-antov-520479127/"
            target="blank"
            style={{ color: "#64dbff" }}
          >
            Hristijan Antov
          </StyledLink>
        </Paragraph>
        <Paragraph>
          This is a game I started developing for my undegraduate thesis. It
          tries to simulate the ancient board game called{" "}
          <StyledLink
            href="https://en.wikipedia.org/wiki/Backgammon"
            target="blank"
          >
            Backgammon
          </StyledLink>
          , in a multiplayer fashion.
        </Paragraph>

        <Paragraph>
          <label>The technologies used to support this project are:</label>
          <ul>
            <li>Typescript</li>
            <li>Node</li>
            <li>ExpressJS</li>
            <li>SocketIO</li>
            <li>React</li>
          </ul>
        </Paragraph>
      </Body>
    </Container>
  );
};

export default AboutComponent;
