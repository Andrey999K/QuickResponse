"use client";

import React from "react";
import { CreateSearchForm } from "@/components/UI/CreateSearchForm";
import { areasMock } from "@/mock";

const mockCurrencies = [
  { "code": "AZN", "abbr": "₼", "name": "Манаты", "default": false, "rate": 0.0215, "in_use": false },
  { "code": "BYR", "abbr": "Br", "name": "Белорусские рубли", "default": false, "rate": 0.037007, "in_use": false },
  { "code": "EUR", "abbr": "€", "name": "Евро", "default": false, "rate": 0.010877, "in_use": true },
  { "code": "GEL", "abbr": "₾", "name": "Грузинский лари", "default": false, "rate": 0.034702, "in_use": false },
  { "code": "KGS", "abbr": "сом", "name": "Кыргызский сом", "default": false, "rate": 1.10601, "in_use": false },
  { "code": "KZT", "abbr": "₸", "name": "Тенге", "default": false, "rate": 6.21732, "in_use": false },
  { "code": "RUR", "abbr": "₽", "name": "Рубли", "default": true, "rate": 1, "in_use": true },
  { "code": "UAH", "abbr": "₴", "name": "Гривны", "default": false, "rate": 0.554745, "in_use": false },
  { "code": "USD", "abbr": "$", "name": "Доллары", "default": false, "rate": 0.012647, "in_use": true },
  { "code": "UZS", "abbr": "so'm", "name": "Узбекский сум", "default": false, "rate": 153.48511, "in_use": false },
];

const mockSchedule = [
  { "id": "fullDay", "name": "Полный день", "uid": "full_day" },
  { "id": "shift", "name": "Сменный график", "uid": "shift" },
  { "id": "flexible", "name": "Гибкий график", "uid": "flexible" },
  { "id": "remote", "name": "Удаленная работа", "uid": "remote" },
  { "id": "flyInFlyOut", "name": "Вахтовый метод", "uid": "fly_in_fly_out" },
];

const mockEmployment = [
  { "id": "FULL", "name": "Полная", "duration": "PERMANENT" },
  { "id": "PART", "name": "Частичная", "duration": "PERMANENT" },
  { "id": "PROJECT", "name": "Проект", "duration": "TEMPORARY" },
  { "id": "FLY_IN_FLY_OUT", "name": "Вахта", "duration": "PERMANENT" },
  { "id": "SIDE_JOB", "name": "Подработка", "duration": "TEMPORARY" },
];

const mockExperience = [
  { "id": "noExperience", "name": "Нет опыта" },
  { "id": "between1And3", "name": "От 1 года до 3 лет" },
  { "id": "between3And6", "name": "От 3 до 6 лет" },
  { "id": "moreThan6", "name": "Более 6 лет" },
];

export default function CreateSearchPage() {
  return (
    <div className="flex flex-col h-full max-w-full w-full">
      {/* Заголовок — фиксированный */}
      <div className="shrink-0">
        <h2 className="font-bold text-2xl text-gray-900 dark:text-white">
          Создание поиска
        </h2>
      </div>
      {/* Форма — прокручиваемая */}
      <div className="mt-6 flex flex-col gap-5 w-full max-w-full overflow-y-auto min-h-0 pb-4 scrollbar-hidden">
        <div className="max-w-3xl">
          <CreateSearchForm
            currencies={mockCurrencies}
            schedules={mockSchedule || []}
            employment={mockEmployment}
            experiences={mockExperience}
            areas={areasMock.data.map((area) => ({ label: area.name, value: area.id }))}
          />
        </div>
      </div>
    </div>
  );
}