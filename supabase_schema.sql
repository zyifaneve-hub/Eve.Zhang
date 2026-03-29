-- Create 'records' table
CREATE TABLE IF NOT EXISTS public.records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  price NUMERIC NOT NULL,
  media_grade TEXT NOT NULL,
  sleeve_grade TEXT NOT NULL,
  format TEXT NOT NULL,
  label TEXT,
  year VARCHAR(4),
  catalog_number TEXT,
  description TEXT,
  audio_features TEXT,
  accessories TEXT,
  image_url TEXT NOT NULL,
  liked BOOLEAN DEFAULT FALSE
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access" ON public.records;
CREATE POLICY "Allow public read access" ON public.records
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert access" ON public.records;
CREATE POLICY "Allow public insert access" ON public.records
  FOR INSERT WITH CHECK (true);

-- Create 'record_images' storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('record_images', 'record_images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read/write access to the bucket
DROP POLICY IF EXISTS "Allow public read access on record_images" ON storage.objects;
CREATE POLICY "Allow public read access on record_images" 
  ON storage.objects FOR SELECT USING (bucket_id = 'record_images');

DROP POLICY IF EXISTS "Allow public insert access on record_images" ON storage.objects;
CREATE POLICY "Allow public insert access on record_images" 
  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'record_images');

-- ==========================================
-- User Profiles & Authentication Schema
-- ==========================================

-- Create 'profiles' table to store user information extending auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  updated_at TIMESTAMPTZ,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  location TEXT
);

-- Set up Row Level Security (RLS) for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Create a trigger to automatically create a profile entry when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'username', 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Add relationship: link records to a seller (profile)
ALTER TABLE public.records
ADD COLUMN IF NOT EXISTS seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;

-- ==========================================
-- Test Data / Seed Data
-- ==========================================

