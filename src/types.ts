import { cameraInfo } from './constants';
export interface MarsImage {
  sol: number;
  camera: string;
  earthDate: string;
  imgSrc: string;
  id: number;
  desc: string;
}

export type Camera = keyof typeof cameraInfo;

export interface RoverData {
  [key: string]: {
    maxSol: number;
    minDate: string;
    maxDate: string;
  };
}