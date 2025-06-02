export interface IUserData {
  name: string;
  email: string;
  nativeLanguage: string;
  foreignLanguage: string;
  questionsInQuiz: number;
  questionsInQuizRepeat: number;
  avatar?: {
    name: string;
    path: string;
  };
  createdAt?: string | undefined;
}
