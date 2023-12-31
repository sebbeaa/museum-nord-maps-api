"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productionClient = exports.previewClient = void 0;
// sanity.js
const client_1 = require("@sanity/client");
const dotenv = __importStar(require("dotenv"));
process.env.NODE_ENV !== 'production' && dotenv.config();
// Import using ESM URL imports in environments that supports it:
// import {createClient} from 'https://esm.sh/@sanity/client'
exports.previewClient = (0, client_1.createClient)({
    projectId: 's0874vj3',
    dataset: 'production',
    useCdn: false,
    perspective: 'previewDrafts',
    ignoreBrowserTokenWarning: true,
    token: process.env.SANITY_SECRET_TOKEN,
    apiVersion: '2021-03-25',
});
exports.productionClient = (0, client_1.createClient)({
    projectId: 's0874vj3',
    dataset: 'production',
    useCdn: true,
    perspective: 'published',
    ignoreBrowserTokenWarning: true,
    apiVersion: '2021-03-25',
});
