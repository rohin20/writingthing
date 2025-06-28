-- Blogging Platform Database Schema
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    website TEXT,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    is_public BOOLEAN DEFAULT true,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create follows table
CREATE TABLE IF NOT EXISTS follows (
    follower_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    following_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (follower_id, following_id),
    CHECK (follower_id != following_id)
);

-- Create likes table
CREATE TABLE IF NOT EXISTS likes (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    blog_id UUID REFERENCES blogs(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, blog_id)
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    blog_id UUID REFERENCES blogs(id) ON DELETE CASCADE NOT NULL,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_tags junction table
CREATE TABLE IF NOT EXISTS blog_tags (
    blog_id UUID REFERENCES blogs(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (blog_id, tag_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blogs_user_id ON blogs(user_id);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_public_published ON blogs(is_public, is_published, published_at);
CREATE INDEX IF NOT EXISTS idx_follows_follower ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON follows(following_id);
CREATE INDEX IF NOT EXISTS idx_likes_blog_id ON likes(blog_id);
CREATE INDEX IF NOT EXISTS idx_comments_blog_id ON comments(blog_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for blogs
CREATE POLICY "Public blogs are viewable by everyone" ON blogs
    FOR SELECT USING (is_public = true AND is_published = true);

CREATE POLICY "Users can view own blogs" ON blogs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own blogs" ON blogs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own blogs" ON blogs
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own blogs" ON blogs
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for follows
CREATE POLICY "Follows are viewable by everyone" ON follows
    FOR SELECT USING (true);

CREATE POLICY "Users can insert follows" ON follows
    FOR INSERT WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can delete own follows" ON follows
    FOR DELETE USING (auth.uid() = follower_id);

-- RLS Policies for likes
CREATE POLICY "Likes are viewable by everyone" ON likes
    FOR SELECT USING (true);

CREATE POLICY "Users can insert likes" ON likes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own likes" ON likes
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for comments
CREATE POLICY "Comments are viewable by everyone" ON comments
    FOR SELECT USING (true);

CREATE POLICY "Users can insert comments" ON comments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments" ON comments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments" ON comments
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for tags
CREATE POLICY "Tags are viewable by everyone" ON tags
    FOR SELECT USING (true);

-- RLS Policies for blog_tags
CREATE POLICY "Blog tags are viewable by everyone" ON blog_tags
    FOR SELECT USING (true);

CREATE POLICY "Users can manage tags for own blogs" ON blog_tags
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM blogs 
            WHERE blogs.id = blog_tags.blog_id 
            AND blogs.user_id = auth.uid()
        )
    );

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    base_username TEXT;
    final_username TEXT;
    counter INTEGER := 0;
BEGIN
    -- Get the username from metadata, or generate one
    base_username := COALESCE(
        NEW.raw_user_meta_data->>'username',
        'user_' || substr(NEW.id::text, 1, 8)
    );
    
    -- Ensure username is lowercase and clean
    base_username := lower(regexp_replace(base_username, '[^a-zA-Z0-9_-]', '', 'g'));
    
    -- If username is empty after cleaning, generate a default one
    IF base_username = '' THEN
        base_username := 'user_' || substr(NEW.id::text, 1, 8);
    END IF;
    
    -- Handle username conflicts by adding a number suffix
    final_username := base_username;
    WHILE EXISTS (SELECT 1 FROM profiles WHERE username = final_username) LOOP
        counter := counter + 1;
        final_username := base_username || '_' || counter;
    END LOOP;
    
    INSERT INTO public.profiles (id, username, full_name, avatar_url)
    VALUES (
        NEW.id,
        final_username,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blogs_updated_at BEFORE UPDATE ON blogs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate slug from title
CREATE OR REPLACE FUNCTION generate_slug(title TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN lower(regexp_replace(title, '[^a-zA-Z0-9\s-]', '', 'g'))
           || '-' || substr(md5(random()::text), 1, 8);
END;
$$ LANGUAGE plpgsql;

-- Function to get blog with author info
CREATE OR REPLACE FUNCTION get_blog_with_author(blog_slug TEXT)
RETURNS TABLE (
    id UUID,
    title TEXT,
    slug TEXT,
    content TEXT,
    excerpt TEXT,
    is_public BOOLEAN,
    is_published BOOLEAN,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    author_id UUID,
    author_username TEXT,
    author_full_name TEXT,
    author_avatar_url TEXT,
    like_count BIGINT,
    comment_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        b.id,
        b.title,
        b.slug,
        b.content,
        b.excerpt,
        b.is_public,
        b.is_published,
        b.published_at,
        b.created_at,
        b.updated_at,
        p.id as author_id,
        p.username as author_username,
        p.full_name as author_full_name,
        p.avatar_url as author_avatar_url,
        (SELECT COUNT(*) FROM likes WHERE blog_id = b.id) as like_count,
        (SELECT COUNT(*) FROM comments WHERE blog_id = b.id) as comment_count
    FROM blogs b
    JOIN profiles p ON b.user_id = p.id
    WHERE b.slug = blog_slug AND b.is_public = true AND b.is_published = true;
END;
$$ LANGUAGE plpgsql; 