export interface ITabAbout {
  _id?: string;
  title: string;
  description: string;
}

export interface IAbout {
  _id: string;
  tabs: ITabAbout[];
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}
