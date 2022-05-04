import Xarrow from "react-xarrows";
import LaptopIcon from "@mui/icons-material/Laptop";
import React, { useRef } from "react";
import { Link } from "react-router-dom";
import "./index.scss";

const LandingPage = () => {
  const box1Ref = useRef(null);
  const box2Ref = useRef(null);
  const box3Ref = useRef(null);
  const box4Ref = useRef(null);

  const nodeInfo = [
    {
      ref: box1Ref,
      id: "box1",
    },
    {
      ref: box2Ref,
      id: "box2",
    },
    {
      ref: box3Ref,
      id: "box3",
    },
    {
      ref: box4Ref,
      id: "box4",
    },
  ];
  const nodes = nodeInfo.map(({ ref, id }, i) => {
    return (
      <Link to={`/login?node=${i + 1}`} key={id}>
        <div className="box" ref={ref} id={id}>
          <LaptopIcon sx={{ fontSize: 100 }} />
          <p id="node">Node {i + 1}</p>
        </div>
      </Link>
    );
  });

  const arrows = [];
  nodeInfo.forEach((from, i) => {
    const fromRef = from.ref;
    for (let j = i + 1; j < nodeInfo.length; j++) {
      const toRef = nodeInfo[j].ref;
      arrows.push(
        <Xarrow
          dashness={true}
          curveness={0}
          strokeWidth="4"
          color="white"
          showTail={true}
          showHead={true}
          start={fromRef}
          end={toRef}
        />
      );
    }
  });

  return (
    <>
      {nodes}
      {arrows}
    </>
  );
};

export default LandingPage;
