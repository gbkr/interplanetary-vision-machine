// https://mars-photos.herokuapp.com/api/v1/manifests/curiosity

import axios from "axios";
import { MarsImage, Camera, RoverData } from "../types";
import { cameraInfo } from "../constants";
import { formatDate } from "../utils/dates";

export const fetchImages = async ({
  rover,
  sol,
  camera,
  prevCamera,
  allImages
}: {
  rover: string;
  sol: number;
  camera: Camera;
  prevCamera: Camera;
  allImages: MarsImage[]
}): Promise<MarsImage[]> => {

  if (camera !== prevCamera && typeof prevCamera !== 'undefined') {
    return Promise.resolve(allImages)
  }

  let accImages: MarsImage[] = [];
  const page = 0;

  const fetchPage = async (page: number) => {
    const url = `https://mars-photos.herokuapp.com/api/v1/rovers/${rover}/photos?sol=${sol}&page=${page}`;

    const {
      data: { photos },
    } = await axios.get(url);

    if (photos.length) {
      const imgData = await photos.map((e) => ({
        id: e.id,
        sol: e.sol,
        camera: e.camera.name,
        earthDate: e.earth_date,
        imgSrc: e.img_src,
        desc: `ID: ${rover[0].toUpperCase()}${e.sol}-${e.id}, camera: ${
          cameraInfo[e.camera.name]
        }, Date: ${formatDate(new Date(e.earth_date))}`,
      }));

      accImages = [...accImages, ...imgData];
    } else {
      return accImages;
    }

    return fetchPage(page + 1);
  };

  return fetchPage(page);
};

export const fetchRoverData = async (): Promise<RoverData> => {
  const url = "https://mars-photos.herokuapp.com/api/v1/rovers/";

  const {
    data: { rovers },
  } = await axios.get(url);

  const info = rovers.reduce((acc, item) => {
    return {
      ...acc,
      [item["name"].toLowerCase()]: {
        maxSol: item["max_sol"],
        minDate: addDay(item["landing_date"]),
        maxDate: item["max_date"],
      },
    };
  }, {});

  return info;
};

const addDay = (dateStr: string): string => {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + 1);
  const nextDay =
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  return nextDay;
};
