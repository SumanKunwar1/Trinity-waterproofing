export interface ICoreTab {
  _id: string;
  title: string;
  description: string;
  image: string;
}

export interface IAbout {
  _id: string;
  title: string;
  description: string;
  image: string;
  core: ICoreTab[];
  tabs: ICoreTab[];
  createdAt: Date;
  updatedAt: Date;
}

export default IAbout;
