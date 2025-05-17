export interface EducationCard {
  tag: string;
  title: string;
  type: EducationCardType;
  url: string;
}

export enum EducationCardType {
  TYPE_1 = '/img/common/people-1.svg',
  TYPE_2 = '/img/common/people-2.svg',
  TYPE_3 = '/img/common/people-3.svg',
  TYPE_4 = '/img/common/people-4.svg',
  TYPE_5 = '/img/common/people-5.svg'
}
