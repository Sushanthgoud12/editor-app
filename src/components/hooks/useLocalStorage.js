import { useState } from "react";
import { DEFAULT_CODE } from "../utils/constants";
import {
  saveToLocalStorage,
  loadFromLocalStorage,
  removeFromLocalStorage,
} from "../utils/localStorage";

export const useLocalStorage = () => {
  const [code, setCode] = useState(() => {
    const savedCode = {
      html: loadFromLocalStorage("html"),
      css: loadFromLocalStorage("css"),
      js: loadFromLocalStorage("js"),
    };
    return {
      html: savedCode.html || DEFAULT_CODE.html,
      css: savedCode.css || DEFAULT_CODE.css,
      js: savedCode.js || DEFAULT_CODE.js,
    };
  });

  const handleSave = (key, value) => {
    saveToLocalStorage(key, value);
  };

  const handleReset = () => {
    setCode(DEFAULT_CODE);
    ["html", "css", "js"].forEach((key) => removeFromLocalStorage(key));
  };

  return {
    code,
    setCode,
    handleSave,
    handleReset,
  };
};
