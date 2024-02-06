export interface UserInfo {
  _id: string;
  name: string;
  meals: {
    choices: {
      breakfast: number;
      lunch: number;
      dinner: number;
    };
    date: string;
  }[];
}

export interface MealsApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    _id: string;
    name: string;
    users: UserInfo[];
  };
}
