import { InputImageParameters } from './interfaces/input-parameters.interface';
import {
  ImageParameters,
  ImagePosition,
} from './interfaces/internal-objects.interface';

export let images: InputImageParameters[] = [
  {
    path: 'https://angular.io/assets/images/logos/angular/logo-nav@2x.png',
    optionalParameters: {
      textHover: 'Angular logo',
    },
  },
  {
    path:
      'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
    optionalParameters: {
      textHover: 'Google',
    },
  },
  {
    path:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Wikipedia-logo-v2-fr.svg/langfr-300px-Wikipedia-logo-v2-fr.svg.png',
    optionalParameters: {
      textHover: 'Wikipedia',
    },
  },
  {
    path: 'https://www.linux.org/images/logo.png',
    optionalParameters: {
      textHover: 'Linux',
    },
  },
  {
    path:
      'https://www.mozilla.org/media/protocol/img/logos/firefox/logo-md-high-res.fb586eabe387.png',
    optionalParameters: {
      textHover: 'Mozilla Firefox',
    },
  },
];

export let correspondingShapes = {
  'https://angular.io/assets/images/logos/angular/logo-nav@2x.png': {
    width: 269,
    height: 72,
  },
  'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png': {
    width: 544,
    height: 184,
  },
  'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Wikipedia-logo-v2-fr.svg/langfr-300px-Wikipedia-logo-v2-fr.svg.png': {
    width: 300,
    height: 344,
  },
  'https://www.linux.org/images/logo.png': {
    width: 350,
    height: 66,
  },
  'https://www.mozilla.org/media/protocol/img/logos/firefox/logo-md-high-res.fb586eabe387.png': {
    width: 192,
    height: 192,
  },
};

export interface EdgeInterface {
  topLeftPoint: {
    x: number;
    z: number;
  };
  bottomRightPoint: {
    x: number;
    z: number;
  };
}

export let imageParametersList: ImageParameters[] = [
  {
    path: 'https://angular.io/assets/images/logos/angular/logo-nav@2x.png',
    optionalParameters: {
      textHover: 'Angular logo',
    },
    height: 72,
    width: 269,
  },
  {
    path:
      'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
    optionalParameters: {
      textHover: 'Google',
    },
    height: 184,
    width: 544,
  },
  {
    path:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Wikipedia-logo-v2-fr.svg/langfr-300px-Wikipedia-logo-v2-fr.svg.png',
    optionalParameters: {
      textHover: 'Wikipedia',
    },
    height: 344,
    width: 300,
  },
  {
    path: 'https://www.linux.org/images/logo.png',
    optionalParameters: {
      textHover: 'Linux',
    },
    height: 66,
    width: 350,
  },
  {
    path:
      'https://www.mozilla.org/media/protocol/img/logos/firefox/logo-md-high-res.fb586eabe387.png',
    optionalParameters: {
      textHover: 'Mozilla Firefox',
    },
    height: 192,
    width: 192,
  },
];

export let imagePositionList: ImagePosition[] = [
  {
    path: 'https://angular.io/assets/images/logos/angular/logo-nav@2x.png',
    optionalParameters: {
      textHover: 'Angular logo',
    },
    z: 0,
    x: 0,
    height: 72,
    width: 269,
  },
  {
    path:
      'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
    optionalParameters: {
      textHover: 'Google',
    },
    z: 86,
    x: 0,
    height: 184,
    width: 544,
  },
  {
    path: 'https://www.linux.org/images/logo.png',
    optionalParameters: {
      textHover: 'Linux',
    },
    z: 284,
    x: 0,
    height: 66,
    width: 350,
  },
  {
    path:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Wikipedia-logo-v2-fr.svg/langfr-300px-Wikipedia-logo-v2-fr.svg.png',
    optionalParameters: {
      textHover: 'Wikipedia',
    },
    z: 0,
    x: 544,
    height: 350,
    width: 305,
  },
  {
    path:
      'https://www.mozilla.org/media/protocol/img/logos/firefox/logo-md-high-res.fb586eabe387.png',
    optionalParameters: {
      textHover: 'Mozilla Firefox',
    },
    z: 0,
    x: 849,
    height: 192,
    width: 192,
  },
];
