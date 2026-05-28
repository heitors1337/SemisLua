export interface IUser {
  id?: number;
  email: string;
  password?: string;
  name: string;
  department?: string;
  role: 'employee' | 'manager' | 'admin';
  created_at?: string;
  updated_at?: string;
}

export interface ISession {
  id?: number;
  user_id: number;
  token: string;
  expires_at: string;
  created_at?: string;
}

export interface IFeedback {
  id?: number;
  evaluator_id: number;
  evaluated_id: number;
  rating: number;
  comment?: string;
  is_anonymous: boolean;
  feedback_type: 'colleague' | 'manager';
  created_at?: string;
  updated_at?: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  token: string;
  user: Omit<IUser, 'password'>;
}

export interface IAuthRequest {
  user?: IUser;
}
