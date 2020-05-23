import { Component } from '@angular/core';
import {
  Frame,
  ImageMosaicParameters,
  InputImageParameters,
} from 'ngx-image-mosaic';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  frame: Frame = { height: 500, width: 200 };

  inputImageParametersList: InputImageParameters[] = this.generateInputImageParameters();

  options: ImageMosaicParameters = {
    imageMargin: 2,
    fillingDirection: 'vertically',
    reductionFactor: 0.4,
    augmentationFactor: 0.4,
    imageArea: 5000,
    reduceLength: true,
    showDescriptionHover: true,
  };

  pathImageSelected: String = '';

  constructor() {}

  generateInputImageParameters(): InputImageParameters[] {
    let tab: InputImageParameters[] = [];
    for (let i = 0; i < 18; i++) {
      tab.push({
        path: `assets/images/personne${(i % 9) + 1}.png`,
        optionalParameters: {
          textHover: `Image ${i + 1}`,
        },
      });
    }
    return tab;
  }

  showPath(path: string): void {
    this.pathImageSelected = path;
  }
}
