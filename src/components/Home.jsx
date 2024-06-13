import React, { useEffect, useState } from "react";
import { Parallax } from "react-parallax";
import Cat from "../assets/cat.jpg";
import Dog from "../assets/dog.jpg";
import Pets from "../assets/pets.jpg";
import { Button, Container, Text, useMediaQuery } from "@chakra-ui/react";
import { animated, useSpring } from "react-spring";
import { useInView } from "react-intersection-observer";
import "../styles/Home.css";

function Home() {
  const [isMobile] = useMediaQuery("(max-width: 600px)");
  const [isTablet] = useMediaQuery(
    "(min-width: 601px) and (max-width: 1024px)",
  );
  const [isDesktop] = useMediaQuery("(min-width: 1025px)");

  const [ref1, inView1] = useInView({ triggerOnce: true });
  const [ref2, inView2] = useInView({ triggerOnce: true });
  const [ref3, inView3] = useInView({ triggerOnce: true });

  const leftToRight = useSpring({
    from: { opacity: 0, transform: "translateX(-100%)" },
    to: {
      opacity: inView1 ? 1 : 0,
      transform: inView1 ? "translateX(0)" : "translateX(-100%)",
    },
    config: { duration: 700 },
  });

  const rightToLeft = useSpring({
    from: { opacity: 0, transform: "translateX(100%)" },
    to: {
      opacity: inView2 ? 1 : 0,
      transform: inView2 ? "translateX(0)" : "translateX(100%)",
    },
    config: { duration: 700 },
  });

  const leftToRight2 = useSpring({
    from: { opacity: 0, transform: "translateX(-100%)" },
    to: {
      opacity: inView3 ? 1 : 0,
      transform: inView3 ? "translateX(0)" : "translateX(-100%)",
    },
    config: { duration: 700 },
  });

  const getStrength = (mobile, tablet, desktop) => {
    if (isMobile) return mobile;
    if (isTablet) return tablet;
    return desktop;
  };

  return (
    <Container minHeight="100%" minWidth="99vw" padding="0" margin="0">
      <Parallax
        className="cat-parallax"
        bgImage={Cat}
        bgImageAlt="home-bg"
        strength={getStrength(-500, -700, -900)}
        blur={{ min: -10, max: 10 }}
        bgImageSize="cover"
      >
        <animated.div
          ref={ref1}
          style={{
            ...leftToRight,
            paddingTop: "30vh",
            paddingLeft: "3rem",
            paddingRight: "3rem",
            zIndex: 1,
            position: "relative",
          }}
          className="home-content"
        >
          <Text fontSize="4xl" color="white" textAlign="center">
            The Struggles of Stray Animals
          </Text>
          <Text
            fontSize="md"
            color="white"
            textAlign="center"
            paddingTop="1rem"
          >
            Many stray animals face harsh conditions, lack of food, and shelter.
            <br />
            They often suffer from diseases and injuries without any care.
            <br />
            It's a tough life for these innocent creatures.
          </Text>
        </animated.div>
      </Parallax>
      <Parallax
        className="dog-parallax"
        bgImage={Dog}
        strength={getStrength(300, 100, -900)}
        bgImageSize="cover"
        blur={{ min: -10, max: 10 }}
      >
        <animated.div
          ref={ref2}
          style={{
            ...rightToLeft,
            paddingTop: "30vh",
            paddingLeft: "3rem",
            paddingRight: "3rem",
            zIndex: 1,
            position: "relative",
          }}
          className="home-content"
        >
          <Text fontSize="4xl" color="white" textAlign="center">
            Why Adopt?
          </Text>
          <Text
            fontSize="md"
            color="white"
            textAlign="center"
            paddingTop="1rem"
          >
            Adopting a pet not only gives them a second chance at life but also
            <br />
            brings joy and companionship to your home.
            <br />
            You save a life and gain a loyal friend.
          </Text>
        </animated.div>
      </Parallax>
      <Parallax
        className="pets-parallax"
        bgImage={Pets}
        strength={getStrength(100, 300, 600)}
        blur={{ min: -10, max: 13 }}
        bgImageSize="cover"
      >
        <animated.div
          ref={ref3}
          style={{
            ...leftToRight2,
            paddingTop: "30vh",
            paddingLeft: "3rem",
            paddingRight: "3rem",
            zIndex: 1,
            position: "relative",
          }}
          className="home-content"
        >
          <Text fontSize="4xl" color="white" textAlign="center">
            Why Choose Us?
          </Text>
          <Text
            fontSize="md"
            color="white"
            textAlign="center"
            paddingTop="1rem"
          >
            Our platform connects you with shelters and rescue groups to find
            <br />
            the perfect pet for your family.
            <br />
            We ensure that every pet is healthy and ready for a loving home.
            <br />
            Adopt with us and make a difference.
          </Text>
          <Button
            colorScheme="blue"
            marginTop="2rem"
            onClick={() => (window.location.href = "/register")}
          >
            Register Now
          </Button>
        </animated.div>
      </Parallax>
    </Container>
  );
}

export default Home;
