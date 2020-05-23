import { Injectable } from '@angular/core';
import {
  ImageParameters,
  ImagePosition,
  Point,
} from './interfaces/internal-objects.interface';
import { Frame } from './interfaces/frame.interface';

@Injectable({
  providedIn: 'root',
})
export class GalleryGeneratorService {
  constructor() {}

  /** To compute where to put the different images */
  generateDisplay(
    images: ImageParameters[],
    frame: Frame,
    fillingDirection: 'vertically' | 'horizontally',
    possibleReduction: number,
    possibleAugmentation: number,
    reduceLength: boolean
  ): { frame: Frame; imagePositions: ImagePosition[] } {
    if (fillingDirection == 'vertically') {
      this.transposeFrame(frame);
      this.transposeParameters(images);
    }
    // We compute the image positions using a greedy algorithm
    let result = this.computeImagePositions(
      frame,
      images,
      possibleReduction,
      possibleAugmentation
    );
    let imagePositions: ImagePosition[] = result.imagePositions;
    if (reduceLength) {
      frame.width = result.maxLength;
    }
    // We arrange horizontal margins
    this.arrangeMarginHorizontally(imagePositions, frame);
    if (fillingDirection == 'vertically') {
      this.transposeFrame(frame);
      this.transposeParameters(images);
      this.transposePositions(imagePositions);
    }
    return { frame: frame, imagePositions: imagePositions };
  }

  /** To transpose the frame */
  private transposeFrame(frame: Frame): void {
    let height = frame.height;
    frame.height = frame.width;
    frame.width = height;
  }

  /** To transpose all image parameters */
  private transposeParameters(images: ImageParameters[]): void {
    for (let image of images) {
      let height = image.height;
      image.height = image.width;
      image.width = height;
    }
  }

  /** To transpose all image positions */
  private transposePositions(images: ImagePosition[]): void {
    for (let image of images) {
      let z = image.z;
      image.z = image.x;
      image.x = z;
      let height = image.height;
      image.height = image.width;
      image.width = height;
    }
  }

  /** Compute image positions */
  private computeImagePositions(
    frame: Frame,
    images: ImageParameters[],
    possibleReduction: number,
    possibleAugmentation: number
  ): { maxLength: number; imagePositions: ImagePosition[] } {
    let nextPositionList: Point[] = [{ x: 0, z: 0, parentHeight: 0 }];
    let finalPositions: ImagePosition[] = [];
    let maxLength = 0;
    while (nextPositionList.length > 0) {
      let nextPosition = nextPositionList.pop();
      if (nextPosition) {
        let height = frame.height - nextPosition.z;
        let width = frame.width - nextPosition.x;
        let nextPositionParams = null;
        nextPositionParams = this.computeNextPositionParametersHorizontally(
          nextPosition,
          nextPositionList,
          frame
        );
        height = nextPositionParams.height;
        nextPosition = nextPositionParams.nextPosition;
        for (let i = 0; i < images.length; i++) {
          if (
            images[i].height * (1 - possibleReduction) <= height &&
            images[i].width * (1 - possibleReduction) <= width
          ) {
            let imageHeight = images[i].height;
            let imageWidth = images[i].width;
            if (images[i].height > height || images[i].width > width) {
              let reductionFactor = Math.min(
                height / images[i].height,
                width / images[i].width
              );
              imageHeight = Math.floor(reductionFactor * images[i].height);
              imageWidth = Math.floor(reductionFactor * images[i].width);
            } else if (
              images[i].height * (1 + possibleAugmentation) > height ||
              images[i].width * (1 + possibleAugmentation) > width
            ) {
              let augmentationFactor = Math.min(
                height / images[i].height,
                width / images[i].width
              );
              imageHeight = Math.floor(augmentationFactor * images[i].height);
              imageWidth = Math.floor(augmentationFactor * images[i].width);
            }
            finalPositions.push({
              path: images[i].path,
              optionalParameters: images[i].optionalParameters,
              z: nextPosition.z,
              x: nextPosition.x,
              height: imageHeight,
              width: imageWidth,
            });
            maxLength = Math.max(maxLength, nextPosition.x + imageWidth);
            images[i].height = imageHeight;
            images[i].width = imageWidth;
            nextPositionList.push({
              x: nextPosition.x + imageWidth,
              z: nextPosition.z,
              parentHeight: imageHeight,
            });
            nextPositionList.push({
              x: nextPosition.x,
              z: nextPosition.z + imageHeight,
              parentHeight: height,
            });
            nextPositionList.sort(this.getPointsComparer());
            images.splice(i, 1);
            break;
          }
        }
      }
    }
    return { maxLength: maxLength, imagePositions: finalPositions };
  }

