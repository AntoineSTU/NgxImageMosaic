import { TestBed } from '@angular/core/testing';
import { EdgeInterface } from './test-data';
import { Frame } from './interfaces/frame.interface';
import {
  ImageParameters,
  ImagePosition,
} from './interfaces/internal-objects.interface';

import { GalleryGeneratorService } from './gallery-generator.service';

describe('GalleryGeneratorService', () => {
  let service: GalleryGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GalleryGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('images should be independant', () => {
    for (let i = 0; i < 20; i++) {
      let frame = generateFrame();
      let imageParametersList = generateImageParameters(
        Math.floor(Math.random() * 30) + 1
      );
      let result = service.generateDisplay(
        imageParametersList,
        frame,
        'horizontally',
        0.8 * Math.random() + 0.2,
        Math.random(),
        false
      );
      let imagePositionList = result.imagePositions;
      let generatedFrame = result.frame;
      expect(generatedFrame).toEqual(frame);
      expect(imagesSuperposed(imagePositionList)).toBeFalse();
    }
  });

  it('images should be on border', () => {
    for (let i = 0; i < 20; i++) {
      let frame = generateFrame();
      let imageParametersList = generateImageParameters(
        Math.floor(Math.random() * 30) + 1
      );
      let result = service.generateDisplay(
        imageParametersList,
        frame,
        'horizontally',
        0.8 * Math.random() + 0.2,
        Math.random(),
        false
      );
      let imagePositionList = result.imagePositions;
      let generatedFrame = result.frame;
      expect(generatedFrame).toEqual(frame);
      expect(imagesOnBorders(imagePositionList, frame.height)).toBeTrue();
    }
  });

  it('frame should have an adaptative length', () => {
    for (let i = 0; i < 10; i++) {
      let frame = generateFrame();
      let imageParametersList = generateImageParameters(
        Math.floor(Math.random() * 20 + 1)
      );
      let result = service.generateDisplay(
        imageParametersList,
        frame,
        'horizontally',
        0.8 * Math.random() + 0.2,
        Math.random(),
        true
      );
      let imagePositionList = result.imagePositions;
      let generatedFrame = result.frame;
      let maxWidth = 0;
      for (let imagePosition of imagePositionList) {
        maxWidth = Math.max(maxWidth, imagePosition.x + imagePosition.width);
      }
      expect(generatedFrame.width).toEqual(maxWidth);
    }
  });

  it('vertical frame should be the same than transposed horizontal frame', () => {
    for (let i = 0; i < 10; i++) {
      let frame = generateFrame();
      let transposedFrame = { width: frame.height, height: frame.width };
      let imageParametersList = generateImageParameters(
        Math.floor(Math.random() * 20 + 1)
      );
      let transposedImageParametersList = transposeImageParametersList(
        imageParametersList
      );
      let possibleReduction = 0.8 * Math.random() + 0.2;
      let possibleAugmentation = Math.random();
      let reduceLength = Math.random() >= 0.5;
      let verticalResult = service.generateDisplay(
        imageParametersList,
        frame,
        'vertically',
        possibleReduction,
        possibleAugmentation,
        reduceLength
      );
      let verticalImagePositionList = verticalResult.imagePositions;
      let verticalGeneratedFrame = verticalResult.frame;
      let horizontalResult = service.generateDisplay(
        transposedImageParametersList,
        transposedFrame,
        'horizontally',
        possibleReduction,
        possibleAugmentation,
        reduceLength
      );
      let transposedHorizontalImagePositionList = transposeImagePositionList(
        horizontalResult.imagePositions
      );
      let horizontalGeneratedFrame = horizontalResult.frame;
      let transposedHorizontalGeneratedFrame = {
        width: horizontalGeneratedFrame.height,
        height: horizontalGeneratedFrame.width,
      };
      expect(verticalGeneratedFrame).toEqual(
        transposedHorizontalGeneratedFrame
      );
      expect(verticalImagePositionList).toEqual(
        transposedHorizontalImagePositionList
      );
    }
  });
});

let generateImageParameters = function (n: number): ImageParameters[] {
  let imageParametersList: ImageParameters[] = [];
  for (let i = 1; i <= n; i++) {
    imageParametersList.push({
      path: `image ${i}`,
      height: 20 + Math.floor(Math.random() * 220),
      width: 20 + Math.floor(Math.random() * 300),
      optionalParameters: {
        textHover: '',
      },
    });
  }
  return imageParametersList;
};

