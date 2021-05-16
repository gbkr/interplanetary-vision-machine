import React from 'react';
import { MarsImage } from "../types";
import GalleryImage from "./GalleryImage";
import styled from "styled-components";
import { arrayDivider } from "../utils/arrayDivider";

const Row = styled.div`
  display: -ms-flexbox; /* IE10 */
  display: flex;
  -ms-flex-wrap: wrap; /* IE10 */
  flex-wrap: wrap;
  padding: 0 4px;
`;

const Column = styled.div`
  -ms-flex: 25%; /* IE10 */
  flex: 25%;
  max-width: 25%;
  padding: 0 4px;
  img {
    margin-top: 8px;
    vertical-align: middle;
    width: 100%;
  }
  @media screen and (max-width: 800px) {
    -ms-flex: 50%;
    flex: 50%;
    max-width: 50%;
  }
  @media screen and (max-width: 600px) {
    -ms-flex: 100%;
    flex: 100%;
    max-width: 100%;
  }
`;

const ImageGrid = styled.div`
  box-sizing: border-box;
`;

export const Gallery = ({ images }: { images: MarsImage[] }): React.ReactElement => {
  const nColumns = 4;
  const columns = arrayDivider(images, nColumns);

  return (
    <ImageGrid>
      <Row>
        <Column>{columns[0].map((img) => GalleryImage(img))}</Column>
        <Column>{columns[1].map((img) => GalleryImage(img))}</Column>
        <Column>{columns[2].map((img) => GalleryImage(img))}</Column>
        <Column>{columns[3].map((img) => GalleryImage(img))}</Column>
      </Row>
    </ImageGrid>
  );
};
