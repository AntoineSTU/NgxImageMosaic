import { TestBed } from '@angular/core/testing';
import { ImageLoaderService } from './image-loader.service';

import { images, correspondingShapes } from './test-data';

describe('ImageLoaderService', () => {
  let service: ImageLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get images with their shape', (done) => {
    service.loadImages(images, 0, 0, 0).then((imageParametersList) => {
      expect(imageParametersList.length).toBe(
        Object.keys(correspondingShapes).length
      );
      for (let imageParameters of imageParametersList) {
        let realShape = correspondingShapes[imageParameters.path];
        expect(imageParameters.height).toBe(realShape.height);
        expect(imageParameters.width).toBe(realShape.width);
      }
      done();
    });
  });

  it('should get images with their shape considering a margin and an augmentation factor', (done) => {
    service.loadImages(images, 5, 0, 0.5).then((imageParametersList) => {
      expect(imageParametersList.length).toBe(
        Object.keys(correspondingShapes).length
      );
      for (let imageParameters of imageParametersList) {
        let realShape = correspondingShapes[imageParameters.path];
        let realWidth = Math.floor(realShape.width / 1.5 + 2 * 5);
        let realHeight = Math.floor(realShape.height / 1.5 + 2 * 5);
        expect(imageParameters.height).toBe(realHeight);
        expect(imageParameters.width).toBe(realWidth);
      }
      done();
    });
  });

  it('should get images with their shape considering a default area', (done) => {
    service.loadImages(images, 0, 25000, 0).then((imageParametersList) => {
      expect(imageParametersList.length).toBe(
        Object.keys(correspondingShapes).length
      );
      for (let imageParameters of imageParametersList) {
        let realShape = correspondingShapes[imageParameters.path];
        let realArea = realShape.width * realShape.height;
        let realSizeFactor = realArea < 25000 ? 1 : Math.sqrt(realArea / 25000);
        expect(imageParameters.height).toBe(
          Math.floor(realShape.height / realSizeFactor)
        );
        expect(imageParameters.width).toBe(
          Math.floor(realShape.width / realSizeFactor)
        );
      }
      done();
    });
  });
});
