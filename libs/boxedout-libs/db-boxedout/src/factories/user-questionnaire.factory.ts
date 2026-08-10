// @ts-nocheck
/* istanbul ignore file */

import Faker from 'faker';
import { UserQuestionnaire } from '../entities/user-questionnaire.entity';
import { define } from 'typeorm-seeding';

const dataExamples = [
  '{"purpose":"trading_other","source_of_funds":"income"}',
  '{"purpose":"payments","source_of_funds":"income"}',
  '{"purpose":"trading_other","source_of_funds":"savings"}',
  '{"purpose":"trading_other","source_of_funds":"investment"}',
  '{"purpose":"trading","source_of_funds":"gift"}',
  '{"purpose":"other","source_of_funds":"investment"}',
];

export const userQuestionnaireFactory = (faker: typeof Faker) => {
  const data = new UserQuestionnaire();
  data.guid = faker.datatype.uuid();
  data.timestamp = faker.date.past(3);
  data.status = 'verified';
  data.data = faker.random.arrayElement(dataExamples);

  return data;
};

define(UserQuestionnaire, userQuestionnaireFactory);
