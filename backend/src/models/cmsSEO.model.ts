import mongoose, { Document, Schema } from 'mongoose';

export type CMSSEOPageKey =
  | 'home'
  | 'destination'
  | 'package'
  | 'agency'
  | 'car-rental'
  | 'about'
  | 'privacy'
  | 'terms'
  | 'contact';

export interface ICMSEO extends Document {
  pageKey: CMSSEOPageKey;
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  robots?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CMSSEOSchema = new Schema<ICMSEO>(
  {
    pageKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
      enum: [
        'home',
        'destination',
        'package',
        'agency',
        'car-rental',
        'about',
        'privacy',
        'terms',
        'contact',
      ],
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    keywords: { type: [String], default: [] },
    canonicalUrl: { type: String, trim: true },
    ogTitle: { type: String, trim: true },
    ogDescription: { type: String, trim: true },
    ogImage: { type: String, trim: true },
    twitterCard: { type: String, default: 'summary_large_image' },
    robots: { type: String, default: 'index, follow' },
    updatedBy: { type: String, default: 'Super Admin' },
  },
  { timestamps: true }
);

export const CMSSEOModel =
  mongoose.models.CMSSEO ||
  mongoose.model<ICMSEO>('CMSSEO', CMSSEOSchema, 'seo_settings');
