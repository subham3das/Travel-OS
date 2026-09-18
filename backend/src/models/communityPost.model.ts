import mongoose, { Document, Schema } from 'mongoose';

export type CommunityPostStatus = 'Published' | 'Pending' | 'Flagged' | 'Removed';
export type CommunityPostType = 'Story' | 'Photo' | 'Tip' | 'Question' | 'Announcement';

export interface ICommunityPost extends Document {
  postId: string;
  authorId?: mongoose.Types.ObjectId;
  authorName: string;
  authorAvatar?: string;
  authorRole: 'Traveler' | 'Verified Guide' | 'Agency Partner' | 'Super Admin';
  postType: CommunityPostType;
  title: string;
  content: string;
  destinationTag?: string;
  media: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  status: CommunityPostStatus;
  isPinned: boolean;
  isAnnouncement: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CommunityPostSchema = new Schema<ICommunityPost>(
  {
    postId: { type: String, required: true, unique: true, index: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    authorName: { type: String, required: true },
    authorAvatar: { type: String, default: '' },
    authorRole: {
      type: String,
      enum: ['Traveler', 'Verified Guide', 'Agency Partner', 'Super Admin'],
      default: 'Traveler',
    },
    postType: {
      type: String,
      enum: ['Story', 'Photo', 'Tip', 'Question', 'Announcement'],
      default: 'Story',
      index: true,
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
    destinationTag: { type: String, default: 'India' },
    media: [{ type: String }],
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    sharesCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['Published', 'Pending', 'Flagged', 'Removed'],
      default: 'Published',
      index: true,
    },
    isPinned: { type: Boolean, default: false },
    isAnnouncement: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

CommunityPostSchema.index({ createdAt: -1 });
CommunityPostSchema.index({ status: 1, postType: 1 });
CommunityPostSchema.index({ authorId: 1, isDeleted: 1 });

export const CommunityPostModel =
  mongoose.models.CommunityPost ||
  mongoose.model<ICommunityPost>('CommunityPost', CommunityPostSchema, 'community_posts');

