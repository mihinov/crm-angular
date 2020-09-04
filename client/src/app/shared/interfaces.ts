export interface User {
  email: string;
  password: string;
}

export interface Category {
  name: string;
  imgSrc?: string;
  user?: string;
  _id?: string;
}
