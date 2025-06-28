-- Update the handle_new_user function to be minimal
-- Run this in your Supabase SQL Editor

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
        NULL, -- full_name will be NULL for now
        NULL  -- avatar_url will be NULL for now
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 