export type User = {
  _id: string;
  username: string;
  password: string;
  preferences: {
    currency: string; //change to currency type
  };
};
