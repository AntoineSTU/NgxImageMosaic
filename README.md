# NgxImageMosaic

This library provides a mosaic view of a set of images, with shaping options.

![preview](https://github.com/AntoineSTU/NgxImageMosaic/blob/master/src/assets/preview/preview.png?raw=true)

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.7.

## Examples/Demo

A simple example of this library can be found in the `src/app` directory of this respository. You can run it by:

1. Cloning the repository;
2. Installing the dependencies running `npm install`;
3. Running `ng serve` on Angular 9;
4. Navigating to `localhost:4200`.

## Installation

Install the package

```bash
npm install ngx-image-mosaic
```

## Usage

You must first import the ngx-image-mosaic module.

```ts
import { NgxImageMosaicModule } from 'ngx-image-mosaic';

@NgModule({
  ...,
  imports: [
    NgxImageMosaicModule,
    ...]
})
```

Then, you can create objects that you will use to configure your component, using interfaces provided by the library

```ts
import {
  Frame,
  ImageMosaicParameters,
  InputImageParameters,
} from 'ngx-image-mosaic';

@Component({
  ...
})
export class MyComponent {
  frame: Frame = { height: ..., width: ... };
  inputImageParametersList: InputImageParameters[] = ...;
  options: ImageMosaicParameters = ...;

  ...

  imageSelected(path: string) {
    ...
  }
}

```

and finally add the ngx-image-gallery component in your html file.

```html
<ngx-image-mosaic
  [frame]="frame"
  [inputImageParametersList]="inputImageParametersList"
  [options]="options"
  (imageSelected)="imageSelected($event)"
></ngx-image-mosaic>
```

## API

Description of _ngx-image-mosaic_ component.

```html
<ngx-image-mosaic
  [frame]="frame"
  [inputImageParametersList]="inputImageParametersList"
  [options]="options"
  (imageSelected)="imageSelected($event)"
></ngx-image-mosaic>
```

### @Inputs()

There are 3 inputs, depending on 3 interfaces :

- **frame**: Frame **_[required]_**

  Shape of the component.

  ```ts
  interface Frame = {
    height: number;
    width: number;
  }
  ```

  | Key    | Type             | Required | Description                                      |
  | ------ | ---------------- | -------- | ------------------------------------------------ |
  | height | positive integer | **Yes**  | Number of pixels for the height of the component |
  | width  | positive integer | **Yes**  | Number of pixels for the width of the component  |

  _Example:_

  ```ts
  let frame = { width: 40, height: 30 };
  ```

- **inputImageParametersList**: InputImageParameters[] **_[required]_**

  Images with their own parameters.

  ```ts
  interface OptionalInputImageParameters {
    textHover?: string;
  }

  interface InputImageParameters {
    path: string;
    optionalParameters?: OptionalInputImageParameters;
  }
  ```

  | Key                | Type                         | Required                           | Description                                                                                    |
  | ------------------ | ---------------------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------- |
  | path               | string                       | **Yes**                            | Path of the image (in angular project or on the web)                                           |
  | optionalParameters | OptionalInputImageParameters | Optional, default: {textHover: ""} | Gather all optional parameters about this image                                                |
  | textHover          | string                       | Optional, default: ""              | Text to show when a pointer is over the image (this option must be enabled in general options) |

  _Example:_

  ```ts
  let inputImageParametersList = [
    {
      path: "gallery.org/image1",
      optionalParameters: {
        textHover: "This is image 1!",
      },
    },
    {
      path: "assets/image2",
    },
  ];
  ```

- **options**: ImageMosaicParameters _[not required]_

  Global options for the component.

  ```ts
  interface ImageMosaicParameters {
    imageMargin?: number;
    fillingDirection?: "vertically" | "horizontally";
    imageArea?: number;
    reductionFactor?: number;
    augmentationFactor?: number;
    reduceLength?: boolean;
    showDescriptionHover?: boolean;
  }
  ```

  | Key                  | Type                           | Required                          | Description                                                                                                                                                                                            |
  | -------------------- | ------------------------------ | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
  | imageMargin          | positive integer               | Optional, default: 0              | Margin in pixels for all images                                                                                                                                                                        |
  | fillingDirection     | "vertically" or "horizontally" | Optional, default: "horizontally" | In 'horizontally' mode, the mosaic is constructed row by row; in 'vertically' mode, the mosaic is constructed column by column                                                                         |
  | imageArea            | positive integer               | Optional, default: 0              | Standard area for images in px\*px (if they are big enough, they are reduced to match this area while keeping their aspect ration). If 0 is given, images will keep their orginal shape                |
  | reductionFactor      | integer between 0 and 1        | Optional, default: 0.4            | The algorithm can reduce each image to produce a better looking mosaic, by multiplying its height and its width by this reductionFactor                                                                |
  | augmentationFactor   | positive integer               | Optional, default: 0.4            | The algorithm can enlarge each image to produce a better looking mosaic, by multiplying its height and its width by (1 + augmentationFactor)                                                           |
  | reduceLength         | boolean                        | Optional, default: false          | The width (resp. height) of the component is reduced in horizontal (resp. vertical) mode if there is some place left. This option let you put all your images in a component with an appropriate shape |
  | showDescriptionHover | boolean                        | Optional, default: false          | If true, shows a text on a photo when a pointer is above it (see textHover in image options)                                                                                                           |

  _Example:_

  ```ts
  let options = {
    imageMargin: 5,
    fillingDirection: "horizontally",
    imageArea: 10000,
    reductionFactor: 0,
    augmentationFactor: 0.6,
    reduceLength: true,
    showDescriptionHover: false,
  };
  ```

### Output()

There is one output:

- **imageSelected**: EventEmitter\<string>

  When a photo is clicked, this output emits the path of the photo.

## Additional information

- This component enlarge images only if they are big enough (images displayed will always have a smaller shape than their real one).
- If an augmentation factor greater than 0 is provided, all images are resized to never be pixelated. So their heights and width are divided by _max(1 + augmentationFactor, areaFactor)_, where _areaFactor = max(1, photoArea/imageArea)_ is linked to the imageArea option (see general options input).
- The time complexity of this algorithm is O(n\*n) as long as the height (resp. the width) of the frame isn't to big in comparison with its width (resp. its height) in horizontal (resp. vertical) mode.

## Copyrights

Integrate or build upon it for free in your personal or commercial projects. Don't republish, redistribute or sell "as-is". You can contact me at `stutz.antoine@orange.fr`.
