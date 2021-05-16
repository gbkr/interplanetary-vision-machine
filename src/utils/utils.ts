import { formatDateRange } from './dates';
import { MarsImage, Camera } from '../types';

export const filterByCamera = (camera: Camera, data: MarsImage[]): MarsImage[] => {
  if (camera === "ALL") return data;
  return data.filter((e) => e.camera === camera);
};

export const calcEarthDate = (data: MarsImage[]): string => {
  if (!data.length) return "";
  const sortedData = data.sort(
    (a, b) => +new Date(b.earthDate) - +new Date(a.earthDate)
  );
  const startDate = sortedData[0].earthDate;
  const endDate = sortedData[sortedData.length - 1].earthDate;
  return formatDateRange(new Date(startDate), new Date(endDate));
};


