import { faker } from '@faker-js/faker';
import { Article, categorySchema, languageSchema } from 'core';
import { nanoid } from 'nanoid';

function generateFakeItem() {
  return {
    id: nanoid(),
    title: faker.lorem.sentence(),
    author: faker.company.name(),
    description: faker.lorem.paragraph(),
    publishedAt: faker.date.between(
      '2020-01-01T00:00:00.000Z',
      '2023-01-01T00:00:00.000Z',
    ),
    category: faker.helpers.arrayElement(categorySchema._def.values),
    language: faker.helpers.arrayElement(languageSchema._def.values),
    source: faker.company.name(),
    URL: faker.internet.url(),
  };
}

export function generateFakeItems(count = 10) {
  return new Set<Article>(Array.from({ length: count }, generateFakeItem));
}
