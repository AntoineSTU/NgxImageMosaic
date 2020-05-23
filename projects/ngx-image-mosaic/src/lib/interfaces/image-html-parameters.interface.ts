export interface ImageHTMLParameters {
  path: string; // Photo path
  imageDescription: string; // Description of the photo (shown on hover)
  subContainerStyle: {
    // Style for the photo container
    top: string;
    left: string;
    width: string;
    height: string;
  };
}
