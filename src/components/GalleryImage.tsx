import React, { useState } from "react";
import Tooltip from "@material-ui/core/Tooltip";
import Modal from "@material-ui/core/Modal";
import styled from "styled-components";
import FadeIn from "react-lazyload-fadein";
import { MarsImage } from "../types";

const Dimg = styled.img`
  cursor: pointer;
  border: 0px;
  border-style: none;
  outline: 0px;
  width: 95vw;
  height: 95vh;
  object-fit: contain;

  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
`;

const Mimg = styled.img`
  cursor: pointer;
  width: 100%;
`;

export default function GalleryImage(image: MarsImage): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <FadeIn height={600} key={`fi-${image.imgSrc}`}>
      {(onload) => (
        <>
          <Tooltip arrow title={image.desc}>
            <Mimg
              src={image.imgSrc}
              key={image.desc}
              onLoad={onload}
              alt={image.desc}
              onClick={() => setIsOpen(!isOpen)}
            />
          </Tooltip>

          <Modal open={isOpen} onClose={() => setIsOpen(false)}>
            <Dimg
              src={image.imgSrc}
              alt={image.desc}
              onClick={() => setIsOpen(!isOpen)}
            />
          </Modal>
        </>
      )}
    </FadeIn>
  );
}
