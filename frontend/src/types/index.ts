export interface IUser {
  id?: number;
  email: string;
  name: string;
  department?: string;
  role: 'employee' | 'manager' | 'admin';
}

export interface IAuthContext {
  user: IUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface IFeedback {
  id?: number;
  evaluator_id: number;
  evaluated_id: number;
  rating: number;
  comment?: string;
  is_anonymous: boolean;
  feedback_type: 'colleague' | 'manager';
}
