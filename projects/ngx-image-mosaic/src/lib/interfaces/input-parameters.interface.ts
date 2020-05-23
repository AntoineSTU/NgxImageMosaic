export interface OptionalInputImageParameters {
  textHover?: string; // Text shown when pointer on the photo
}

export interface InputImageParameters {
  path: string; // Path of the photo
  optionalParameters?: OptionalInputImageParameters; // Other parameters that aren't required
}

export interface ImageMosaicParameters {
  imageMargin?: number; // Margin for the photos in pixels
  fillingDirection?: 'vertically' | 'horizontally'; // If the frame is filled row by row (vertically) or column by column (horizontally)
  imageArea?: number; // Standard area in pixels for images (they are resized if they are big enough)
  reductionFactor?: number; // Possibility to reduce photo area to let them fit in small places
  augmentationFactor?: number; // Possibility to extand the photos to have a better looking mosaic
  reduceLength?: boolean; // To reduce the length of the frame if it's too big
  showDescriptionHover?: boolean; // To show messages when pointer on a photo
}
