export type Search = {
  id: string;
  title: string;
  isActive: boolean;
  userId: string;
  countVacancies: number;
  resumeId: string;
  text: string;
  excludedText: string;
  excludedCompanies: string[];
  salary: number | null;
  onlyWithSalary: boolean;
  area: string[];
  schedule: string[];
  experience: string[];
  coverLetter: string;
  createdAt: string;
};