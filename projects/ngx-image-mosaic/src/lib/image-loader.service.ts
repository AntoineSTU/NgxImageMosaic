import { Injectable } from '@angular/core';
import { ImageParameters } from './interfaces/internal-objects.interface';
import { InputImageParameters } from './interfaces/input-parameters.interface';

@Injectable({
  providedIn: 'root',
})
export class ImageLoaderService {
  constructor() {}

  /** To load the images and get their width and height */
  async loadImages(
    inputImageParametersList: InputImageParameters[],
    imageMargin: number,
    imageArea: number,
    augmentationFactor: number
  ): Promise<ImageParameters[]> {
    let promises = [];
    for (let inputImageParameters of inputImageParametersList) {
      this.formatInputImageParameters(inputImageParameters);
      let newPromise: Promise<ImageParameters> = new Promise((resolve) => {
        let image = new Image();
        image.onload = () => {
          let imageParameters = {
            path: inputImageParameters.path,
            optionalParameters: inputImageParameters.optionalParameters!,
            height: image.height,
            width: image.width,
          };
          resolve(
            this.addMargin(
              this.resize(imageParameters, imageArea, augmentationFactor),
              imageMargin
            )
          );
        };
        image.onerror = (error) => {
          throw `[ngx-image-mosaic] There is a problem with an image path : ${inputImageParameters.path}`;
        };
        image.src = inputImageParameters.path;
      });
      promises.push(newPromise);
    }
    return Promise.all(promises);
  }

  /** To format input image parameters */
  private formatInputImageParameters(
    inputImageParameters: InputImageParameters
  ): void {
    if (inputImageParameters.optionalParameters != null) {
      if (inputImageParameters.optionalParameters.textHover == null) {
        inputImageParameters.optionalParameters.textHover = '';
      }
    } else {
      inputImageParameters.optionalParameters = {
        textHover: '',
      };
    }
  }

  /** Resize big images */
  private resize(
    image: ImageParameters,
    imageArea: number,
    augmentationFactor: number
  ): ImageParameters {
    let sizeFactor = 1 + augmentationFactor;
    if (imageArea > 0) {
      sizeFactor = Math.max(
        sizeFactor,
        Math.sqrt((image.width * image.height) / imageArea)
      );
    }
    return {
      path: image.path,
      optionalParameters: image.optionalParameters,
      height: Math.floor(image.height / sizeFactor),
      width: Math.floor(image.width / sizeFactor),
    };
  }

  /** Add a margin to an image */
  private addMargin(
    image: ImageParameters,
    imageMargin: number
  ): ImageParameters {
    return {
      path: image.path,
      optionalParameters: image.optionalParameters,
      height: image.height + 2 * imageMargin,
      width: image.width + 2 * imageMargin,
    };
  }
}
