export type User = {
  _id: string;
  username: string;
  password: string;
  preferences: UserPreferences;
};

export type UserPreferences = {
  currency: string; //change to currency type
  disabledCategories: string[];
};
