import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  ImagePosition,
  ImageParameters,
} from './interfaces/internal-objects.interface';
import { ImageHTMLParameters } from './interfaces/image-html-parameters.interface';
import { Frame } from './interfaces/frame.interface';
import {
  ImageMosaicParameters,
  InputImageParameters,
} from './interfaces/input-parameters.interface';
import { ImageLoaderService } from './image-loader.service';
import { GalleryGeneratorService } from './gallery-generator.service';

@Component({
  selector: 'ngx-image-mosaic',
  templateUrl: './ngx-image-mosaic.component.html',
  styleUrls: ['./ngx-image-mosaic.component.scss'],
})
export class NgxImageMosaicComponent implements OnInit {
  @Input()
  frame: Frame;
  @Input()
  inputImageParametersList: InputImageParameters[];
  @Input()
  options: ImageMosaicParameters = {};

  @Output()
  imageSelected = new EventEmitter<string>();

  imageMargin: number;
  fillingDirection: 'vertically' | 'horizontally';
  imageArea: number;
  reductionFactor: number;
  augmentationFactor: number;
  reduceLength: boolean;
  showDescriptionHover: boolean;

  imageParameters: ImageHTMLParameters[];

  constructor(
    private galleryGeneratorService: GalleryGeneratorService,
    private imageLoaderService: ImageLoaderService
  ) {}

  ngOnInit(): void {
    this.formatInputOptions();
    this.imageLoaderService
      .loadImages(
        this.inputImageParametersList,
        this.imageMargin,
        this.imageArea,
        this.augmentationFactor
      )
      .then((imageParametersList: ImageParameters[]) => {
        let result = this.galleryGeneratorService.generateDisplay(
          imageParametersList,
          this.frame,
          this.fillingDirection,
          this.reductionFactor,
          this.augmentationFactor,
          this.reduceLength
        );
        this.frame = result.frame;
        this.imageParameters = result.imagePositions.map(
          this.formatImageStyle()
        );
      });
  }

  /** To get all options */
  private formatInputOptions(): void {
    let options = this.options;
    if (options.imageMargin == null || options.imageMargin < 0) {
      this.imageMargin = 0;
    } else {
      this.imageMargin = Math.floor(options.imageMargin);
    }
    if (options.fillingDirection == null) {
      this.fillingDirection = 'horizontally';
    } else {
      this.fillingDirection = options.fillingDirection;
    }
    if (options.imageArea == null || options.imageArea < 0) {
      this.imageArea = 0;
    } else {
      this.imageArea = Math.floor(options.imageArea);
    }
    if (
      options.reductionFactor == null ||
      options.reductionFactor < 0 ||
      options.reductionFactor >= 1
    ) {
      this.reductionFactor = 0.4;
    } else {
      this.reductionFactor = options.reductionFactor;
    }
    if (options.augmentationFactor == null || options.augmentationFactor < 0) {
      this.augmentationFactor = 0.4;
    } else {
      this.augmentationFactor = options.augmentationFactor;
    }
    if (options.reduceLength == null) {
      this.reduceLength = false;
    } else {
      this.reduceLength = options.reduceLength;
    }
    if (options.showDescriptionHover == null) {
      this.showDescriptionHover = false;
    } else {
      this.showDescriptionHover = options.showDescriptionHover;
    }
  }

  /** Returns the style to put on an image (its position and its width) */
  private formatImageStyle() {
    let margin = this.imageMargin;
    return (imagePosition: ImagePosition): ImageHTMLParameters => {
      return {
        path: imagePosition.path,
        imageDescription: imagePosition.optionalParameters.textHover!,
        subContainerStyle: {
          top: imagePosition.z + margin + 'px',
          left: imagePosition.x + margin + 'px',
          width: imagePosition.width - 2 * margin + 'px',
          height: imagePosition.height - 2 * margin + 'px',
        },
      };
    };
  }
}
