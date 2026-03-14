"use client";

import React, { useRef, useState } from "react";
import { Button, Checkbox, Form, Input, Select, SelectProps, Space } from "antd";
// import { Resume } from "@/types/Resume";
// import { Schedule } from "@/types/Schedule";
// import { getCurrentUser } from "@/actions/user-actions";
// import { Currency } from "@/types/Currency";
// import { Employment.ts } from "@/types/Employment.ts";
// import { getVacanciesForResumeNumber } from "@/actions/vacancy-actions";
// import { SearchFormData } from "@/types/Search";
import { useRouter } from "next/navigation";
import { Currency } from "@/types/Currency";
import { Schedule } from "@/types/Schedule";
import { Employment } from "@/types/Employment";
// import { createSearch } from "@/actions/search-actions";

const { Option } = Select;
const { TextArea } = Input;

type OptionType = SelectProps["options"];

type CreateSearchFormProps = {
  // resumes: Resume[];
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
};

export const CreateSearchForm = ({
                                   // resumes,
                                   currencies,
                                   schedules,
                                   employment,
                                   experiences,
                                   areas,
                                 }: CreateSearchFormProps) => {
// export const CreateSearchForm = ({}) => {
  const [form] = Form.useForm();
  const [userId, setUserId] = useState<null | number>(null);
  // const allFormValues: SearchFormData = Form.useWatch(undefined, form);
  const [countVacancies, setCountVacancies] = useState<null | number>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const coverLetterLength = 1000;

  // Обработчик отправки формы
  // const onFinish = (values: SearchFormData) => {
  //   const area = values.area;
  //   const formData = {
  //     ...values,
  //     salary: Number(values.salary),
  //     area: area ? area.map(Number) : [],
  //   };
  //   if (userId) {
  //     const data = { ...formData, userId, countVacancies: countVacancies || 0 };
  //     console.log("formData", data);
  //     createSearch(data).then((res) => {
  //       if (res.id) {
  //         router.push("/dashboard/search");
  //       }
  //     });
  //   }
  //
  //   // Здесь можно добавить логику обработки данных
  //   // Например, отправку на сервер
  // };

  // Обработчик сброса формы
  const onReset = () => {
    form.resetFields();
  };

  const handleChange = (value: string[]) => {
    console.log(`selected ${value}`);
  };

  const filterOptionRegions: SelectProps["filterOption"] = (
    input,
    option,
  ): boolean => {
    if (!option || typeof option !== "object" || !("label" in option))
      return false;

    const labelString = String(option.label);
    return labelString.toLowerCase().includes(input.toLowerCase());
  };

  // useEffect(() => {
  //   getCurrentUser().then((res) => {
  //     if (res?.userInfo?.id) {
  //       console.log("res", res);
  //       setUserId(Number(res?.userInfo.id));
  //     }
  //   });
  // }, []);

  // useEffect(() => {
  //   if (debounceTimer.current) {
  //     clearTimeout(debounceTimer.current);
  //   }
  //
  //   debounceTimer.current = setTimeout(() => {
  //     if (allFormValues?.resumeId) {
  //       getVacanciesForResumeNumber(allFormValues).then((res) => {
  //         if (res.data || res.data === 0) {
  //           setCountVacancies(res.data);
  //         }
  //       });
  //     }
  //   }, 500);
  // }, [allFormValues]);

  return (
    <Form
      form={form}
      layout="vertical"
      // onFinish={onFinish}
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

      {/*<Form.Item*/}
      {/*  label="Резюме"*/}
      {/*  name="resumeId"*/}
      {/*  rules={[{ required: true, message: "Пожалуйста, выберите опцию!" }]}*/}
      {/*  className="font-bold"*/}
      {/*>*/}
      {/*  <Select*/}
      {/*    placeholder="Выберите резюме"*/}
      {/*    className="font-normal"*/}
      {/*    allowClear*/}
      {/*  >*/}
      {/*    /!*{resumes.map((resume) => (*!/*/}
      {/*    /!*  <Option key={resume.id} value={resume.id} className="!z-10">*!/*/}
      {/*    /!*    <div className="flex !flex items-center justify-between">*!/*/}
      {/*    /!*      <div className="flex gap-1 items-center">*!/*/}
      {/*    /!*        <File size={16} />*!/*/}
      {/*    /!*        <span>{resume.title}</span>*!/*/}
      {/*    /!*      </div>*!/*/}
      {/*    /!*      <a*!/*/}
      {/*    /!*        href={resume.alternate_url}*!/*/}
      {/*    /!*        className="!z-20"*!/*/}
      {/*    /!*        onClick={(event) => event.stopPropagation()}*!/*/}
      {/*    /!*        target="_blank"*!/*/}
      {/*    /!*      >*!/*/}
      {/*    /!*        <ExternalLink className="text-primary-400" size={16} />*!/*/}
      {/*    /!*      </a>*!/*/}
      {/*    /!*    </div>*!/*/}
      {/*    /!*  </Option>*!/*/}
      {/*    /!*))}*!/*/}
      {/*  </Select>*/}
      {/*</Form.Item>*/}

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

      {/*<Form.Item label="Исключить компании" name="excludedCompanies">*/}
      {/*<Select*/}
      {/*  mode="multiple"*/}
      {/*  disabled*/}
      {/*  style={{ width: "100%" }}*/}
      {/*  placeholder="Please select"*/}
      {/*  defaultValue={["Компания 1", "Компания 1"]}*/}
      {/*  onChange={handleChange}*/}
      {/*  // options={options}*/}
      {/*/>*/}
      {/*</Form.Item>*/}

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

      {/*Группа чекбоксов */}

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
          <Button type="primary" htmlType="submit">
            Создать
          </Button>
          <Button htmlType="button" onClick={onReset}>
            Сбросить
          </Button>
          {(countVacancies || countVacancies === 0) && (
            <div>Найдено {countVacancies} вакансий</div>
          )}
        </Space>
      </Form.Item>
    </Form>
  );
};
