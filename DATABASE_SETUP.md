# Database Setup Guide

## 🗄️ Setting up your Supabase Database

### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `writingthing` (or your preferred name)
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"

### Step 2: Get Your Project Credentials

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy your **Project URL** and **anon public** key
3. Create a `.env.local` file in your project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### Step 3: Run the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `database-schema.sql`
4. Paste it into the SQL editor
5. Click **Run** to execute the schema

### Step 4: Verify the Setup

After running the schema, you should see these tables in **Table Editor**:

- ✅ `profiles` - User profiles
- ✅ `blogs` - Blog posts
- ✅ `follows` - User following relationships
- ✅ `likes` - Blog likes
- ✅ `comments` - Blog comments
- ✅ `tags` - Blog tags
- ✅ `blog_tags` - Blog-tag relationships

### Step 5: Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Go to your app and try to sign up a new user
3. Check the **Table Editor** → `profiles` to see if a profile was automatically created

## 🔐 Row Level Security (RLS)

The schema includes comprehensive RLS policies that ensure:

- **Public blogs** are visible to everyone
- **Private blogs** are only visible to the author
- **Users can only edit their own content**
- **Follow relationships** are properly secured
- **Likes and comments** are properly secured

## 📊 Database Features

### Automatic Profile Creation
When a user signs up, a profile is automatically created with:
- Generated username (if not provided)
- Full name from auth metadata
- Avatar URL from auth metadata

### Blog Management
- **Draft/Published** status
- **Public/Private** visibility
- **Slug generation** for SEO-friendly URLs
- **Tags support** for categorization

### Social Features
- **Follow/Unfollow** system
- **Like/Unlike** blogs
- **Comment system** with nested replies
- **Activity tracking**

### Performance Optimizations
- **Indexes** on frequently queried columns
- **Efficient joins** for blog listings
- **Optimized queries** for social features

## 🚀 Next Steps

After setting up the database:

1. **Update your environment variables** with Supabase credentials
2. **Test authentication** by signing up a user
3. **Start building the UI** for blog creation and management
4. **Implement user profiles** and social features

## 🔧 Troubleshooting

### Common Issues:

**"Table already exists" errors:**
- The schema uses `CREATE TABLE IF NOT EXISTS` so it's safe to run multiple times

**RLS policy errors:**
- Make sure you're authenticated when testing protected operations
- Check that the user ID matches the expected format

**Profile not created on signup:**
- Check the `handle_new_user()` function in the database
- Verify the trigger is properly set up

### Need Help?

- Check the [Supabase documentation](https://supabase.com/docs)
- Review the RLS policies in the SQL schema
- Test with the Supabase dashboard tools 