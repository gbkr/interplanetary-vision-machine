import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import { FormControl } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { DatePicker } from "@material-ui/pickers";
import {
  ArrowForward,
  ArrowBack,
  LastPage,
  FirstPage,
} from "@material-ui/icons";
import { RoverData, Camera, MarsImage } from "../types";
import { cameraInfo } from "../constants";
import { fetchRoverData, fetchImages } from "../services/nasa";
import { calcEarthDate, filterByCamera } from "../utils/utils";
import { useViewPort, usePrevious } from "../hooks";
import * as dayjs from "dayjs";

const SolChange = styled.span`
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const SolNav = styled.span`
  margin-left: 25px;
  display: inherit;
`;

const Controls = styled.div`
  height: 72px;
  border: 1px solid #3b3b3b;
  position: fixed;
  top: 0;
  width: 100%;
  background: #131418;
  display: flex;
`;

const DateInfo = styled.div`
  display: inline-block;
  margin-left: 14px;
  line-height: 70px;
  height: 60px;
`;

const ImageCount = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: flex-end;
  padding-right: 20px;
`;

const RandomButton = styled(Button)`
  margin: 20px 20px 20px 0 !important;
  display: flex;
  align-items: center;
  padding-left: 20px;
`;

const Icon = styled.span`
  margin: 0 5px;
`;

const EarthDate = styled.span`
  margin-left: 20px;
`;

const useStyles = makeStyles((theme: Theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  solFormControl: {
    margin: theme.spacing(1),
    width: "9ch",
  },
  dateFormControl: {
    margin: theme.spacing(1),
    width: "22ch",
  },
  iconOutlined: {},
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}), {index: 1});

interface FilterProps {
  loading: boolean;
  setLoading: (boolean) => void;
  setImages: (images: MarsImage[]) => void;
  images: MarsImage[];
}