INSERT INTO public.records (
  title, artist, price, media_grade, sleeve_grade, format, 
  label, year, catalog_number, description, audio_features, 
  accessories, image_url
) VALUES 
('The Dark Side of the Moon', 'Pink Floyd', 35.00, 'VG+', 'VG+', '12" LP', 'Harvest', '1973', 'SHVL 804', 'Classic progressive rock masterpiece. Includes original posters.', 'Stereo', '2 Posters, 2 Stickers', 'https://upload.wikimedia.org/wikipedia/en/thumb/a/ab/The_Dark_Side_of_the_Moon_cover.svg/500px-The_Dark_Side_of_the_Moon_cover.svg.png'),
('Abbey Road', 'The Beatles', 42.50, 'NM', 'EX', '12" LP', 'Apple Records', '1969', 'PCS 7088', 'Iconic final recorded album by The Beatles.', 'Stereo', 'None', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/The_Beatles_Abbey_Road_album_cover.jpg/500px-The_Beatles_Abbey_Road_album_cover.jpg'),
('Kind of Blue', 'Miles Davis', 45.00, 'M', 'M', '12" LP', 'Columbia', '1959', 'CS 8163', 'Essential jazz record, sealed reprint.', 'Stereo', 'Insert included', 'https://upload.wikimedia.org/wikipedia/commons/4/43/Miles_Davis_by_Palumbo.jpg'),
('Rumours', 'Fleetwood Mac', 28.00, 'VG', 'VG', '12" LP', 'Warner Bros. Records', '1977', 'BSK 3010', '1970s pop-rock classic.', 'Stereo', 'Lyric sheet', 'https://upload.wikimedia.org/wikipedia/en/f/fb/FMacRumours.PNG'),
('Thriller', 'Michael Jackson', 30.00, 'VG+', 'EX', '12" LP', 'Epic', '1982', 'QE 38112', 'The best-selling album of all time.', 'Stereo', 'Original inner sleeve', 'https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png'),
('Are You Experienced', 'The Jimi Hendrix Experience', 35.00, 'VG+', 'VG', '12" LP', 'Track Record', '1967', '612 001', 'Groundbreaking psychedelic rock debut.', 'Stereo', 'Original inner sleeve', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Are_You_Experienced_-_US_cover-edit.jpg/500px-Are_You_Experienced_-_US_cover-edit.jpg'),
('Back in Black', 'AC/DC', 30.00, 'NM', 'VG+', '12" LP', 'Albert Productions', '1980', 'APLP-046', 'One of the best-selling hard rock albums.', 'Stereo', 'None', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/ACDC_Back_in_Black.png/500px-ACDC_Back_in_Black.png'),
('Led Zeppelin IV', 'Led Zeppelin', 40.00, 'VG+', 'VG+', '12" LP', 'Atlantic', '1971', '2401012', 'Classic blues-rock featuring Stairway to Heaven.', 'Stereo', 'Gatefold, inner sleeve', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Zeppelin_IV.jpg/500px-Zeppelin_IV.jpg'),
('Sgt. Pepper''s Lonely Hearts Club Band', 'The Beatles', 50.00, 'NM', 'EX', '12" LP', 'Parlophone', '1967', 'PCS 7027', 'A milestone album in pop history.', 'Stereo', 'Cut-outs insert', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Sgt._Pepper%27s_Lonely_Hearts_Club_Band_album_art.jpg/500px-Sgt._Pepper%27s_Lonely_Hearts_Club_Band_album_art.jpg'),
('The Wall', 'Pink Floyd', 45.00, 'VG', 'VG+', '2xLP', 'Harvest', '1979', 'SHDW 411', 'Epic rock opera double album.', 'Stereo', 'Printed inner sleeves', 'https://upload.wikimedia.org/wikipedia/en/thumb/1/13/PinkFloydWallCoverOriginalNoText.jpg/500px-PinkFloydWallCoverOriginalNoText.jpg'),
('Highway 61 Revisited', 'Bob Dylan', 38.00, 'EX', 'VG+', '12" LP', 'Columbia', '1965', 'CS 9189', 'The birth of folk-rock.', 'Stereo', 'None', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Bob_Dylan_-_Highway_61_Revisited.jpg/500px-Bob_Dylan_-_Highway_61_Revisited.jpg'),
('Never Mind the Bollocks, Here''s the Sex Pistols', 'Sex Pistols', 42.00, 'VG+', 'VG+', '12" LP', 'Virgin', '1977', 'V 2086', 'The definitive UK punk album.', 'Stereo', 'Poster included', 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4c/Never_Mind_the_Bollocks%2C_Here%27s_the_Sex_Pistols.png/500px-Never_Mind_the_Bollocks%2C_Here%27s_the_Sex_Pistols.png'),
('Pet Sounds', 'The Beach Boys', 55.00, 'NM', 'NM', '12" LP', 'Capitol', '1966', 'T-2458', 'Incredible harmonies and dense production.', 'Mono', 'Original shrink', 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Pet_Sounds_%28color_corrected%29.jpg/500px-Pet_Sounds_%28color_corrected%29.jpg'),
('Amnesiac', 'Radiohead', 1280.00, 'NM', 'NM', '12" LP', 'Parlophone', '2001', '7243 5 32764 1 6', 'Experimental masterpiece.', 'Stereo', 'Library book binding', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTeQ6EDgEO-UvcnLlabt440OhXt-JmMaRBnhCo9dBvhnyFXXarSKt2Pn4LmrfemuRfjjRjl09erREg36YcEjkD0yXMaSbgqvpOjqckeoWqK2d3yzJM7n6e3Cqchaxbw0AZJfs9m2ZUbtdAfPEL7C86Ok7kTMc4EmblF9fDtRWO2SQi8_6VJsxQ9rdhNTrLWUlMuSI4YPr1mUZjsMPF-TtcdkuTIWdfgFnVNHVhX6WlJ44bwlzEMsfVCJjqlPpBTXFN26SdV5JmEe3i'),
('Unknown Pleasures', 'Joy Division', 450.00, 'VG+', 'VG', '12" LP', 'Factory', '1979', 'FACT 10', 'Post-punk defining album.', 'Stereo', 'Textured sleeve', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWTFppcWEiW8QzsWF1ya0gdu-7i-uON-MZ6RdJBSluzfXvfqxRxJl25uw-GVcMP4qrTKdRlIstxEDuLLz5DLfxdksMc4uSYnc-k6YRnOgNoNwtOmETeMO7mUmNy0ZMUpzJMDUMwAcO4WGd5rr2Ga-o0D6vdX5QYUDsdcBqE1_AzD8i3N9Ome4E9pltkGzrymiAGF3hfJoYY9LGLDGIUgZ26_l8TA8XCdN67RHPoU0wGwWsf4DKca6Qc9TqgbGM98SCZ919f9Ic2Sx5'),
('Random Access Memories', 'Daft Punk', 315.00, 'VG+', 'VG+', '2xLP', 'Columbia', '2013', '88883716861', 'Modern electronic classic win.', 'Stereo', 'Gatefold, booklet', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwvSqg8xEb6bipZmGJpzr7vg1VbIbl9x5WVNcPrPqcv4G8WWFemnrarrGBILFNUk-0uCNc1190O1Bws-e-p4R7Difvy_09jRcZQtRv5FOyEw1CsWst4VMTb9BK1Moa_SwNFByfyqQbgrOnPhGYLWev4LQ3exd197DFcX_IlMQKBHDeLhgfkPcbDAYzuy3Ybg6jqbqqzyHTxmfTkq8lw9m9_XqLnjk5_tExXDBBP_1gtO1-XPPfMLdG9TDVJYWz2Z7-yXZnau5UD1t1'),
('A Love Supreme', 'John Coltrane', 580.00, 'M', 'M', '12" LP', 'Impulse!', '1965', 'A-77', 'Spiritual jazz essential.', 'Stereo', 'Gatefold', 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7QHYX5Rou2YKKZphi474hbUlj7VHVz1t57Oqw0I0_aTWnKWMtsFTFO2nCnrRU38YHtnvxwgoU5lqWv3eMpa1LExjNnBC8yDenDfd3BBYutQX7h42mSTu0vDYgs7Z9uRgOBPzkb5JIJvOWjtpAo6Y54Pb7JBAic4gbSAKck7dbTLZj47jBjDtnp1DIIetYPvLkRLQTojjMIIPcR-1Uvyz-4W0g-dMAPso-OwymQkxzLLqmgVCt5qE4ESS6twVInE5CydBiYHSOvwyE'),
('Kid A Mnesia', 'Radiohead', 428.00, 'NM', 'NM', '3xLP', 'XL Recordings', '2021', 'XL1166LP', 'Reissue of two incredible albums.', 'Stereo', 'Booklet, extra cassette tape', 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8fBIddr_fyTWNSbEFAkunD-p94HorYBQfXd7dy9Vu4RscriRWq2c4jNOkgoK653h8hCxFev02IsQUcWDsdb1ha2jt-MyqE2exAvLYVswYDFaCfui9nSg_gD203u34g90EEJWPT0mYeXmyBN11DPf4VrhSyE75vCI4GPZFam2DknGk79XvryYwTKlCqa4_aXi2ZvikU_5cZlQ8cI3HQusH8AQMIK5scsvVAAxqgCTzOVUI4It35_gK663MM92UvvNWLx4U4TOKxqR4');

