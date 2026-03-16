"use client";

import React, { useState, useEffect } from "react";
import { Button, Checkbox, Form, Input, Select, SelectProps, Space, message } from "antd";
import { useRouter } from "next/navigation";
import { Currency } from "@/types/Currency";
import { Schedule } from "@/types/Schedule";
import { Employment } from "@/types/Employment";
import { apiClient } from "@/lib/api-client";
import { ISearch } from "@/types/Search";

const { TextArea } = Input;

type SearchFormProps = {
  currencies: Currency[];
  schedules: Schedule[];
  employment: Employment[];
  experiences: {
    id: string;
    name: string;
  }[];
  areas: {
    value: string;
    label: string;
  }[];
  mode: "create" | "edit";
  initialData?: ISearch;
  searchId?: number;
};

export const SearchForm = ({
  currencies,
  schedules,
  employment,
  experiences,
  areas,
  mode,
  initialData,
  searchId,
}: SearchFormProps) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const coverLetterLength = 1000;

  useEffect(() => {
    if (initialData && mode === "edit") {
      form.setFieldsValue({
        title: initialData.title,
        keywords: initialData.keywords,
        excludedText: initialData.excluded_text,
        salary: initialData.salary,
        currency: initialData.currency,
        onlyWithSalary: initialData.only_with_salary,
        area: initialData.area.map(String),
        schedule: initialData.schedule,
        employment: initialData.employment,
        experience: initialData.experience,
        coverLetter: initialData.cover_letter,
      });
    }
  }, [initialData, mode, form]);

  const filterOptionRegions: SelectProps["filterOption"] = (
    input,
    option,
  ): boolean => {
    if (!option || typeof option !== "object" || !("label" in option))
      return false;

    const labelString = String(option.label);
    return labelString.toLowerCase().includes(input.toLowerCase());
  };

  const onFinish = async (values: Record<string, unknown>) => {
    setIsLoading(true);

    try {
      const formData = {
        title: values.title as string,
        keywords: (values.keywords as string) || null,
        excluded_text: (values.excludedText as string) || null,
        salary: values.salary ? Number(values.salary) : null,
        currency: (values.currency as "RUR" | "USD" | "EUR") || "RUR",
        only_with_salary: Boolean(values.onlyWithSalary),
        area: (values.area as string[])?.map(Number) || [],
        schedule: (values.schedule as string[]) || [],
        employment: (values.employment as string[]) || [],
        experience: (values.experience as string[]) || [],
        cover_letter: (values.coverLetter as string) || null,
      };

      if (mode === "create") {
        await apiClient.post("/api/search", formData);
        message.success("Поиск успешно создан!");
        router.push("/dashboard/search");
      } else {
        if (!searchId) {
          message.error("Ошибка: не указан ID поиска");
          return;
        }
        await apiClient.patch(`/api/search/${searchId}`, formData);
        message.success("Поиск успешно обновлён!");
        router.push("/dashboard/search");
      }
    } catch (error) {
      message.error(mode === "create" ? "Ошибка при создании поиска" : "Ошибка при обновлении поиска");
      console.error("Search form error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      autoComplete="off"
      initialValues={{ currency: "RUR" }}
    >
      <Form.Item
        label="Название поиска"
        name="title"
        rules={[
          { required: true, message: "Пожалуйста, введите текст!" },
          { min: 2, message: "Минимум 2 символа!" },
        ]}
        className="font-bold"
      >
        <Input
          placeholder="Введите название поиска"
          allowClear
          className="font-normal"
        />
      </Form.Item>

      <Form.Item label="Ключевые слова" name="keywords" className="font-bold">
        <Input
          placeholder="Ключевые слова, через запятую"
          allowClear
          className="font-normal"
        />
      </Form.Item>

      <Form.Item
        label="Исключить слова"
        name="excludedText"
        className="font-bold"
      >
        <Input
          placeholder="Исключить слова, через запятую"
          allowClear
          className="font-normal"
        />
      </Form.Item>

      <div className="flex gap-3 items-center">
        <Form.Item
          label="Желаемая зарплата"
          name="salary"
          className="font-bold w-full"
        >
          <Input placeholder="От" allowClear className="font-normal" />
        </Form.Item>
        <Form.Item label=" " name="currency" className="w-full max-w-[170px]">
          <Select
            options={currencies.map((currency) => ({
              value: currency.code,
              label: currency.name,
            }))}
          />
        </Form.Item>
      </div>

      <Form.Item
        name="onlyWithSalary"
        valuePropName="checked"
        className="font-bold w-full"
      >
        <Checkbox>Скрыть вакансии без зарплаты</Checkbox>
      </Form.Item>

      <Form.Item
        label="Регионы поиска"
        name="area"
        className="font-bold"
        rootClassName="font-bold"
      >
        <Select
          mode="multiple"
          allowClear
          placeholder="Выберите регионы"
          options={areas}
          showSearch={true}
          filterOption={filterOptionRegions}
          optionFilterProp="label"
          className="font-normal"
        />
      </Form.Item>

      <div className="flex gap-3 w-full">
        <Form.Item
          label="График работы"
          name="schedule"
          className="font-bold w-full"
        >
          <Checkbox.Group className="font-normal">
            <Space direction="vertical">
              {schedules.map((schedule) => (
                <Checkbox key={schedule.id} value={schedule.id}>
                  {schedule.name}
                </Checkbox>
              ))}
            </Space>
          </Checkbox.Group>
        </Form.Item>
        <Form.Item
          label="Тип занятости"
          name="employment"
          className="font-bold w-full"
        >
          <Checkbox.Group className="font-normal">
            <Space direction="vertical">
              {employment.map((item) => (
                <Checkbox key={item.id} value={item.id}>
                  {item.name}
                </Checkbox>
              ))}
            </Space>
          </Checkbox.Group>
        </Form.Item>
        <Form.Item
          label="Опыт работы"
          name="experience"
          className="font-bold w-full"
        >
          <Checkbox.Group className="font-normal">
            <Space direction="vertical">
              {experiences.map((experience) => (
                <Checkbox key={experience.id} value={experience.id}>
                  {experience.name}
                </Checkbox>
              ))}
            </Space>
          </Checkbox.Group>
        </Form.Item>
      </div>

      <Form.Item
        label="Сопроводительное письмо"
        name="coverLetter"
        rules={[
          {
            max: coverLetterLength,
            message: `Максимум ${coverLetterLength} символов!`,
          },
        ]}
      >
        <TextArea
          placeholder="Введите текст сопроводительного письма"
          rows={4}
          showCount
          maxLength={coverLetterLength}
        />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            {mode === "create" ? "Создать" : "Сохранить"}
          </Button>
          <Button htmlType="button" onClick={onReset} disabled={isLoading}>
            Сбросить
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};
