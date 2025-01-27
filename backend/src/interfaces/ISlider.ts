export interface ISlider {
  title: string;
  description?: string;
  image?: string;
  video?: string;
  isvisible: boolean;
  media?: {
    type: string;
    url: string;
  };
}
