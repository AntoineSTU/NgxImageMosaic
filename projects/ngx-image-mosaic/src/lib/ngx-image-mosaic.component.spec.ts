import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { NgxImageMosaicComponent } from './ngx-image-mosaic.component';
import { GalleryGeneratorService } from './gallery-generator.service';
import { ImageLoaderService } from './image-loader.service';
import { images, imageParametersList, imagePositionList } from './test-data';
import { DebugElement } from '@angular/core';

let frame = { height: 350, width: 2000 };
let galleryGeneratorServiceStub: Partial<GalleryGeneratorService>;
galleryGeneratorServiceStub = {
  generateDisplay: (
    images,
    frame1,
    fillingDirection,
    possibleReduction,
    possibleAugmentation,
    reduceLength
  ) => {
    return { frame: frame, imagePositions: imagePositionList.slice(0) };
  },
};
let imageLoaderServiceStub: Partial<ImageLoaderService>;
imageLoaderServiceStub = {
  loadImages: (
    inputImageParametersList,
    imageMargin,
    imageArea,
    augmentationFactor
  ) => new Promise((resolve, reject) => resolve(imageParametersList.slice(0))),
};

describe('NgxImageMosaicComponent', () => {
  let component: NgxImageMosaicComponent;
  let fixture: ComponentFixture<NgxImageMosaicComponent>;

  let containerDe: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NgxImageMosaicComponent],
      providers: [
        {
          provide: GalleryGeneratorService,
          useValue: galleryGeneratorServiceStub,
        },
        { provide: ImageLoaderService, useValue: imageLoaderServiceStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxImageMosaicComponent);
    component = fixture.componentInstance;

    containerDe = fixture.debugElement.query(By.css('.container'));

    component.frame = { width: 300, height: 450 };
    component.inputImageParametersList = images;
    component.options = {};
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should send images on click', (done) => {
    let imagePath: string;
    component.imageSelected.subscribe(
      (selectedImagePath) => (imagePath = selectedImagePath)
    );
    component.ngOnInit();
    setTimeout(() => {
      fixture.detectChanges();
      let iChildSelected = Math.floor(Math.random() * images.length);
      containerDe.children[iChildSelected].triggerEventHandler('click', null);
      expect(imagePath).toBe(component.imageParameters[iChildSelected].path);
      done();
    }, 100);
  });
});
