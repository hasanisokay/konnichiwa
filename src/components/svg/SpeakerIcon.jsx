'use client'
import { useSelector } from "react-redux";

const SpeakerIcon = ({ clickHandler }) => {
  const theme = useSelector(state => state.theme.mode)
  return <svg
    onClick={clickHandler}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    className="cursor-pointer inline-block ml-4 "
  >
    <path
      id="SVGRepo_iconCarrier"
      stroke={theme === "light" ? "#000" : "#d9eff1"}
      // stroke='#4c4c4c'
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M16 9c.5.5 1 1.5 1 3s-.5 2.5-1 3m3-9c1.5 1.5 2 4 2 6s-.5 4.5-2 6M13 3 7 8H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2l6 5z"
    ></path>
  </svg>
};

export default SpeakerIcon;