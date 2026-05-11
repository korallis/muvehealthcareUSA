import Image from "next/image";
import MuveLiving from "./Muve-Living";
import MuveHorizons from "./MuveHorizon";
import MuveCommunity from "./MuveCommunity";
import MuveMinds from "./MuveMinds";
import MuveBright from "./MuveBright";

export default function About() {
  return (
    <>
      <MuveLiving />
      <MuveHorizons />
      <MuveCommunity />
      <MuveMinds />
      <MuveBright />
    </>
  );
}