export default function Filters({
  loading,
  setLoading,
  setImages,
  images,
}: FilterProps): React.ReactElement {
  const [rover, setRover] = useState("perseverance");
  const [roverData, setRoverData] = useState<RoverData>({});
  const [camera, setCamera] = useState<Camera>("ALL");
  const [availableCameras, setAvailableCameras] = useState<string[]>(["ALL"]);
  const [sol, setSol] = useState(null);
  const [earthDate, setEarthDate] = useState("");
  const [solInput, setSolInput] = useState(false);
  const [solInputValue, setSolInputValue] = useState(0);
  const [allImages, setAllImages] = useState<MarsImage[]>([]);

  const prevCamera = usePrevious(camera);

  useEffect(() => {
    fetchRoverData().then((data) => {
      setRoverData(data);
      setSol(data[rover].maxSol);
    });
  }, []);

  useEffect(() => {
    try {
      setLoading(true);

      setEarthDate("");
      setImages([]);
      if (Number.isInteger(sol)) {
        if (sol > roverData[rover].maxSol) {
          setSol(roverData[rover].maxSol);
        }
        fetchImages({ rover, sol, camera, prevCamera, allImages }).then(
          (data) => {
            setAllImages(data);
            solCameras(data).then((cam) => {
              if (cam.includes(camera)) {
                setAvailableCameras(cam);
              } else {
                setCamera("ALL");
              }
            });
            setEarthDate(calcEarthDate(data));
            setImages(filterByCamera(camera, data));
            setLoading(false);
          }
        );
      }
    } catch (error) {
      console.error(error);
    }
  }, [rover, camera, sol]);

  const { width } = useViewPort();

  const solCameras = async (solData: MarsImage[]) =>
    await ["ALL", ...new Set(solData.map((img) => img.camera))];

  const breakOne = 1360;
  const breakTwo = 1000;

  const copts = Object.keys(cameraInfo).map((abbv) => {
    if (availableCameras.includes(abbv)) {
      return (
        <MenuItem key={abbv} value={abbv}>
          {cameraInfo[abbv]}
        </MenuItem>
      );
    }
  });

  function handleSolUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSolInput(false);
    if (solInputValue > 0 && solInputValue <= roverData[rover].maxSol) {
      setSol(solInputValue);
    }
  }

  function handleSolChange(event: React.FormEvent<HTMLInputElement>) {
    const value = Number((event.target as HTMLInputElement).value);
    if (!isNaN(+value)) {
      setSolInputValue(value);
    } else {
      setSolInputValue(sol);
    }
  }

  const solTextInput = () => (
    <FormControl variant="outlined" className={classes.solFormControl}>
      <form noValidate autoComplete="off" onSubmit={handleSolUpdate}>
        <TextField
          id="solTextInput"
          variant="outlined"
          onInput={handleSolChange}
        />
      </form>
    </FormControl>
  );

  const solTextOutput = () => (
    <FormControl
      variant="outlined"
      className={classes.solFormControl}
      onClick={() => setSolInput(!solInput)}
    >
      <TextField id="solText" value={sol} variant="outlined" />
    </FormControl>
  );

  const updateEarthDate = (djs: dayjs.Dayjs) => {
    const ratioOfEarthToMarsDay = 1.02749125;
    const currentDate = new Date(earthDate);
    const diff = Math.ceil(
      Math.abs(
        (djs.unix() * 1000 - currentDate.getTime()) / (1000 * 3600 * 24)
      ) / ratioOfEarthToMarsDay
    );
    const newSol = djs.toDate() > currentDate ? sol + diff : sol - diff;
    setSol(newSol);
  };

  const earthDateSelector = () => (
    <FormControl variant="outlined" className={classes.dateFormControl}>
      <DatePicker
        onChange={updateEarthDate}
        value={earthDate}
        variant="dialog"
        inputVariant="outlined"
        format="DD MMMM YYYY"
        maxDate={new Date(maxEarthDate())}
        minDate={new Date(minEarthDate())}
      />
    </FormControl>
  );

  const maxEarthDate = () =>
    rover.length && Object.keys(roverData).length && roverData[rover].maxDate;

  const minEarthDate = () =>
    rover.length && Object.keys(roverData).length && roverData[rover].minDate;

  const maxSolNo = () =>
    rover.length && Object.keys(roverData).length && roverData[rover].maxSol;

  const randomRoverSol = () => {
    const randomRover =
      Object.keys(roverData)[
        Math.floor(Math.random() * Object.keys(roverData).length)
      ];
    setRover(randomRover);

    const maxRoverSol = roverData[randomRover].maxSol;
    const randomSol = Math.floor(Math.random() * maxRoverSol) + 1;
    setSol(randomSol);
  };

  const randomCurrentRoverSol = () => {
    const maxRoverSol = roverData[rover].maxSol;
    const randomSol = Math.floor(Math.random() * maxRoverSol);
    setSol(randomSol);
  };

  const classes = useStyles();

  return (
    <Controls>
      <FormControl variant="outlined" className={classes.formControl}>
        <Select
          value={rover}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setRover((e.target as HTMLInputElement).value)
          }
          variant="outlined"
        >
          {Object.keys(roverData).map((rover) => {
            return (
              <MenuItem value={rover} key={rover}>
                {rover.charAt(0).toUpperCase() + rover.slice(1)}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>

      {width > breakTwo && (
        <FormControl variant="outlined" className={classes.formControl}>
          <Select
            value={camera}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCamera((e.target as HTMLInputElement).value as Camera)
            }
            key={camera}
          >
            {copts}
          </Select>
        </FormControl>
      )}

      <SolNav>
        {sol > 1 ? (
          !loading && (
            <>
              {width > breakTwo && (
                <SolChange onClick={() => setSol(1)}>
                  <FirstPage color="action" />
                </SolChange>
              )}
              <SolChange onClick={() => setSol(sol - 1)}>
                <ArrowBack color="action" />
              </SolChange>
            </>
          )
        ) : (
          <span>{` `}</span>
        )}

        <DateInfo>
          <span>
            Sol {solInput ? solTextInput() : solTextOutput()} of {maxSolNo()}
          </span>

          {width > breakTwo && (
            <span>
              {earthDate !== "" && (
                <EarthDate>Date {earthDateSelector()}</EarthDate>
              )}
            </span>
          )}
        </DateInfo>

        {!loading && sol < maxSolNo() && (
          <>
            <SolChange onClick={() => setSol(sol + 1)}>
              <Icon>
                <ArrowForward color="action" />
              </Icon>
            </SolChange>

            {width > breakTwo && (
              <SolChange onClick={() => setSol(maxSolNo())}>
                <Icon>
                  <LastPage color="action" />
                </Icon>
              </SolChange>
            )}
          </>
        )}
      </SolNav>

      {width > breakOne && (
        <>
          <ImageCount>
            {images.length === 0 ? `...` : `${images.length} images`}
          </ImageCount>

          <RandomButton
            variant="contained"
            color="primary"
            onClick={randomCurrentRoverSol}
          >
            {`Random ${rover}`}
          </RandomButton>

          <RandomButton
            variant="contained"
            color="primary"
            onClick={randomRoverSol}
          >
            Random All
          </RandomButton>
        </>
      )}
    </Controls>
  );
}