/** To generate a frame */
let generateFrame = function (): Frame {
  return {
    height: Math.floor(250 + 200 * Math.random()),
    width: Math.floor(500 + 5000 * Math.random()),
  };
};

/** To generate the four edges of a photo */
let generateEdges = function (imagePosition: ImagePosition): EdgeInterface[] {
  return [
    {
      topLeftPoint: { x: imagePosition.x, z: imagePosition.z },
      bottomRightPoint: {
        x: imagePosition.x + imagePosition.width,
        z: imagePosition.z,
      },
    },
    {
      topLeftPoint: {
        x: imagePosition.x + imagePosition.width,
        z: imagePosition.z,
      },
      bottomRightPoint: {
        x: imagePosition.x + imagePosition.width,
        z: imagePosition.z + imagePosition.height,
      },
    },
    {
      topLeftPoint: {
        x: imagePosition.x,
        z: imagePosition.z,
      },
      bottomRightPoint: {
        x: imagePosition.x,
        z: imagePosition.z + imagePosition.height,
      },
    },
    {
      topLeftPoint: {
        x: imagePosition.x,
        z: imagePosition.z + imagePosition.height,
      },
      bottomRightPoint: {
        x: imagePosition.x + imagePosition.width,
        z: imagePosition.z + imagePosition.height,
      },
    },
  ];
};

/** To verify that no images are superposed */
let imagesSuperposed = function (imagePositionList: ImagePosition[]): boolean {
  for (let firstImage of imagePositionList) {
    for (let secondImage of imagePositionList) {
      if (firstImage.path != secondImage.path) {
        // For each edge of the second image, we look if it cross the first image
        let edges = generateEdges(secondImage);
        // For each edge of the second image, we look if it cross the first image
        for (let edge of edges) {
          if (
            edge.topLeftPoint.x < firstImage.x + firstImage.width &&
            edge.topLeftPoint.z < firstImage.z + firstImage.height &&
            edge.bottomRightPoint.x > firstImage.x &&
            edge.bottomRightPoint.z > firstImage.z
          ) {
            return true;
          }
        }
        // The only remaining case is if the whole first image is contained in the second image
        if (
          secondImage.x <= firstImage.x &&
          secondImage.z <= firstImage.z &&
          secondImage.x + secondImage.width >=
            firstImage.x + firstImage.width &&
          secondImage.z + secondImage.height >= firstImage.z + firstImage.height
        ) {
          return true;
        }
      }
    }
  }
  return false;
};

/** To see if photos are on top or bottom borders if they can */
let imagesOnBorders = function (
  imagePositionList: ImagePosition[],
  frameHeight: number
): boolean {
  for (let firstImage of imagePositionList) {
    let isImageAbove = false;
    let isImageBelow = false;
    for (let secondImage of imagePositionList) {
      if (
        firstImage.path != secondImage.path &&
        secondImage.x < firstImage.x + firstImage.width &&
        secondImage.x + secondImage.width > firstImage.x
      ) {
        // We have already tested if no images were superposed
        isImageAbove = isImageAbove || secondImage.z < firstImage.z;
        isImageBelow = isImageBelow || secondImage.z > firstImage.z;
      }
    }
    if (!isImageAbove) {
      if (firstImage.z > 0) {
        return false;
      }
    } else if (!isImageBelow) {
      if (firstImage.z + firstImage.height < frameHeight) {
        return false;
      }
    }
  }
  return true;
};

/** To transpose a list of image parameters */
let transposeImageParametersList = function (
  imageParametersList: ImageParameters[]
): ImageParameters[] {
  let transposedImageParametersList: ImageParameters[] = [];
  for (let imageParameters of imageParametersList) {
    transposedImageParametersList.push({
      path: imageParameters.path,
      height: imageParameters.width,
      width: imageParameters.height,
      optionalParameters: imageParameters.optionalParameters,
    });
  }
  return transposedImageParametersList;
};

/** To transpose a list of image positions */
let transposeImagePositionList = function (
  imagePositionList: ImagePosition[]
): ImagePosition[] {
  let transposedImagePositionList: ImagePosition[] = [];
  for (let imagePosition of imagePositionList) {
    transposedImagePositionList.push({
      path: imagePosition.path,
      height: imagePosition.width,
      width: imagePosition.height,
      x: imagePosition.z,
      z: imagePosition.x,
      optionalParameters: imagePosition.optionalParameters,
    });
  }
  return transposedImagePositionList;
};
