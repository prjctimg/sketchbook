export interface SketchMetadata {
  id: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  thumbnail: string;
  technicalDetails: {
    rendering: string;
    dependencies: string[];
  };
  gistUrl?: string;
  code?: string;
  cdnUrls?: string[];
}