  /** Compute parameters of next position if the galery is filled horizontally */
  private computeNextPositionParametersHorizontally(
    nextPosition: Point,
    nextPositionList: Point[],
    frame: Frame
  ): { height: number; nextPosition: Point } {
    let height = frame.height - nextPosition.z;
    let minZ = 0;
    for (let otherNextPosition of nextPositionList) {
      if (
        otherNextPosition.x > nextPosition.x &&
        otherNextPosition.z <= nextPosition.z &&
        otherNextPosition.z + otherNextPosition.parentHeight > nextPosition.z
      ) {
        return { height: 0, nextPosition: nextPosition };
      } else if (
        otherNextPosition.x > nextPosition.x &&
        otherNextPosition.z >= nextPosition.z
      ) {
        height = Math.min(height, otherNextPosition.z - nextPosition.z);
      } else if (
        otherNextPosition.x > nextPosition.x &&
        otherNextPosition.z + otherNextPosition.parentHeight <= nextPosition.z
      ) {
        minZ = Math.max(
          minZ,
          otherNextPosition.z + otherNextPosition.parentHeight
        );
      }
    }
    height = height + nextPosition.z - minZ;
    nextPosition.z = minZ;
    return { height: height, nextPosition: nextPosition };
  }

  /** Key function to order the next positions, following the filling direction */
  private getPointsComparer() {
    return function (point1: Point, point2: Point): number {
      if (
        point1.x < point2.x ||
        (point1.x == point2.x && point1.z < point2.z)
      ) {
        return 1;
      } else {
        return -1;
      }
    };
  }

  /** To set up better margins between images setup with the horizontal direction */
  private arrangeMarginHorizontally(
    images: ImagePosition[],
    frame: Frame
  ): void {
    interface ImageNeighborsHorizontal {
      indice: number;
      imagesBelow: number[];
      imagesAbove: number[];
    }
    // As a first step, we save all images above and below others
    let imageNeighborsList: ImageNeighborsHorizontal[] = [];
    let maxHeight = 1;
    for (let k = 0; k < images.length; k++) {
      let image = images[k];
      let imageNeighbors = {
        indice: k,
        imagesAbove: new Array(),
        imagesBelow: new Array(),
      };
      if (image.z != 0) {
        let marginTop = image.z;
        let marginBottom = frame.height - image.z - image.height;
        for (let i = 0; i < images.length; i++) {
          let otherImage = images[i];
          if (
            (otherImage.x >= image.x && otherImage.x < image.x + image.width) ||
            (otherImage.x + otherImage.width > image.x &&
              otherImage.x + otherImage.width <= image.x + image.width) ||
            (otherImage.x <= image.x &&
              otherImage.x + otherImage.width >= image.x + image.width)
          ) {
            if (otherImage.z < image.z) {
              imageNeighbors.imagesAbove.push(i);
              marginTop = Math.min(
                marginTop,
                image.z - otherImage.z - otherImage.height
              );
            } else if (otherImage.z > image.z) {
              imageNeighbors.imagesBelow.push(i);
              marginBottom = Math.min(
                marginBottom,
                otherImage.z - image.z - image.height
              );
            }
          }
        }
        if (imageNeighbors.imagesBelow.length == 0) {
          image.z = frame.height - image.height;
        } else {
          image.z = Math.floor(image.z - 0.5 * marginTop + 0.5 * marginBottom);
        }
      }
      maxHeight = Math.max(
        maxHeight,
        imageNeighbors.imagesAbove.length +
          imageNeighbors.imagesBelow.length +
          1
      );
      if (
        imageNeighbors.imagesAbove.length > 0 &&
        imageNeighbors.imagesBelow.length > 0
      ) {
        imageNeighborsList.push(imageNeighbors);
      }
    }
    // As a second step, we loop on the margin correction
    if (maxHeight > 2) {
      for (let j = 0; j < maxHeight - 2; j++) {
        for (let imageNeighbors of imageNeighborsList) {
          let image = images[imageNeighbors.indice];
          let marginTop = image.z;
          let marginBottom = frame.height - image.z - image.height;
          for (let iOtherImage of imageNeighbors.imagesAbove) {
            let otherImage = images[iOtherImage];
            marginTop = Math.min(
              marginTop,
              image.z - otherImage.z - otherImage.height
            );
          }
          for (let iOtherImage of imageNeighbors.imagesBelow) {
            let otherImage = images[iOtherImage];
            marginBottom = Math.min(
              marginBottom,
              otherImage.z - image.z - image.height
            );
          }
          image.z = Math.floor(image.z - 0.5 * marginTop + 0.5 * marginBottom);
        }
      }
    }
  }
}
