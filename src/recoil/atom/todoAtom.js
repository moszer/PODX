import { atom } from "recoil";

export const todoListAtom = atom({
  key: "todoListState", // Unique identifier for the atom
  default: {
    deviceName: "", // Initial state for deviceName
    firmwareDataByte: 0,
    statusUpdate: false,
    characteristic: null,
    selectmode: 0,
    Navigate_: "Home"
  },
});
