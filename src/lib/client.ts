// sanity.js
import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
process.env.NODE_ENV !== 'production' && dotenv.config();
// Import using ESM URL imports in environments that supports it:
// import {createClient} from 'https://esm.sh/@sanity/client'

export const previewClient = createClient({
  projectId: null,//from .env,
  dataset: 'production',
  useCdn: false,
  perspective: 'previewDrafts',
  ignoreBrowserTokenWarning: true,
  token: process.env.SANITY_SECRET_TOKEN, // Only if you want to update content with the client
  apiVersion: '2021-03-25',
});
export const productionClient = createClient({
  projectId: null, //from .env ,
  dataset: 'production',
  useCdn: true,
  perspective: 'published',
  ignoreBrowserTokenWarning: true,
  apiVersion: '2021-03-25',
});
