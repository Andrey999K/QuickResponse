export interface ISearch {
  id: number;
  user_id: number;
  title: string;
  keywords: string | null;
  excluded_text: string | null;
  salary: number | null;
  currency: string;
  only_with_salary: boolean;
  area: number[];
  schedule: string[];
  employment: string[];
  experience: string[];
  cover_letter: string | null;
  count_vacancies: number;
  created_at: string;
  updated_at: string;
}