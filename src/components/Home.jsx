import { Parallax } from "react-parallax";
import Cat from "../assets/cat.jpg";
import Dog from "../assets/dog.jpg";
import Pets from "../assets/pets.jpg";
import "../styles/Home.css";
import { Button, Container, Typography } from "@mui/material";
import { animated, useInView, useSpring } from "react-spring";

function Home() {
  const [ref1, inView1] = useInView({ triggerOnce: true });
  const [ref2, inView2] = useInView({ triggerOnce: true });
  const [ref3, inView3] = useInView({ triggerOnce: true });

  const leftToRight = useSpring({
    from: { opacity: 0, transform: "translateX(-100%)" },
    to: {
      opacity: inView1 ? 1 : 0,
      transform: inView1 ? "translateX(0)" : "translateX(-100%)",
    },
    config: { duration: 1000 },
  });

  const rightToLeft = useSpring({
    from: { opacity: 0, transform: "translateX(100%)" },
    to: {
      opacity: inView2 ? 1 : 0,
      transform: inView2 ? "translateX(0)" : "translateX(100%)",
    },
    config: { duration: 1000 },
  });

  const leftToRight2 = useSpring({
    from: { opacity: 0, transform: "translateX(-100%)" },
    to: {
      opacity: inView3 ? 1 : 0,
      transform: inView3 ? "translateX(0)" : "translateX(-100%)",
    },
    config: { duration: 1000 },
  });

  return (
    <Container className="container">
      <Parallax
        className="cat-parallax"
        bgImage={Cat}
        bgImageAlt="home-bg"
        strength={-600}
        blur={{ min: -10, max: 10 }}
      >
        <animated.div
          ref={ref1}
          style={{ ...leftToRight, paddingTop: "40vh" }}
          className="home-content"
        >
          <Typography variant="h1" align="center" style={{ color: "white" }}>
            The Struggles of Stray Animals
          </Typography>
          <Typography variant="body1" align="center" style={{ color: "white" }}>
            Many stray animals face harsh conditions, lack of food, and shelter.
            They often suffer from diseases and injuries without any care. It's
            a tough life for these innocent creatures.
          </Typography>
        </animated.div>
      </Parallax>
      <Parallax
        className="dog-parallax"
        bgImage={Dog}
        strength={800}
        blur={{ min: -10, max: 10 }}
      >
        <animated.div
          ref={ref2}
          style={{ ...rightToLeft, paddingTop: "40vh" }}
          className="home-content"
        >
          <Typography variant="h1" align="center" style={{ color: "white" }}>
            Why Adopt?
          </Typography>
          <Typography variant="body1" align="center" style={{ color: "white" }}>
            Adopting a pet not only gives them a second chance at life but also
            brings joy and companionship to your home. You save a life and gain
            a loyal friend.
          </Typography>
        </animated.div>
      </Parallax>
      <Parallax
        className="pets-parallax"
        bgImage={Pets}
        strength={500}
        blur={{ min: -10, max: 13 }}
      >
        <animated.div
          ref={ref3}
          style={{ ...leftToRight2, paddingTop: "40vh" }}
          className="home-content"
        >
          <Typography variant="h1" align="center" style={{ color: "white" }}>
            Why Choose Us?
          </Typography>
          <Typography variant="body1" align="center" style={{ color: "white" }}>
            Our platform connects you with shelters and rescue groups to find
            the perfect pet for your family. We ensure that every pet is healthy
            and ready for a loving home. Adopt with us and make a difference.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: "2rem" }}
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
