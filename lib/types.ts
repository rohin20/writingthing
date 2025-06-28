export interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  website: string | null;
  location: string | null;
  created_at: string;
  updated_at: string;
}

export interface Blog {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  is_public: boolean;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlogWithAuthor extends Blog {
  author: Profile;
  like_count: number;
  comment_count: number;
}

export interface Follow {
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface Like {
  user_id: string;
  blog_id: string;
  created_at: string;
}

export interface Comment {
  id: string;
  user_id: string;
  blog_id: string;
  parent_id: string | null;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface CommentWithAuthor extends Comment {
  author: Profile;
  replies?: CommentWithAuthor[];
}

export interface Tag {
  id: string;
  name: string;
  created_at: string;
}

export interface BlogTag {
  blog_id: string;
  tag_id: string;
}

// Database enums
export type BlogStatus = 'draft' | 'published' | 'archived';
export type BlogVisibility = 'public' | 'private';

// Form types
export interface CreateBlogForm {
  title: string;
  content: string;
  excerpt?: string;
  is_public: boolean;
  is_published: boolean;
  tags?: string[];
}

export interface UpdateProfileForm {
  username: string;
  full_name?: string;
  bio?: string;
  website?: string;
  location?: string;
  avatar_url?: string;
}

// API response types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  total_pages: number;
} 