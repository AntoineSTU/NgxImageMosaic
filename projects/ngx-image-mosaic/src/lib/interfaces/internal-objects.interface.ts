import { OptionalInputImageParameters } from './input-parameters.interface';

export interface ImagePosition {
  path: string;
  optionalParameters: OptionalInputImageParameters;
  z: number;
  x: number;
  height: number;
  width: number;
}

export interface Point {
  x: number;
  z: number;
  parentHeight: number;
}

export interface ImageParameters {
  path: string;
  optionalParameters: OptionalInputImageParameters;
  height: number;
  width: number;
}
