import { createClient } from 'datocms-client';

const client = createClient({
  apiToken: process.env.DATOCMS_API_TOKEN,
});

export async function getHomePageContent() {
  const data = await client.items.all({
    filter: {
      type: 'home_page',
    },
  });

  return data[0];
}

export async function getKpiContent() {
  const data = await client.items.all({
    filter: {
      type: 'kpi_section',
    },
  });

  return data;
}

export async function getChallengeContent() {
  const data = await client.items.all({
    filter: {
      type: 'challenge_section',
    },
  });

  return data[0];
}

export async function getBenefitsContent() {
  const data = await client.items.all({
    filter: {
      type: 'benefits_section',
    },
  });

  return data[0];
} 