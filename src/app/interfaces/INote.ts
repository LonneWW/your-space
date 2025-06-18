export interface Note {
  id: number;
  patient_id: number;
  title: string;
  content: JSON | string;
  tags: JSON | string;
  date: number;
  shared?: number | boolean;
  therapist_id?: number | null | string | undefined;
}
