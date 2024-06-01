import { Parallax } from "react-parallax";
import Cat from "../assets/cat.jpg";
import Dog from "../assets/dog.jpg";
import Pets from "../assets/pets.jpg";
import "../styles/Home.css";
import { Box } from "@mui/material";

function Home() {
  return (
    <Box className="container">
      <Parallax
        className="cat-parallax"
        bgImage={Cat}
        bgImageAlt="home-bg"
        strength={-800}
        blur={{ min: -20, max: 15 }}
      >
        <div className="home-content">
          <h1>Adopt A Friend</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
        </div>
      </Parallax>
      <Parallax
        className="dog-parallax"
        bgImage={Dog}
        strength={-100}
        blur={{ min: -20, max: 15 }}
      >
        <div className="home-content">
          <h1>Adopt A Friend</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
        </div>
      </Parallax>
      <Parallax
        className="pets-parallax"
        bgImage={Pets}
        strength={-300}
        blur={{ min: -20, max: 15 }}
      >
        <div className="home-content">
          <h1>Adopt A Friend</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
        </div>
      </Parallax>
    </Box>
  );
}

export default Home;
