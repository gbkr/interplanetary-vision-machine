
import React from "react";
import Filters from "../components/Filters";
import { Gallery } from "../components/Gallery";
import { useState } from "react";
import { MarsImage } from "../types";
import { CircularProgress } from "@material-ui/core";
import styled from "styled-components";

const Container = styled.div`
  margin-top: 5em;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export default function Home(): React.ReactElement {
  const [images, setImages] = useState<MarsImage[]>([]);
  const [loading, setLoading] = useState(false);

  return (
    <Container>
      {loading && <CircularProgress color="inherit" />}
      {!loading && !images.length && <span>No data for these criteria</span>}

      <Filters
        loading={loading}
        setLoading={setLoading}
        setImages={setImages}
        images={images}
      />

      <Gallery images={images} />
    </Container>
  );
}
