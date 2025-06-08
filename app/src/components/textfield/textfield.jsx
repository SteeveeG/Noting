import React, { useRef, useEffect, useState } from "react";
import css from "./textfield.module.css";

const textfield = ({content}) => {

  return (
   <>
     <p className={css.wrapper}>{content}</p>
   </>
  );
};

export default textfield;
