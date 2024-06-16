import * as React from "react";
const Power = (props) => (
  <svg
    id="Flash_On_32"
    width={32}
    height={32}
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <rect width={32} height={32} stroke="none" fill="#000000" opacity={0} />
    <g transform="matrix(0.7 0 0 0.7 16 16)">
      <path
        style={{
          stroke: "none",
          strokeWidth: 1,
          strokeDasharray: "none",
          strokeLinecap: "butt",
          strokeDashoffset: 0,
          strokeLinejoin: "miter",
          strokeMiterlimit: 4,
          fill: "rgb(255,193,7)",
          fillRule: "nonzero",
          opacity: 1,
        }}
        transform=" translate(-23, -25)"
        d="M 33 22 L 23.6 22 L 30 5 L 19 5 L 13 26 L 21.6 26 L 17 45 z"
        strokeLinecap="round"
      />
    </g>
  </svg>
);
export default Power;
