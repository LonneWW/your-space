export interface UserData {
  role: 'patient' | 'therapist';
  id: number;
  name: string;
  surname: string;
  therapist_id?: number | null | string | undefined;
}
