export interface IVacancy {
  id: number;
  search_id: number;
  hh_id: string;
  title: string;
  company: string | null;
  salary: number | null;
  currency: string;
  url: string;
  area: number | null;
  schedule: string | null;
  employment: string | null;
  experience: string | null;
  description: string | null;
  cover_letter: string | null;
  is_new: boolean;
  created_at: string;
}
