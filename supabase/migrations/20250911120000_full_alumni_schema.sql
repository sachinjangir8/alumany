-- Enable required extensions
create extension if not exists pgcrypto with schema public;

-- Schema Analysis: Fresh project - no existing schema
-- Integration Type: Complete new schema creation for alumni management system
-- Dependencies: None - creating complete system from scratch

-- 1. Create custom types
CREATE TYPE public.user_role AS ENUM ('administrator', 'alumni', 'student', 'faculty', 'management');
CREATE TYPE public.connection_status AS ENUM ('pending', 'connected', 'blocked');
CREATE TYPE public.event_status AS ENUM ('upcoming', 'ongoing', 'completed', 'cancelled');
CREATE TYPE public.job_type AS ENUM ('full_time', 'part_time', 'contract', 'internship', 'remote');
CREATE TYPE public.application_status AS ENUM ('applied', 'reviewing', 'shortlisted', 'interviewed', 'accepted', 'rejected');

-- 2. Create core user profiles table (intermediary for auth.users)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role DEFAULT 'alumni'::public.user_role,
    phone TEXT,
    avatar_url TEXT,
    bio TEXT,
    current_position TEXT,
    company TEXT,
    industry TEXT,
    location TEXT,
    graduation_year INTEGER,
    department TEXT,
    degree TEXT,
    website_url TEXT,
    linkedin_url TEXT,
    twitter_url TEXT,
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    is_online BOOLEAN DEFAULT false,
    last_seen_at TIMESTAMPTZ,
    privacy_settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create connection management tables
CREATE TABLE public.user_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    requestee_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    status public.connection_status DEFAULT 'pending'::public.connection_status,
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_connection UNIQUE (requester_id, requestee_id)
);

-- 4. Create events management tables
CREATE TABLE public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organizer_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    event_type TEXT DEFAULT 'general',
    location TEXT,
    venue_details JSONB,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    registration_deadline TIMESTAMPTZ,
    max_attendees INTEGER,
    current_attendees INTEGER DEFAULT 0,
    status public.event_status DEFAULT 'upcoming'::public.event_status,
    is_public BOOLEAN DEFAULT true,
    cover_image_url TEXT,
    tags TEXT[],
    requirements TEXT,
    contact_info JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.event_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    registration_data JSONB,
    attended BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_event_registration UNIQUE (event_id, user_id)
);

-- 5. Create job posting and career board tables
CREATE TABLE public.job_postings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    posted_by UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    department TEXT,
    job_type public.job_type DEFAULT 'full_time'::public.job_type,
    location TEXT,
    is_remote BOOLEAN DEFAULT false,
    salary_range TEXT,
    experience_level TEXT,
    description TEXT NOT NULL,
    requirements TEXT,
    benefits TEXT,
    application_deadline TIMESTAMPTZ,
    external_url TEXT,
    contact_email TEXT,
    is_active BOOLEAN DEFAULT true,
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES public.job_postings(id) ON DELETE CASCADE,
    applicant_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    status public.application_status DEFAULT 'applied'::public.application_status,
    cover_letter TEXT,
    resume_url TEXT,
    application_data JSONB,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_job_application UNIQUE (job_id, applicant_id)
);

-- 6. Create messaging system tables
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    subject TEXT,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    parent_message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE,
    attachments JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. Create activity and engagement tables
CREATE TABLE public.user_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL,
    activity_data JSONB,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    achievement_type TEXT DEFAULT 'general',
    date_earned TIMESTAMPTZ,
    issuer TEXT,
    verification_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 8. Create essential indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_user_profiles_graduation_year ON public.user_profiles(graduation_year);
CREATE INDEX idx_user_profiles_department ON public.user_profiles(department);
CREATE INDEX idx_user_profiles_location ON public.user_profiles(location);
CREATE INDEX idx_user_profiles_is_active ON public.user_profiles(is_active);

CREATE INDEX idx_user_connections_requester ON public.user_connections(requester_id);
CREATE INDEX idx_user_connections_requestee ON public.user_connections(requestee_id);
CREATE INDEX idx_user_connections_status ON public.user_connections(status);

CREATE INDEX idx_events_organizer ON public.events(organizer_id);
CREATE INDEX idx_events_start_date ON public.events(start_date);
CREATE INDEX idx_events_status ON public.events(status);
CREATE INDEX idx_events_is_public ON public.events(is_public);

CREATE INDEX idx_event_registrations_event ON public.event_registrations(event_id);
CREATE INDEX idx_event_registrations_user ON public.event_registrations(user_id);

CREATE INDEX idx_job_postings_posted_by ON public.job_postings(posted_by);
CREATE INDEX idx_job_postings_company ON public.job_postings(company);
CREATE INDEX idx_job_postings_job_type ON public.job_postings(job_type);
CREATE INDEX idx_job_postings_is_active ON public.job_postings(is_active);

CREATE INDEX idx_job_applications_job ON public.job_applications(job_id);
CREATE INDEX idx_job_applications_applicant ON public.job_applications(applicant_id);
CREATE INDEX idx_job_applications_status ON public.job_applications(status);

CREATE INDEX idx_messages_sender ON public.messages(sender_id);
CREATE INDEX idx_messages_recipient ON public.messages(recipient_id);
CREATE INDEX idx_messages_is_read ON public.messages(is_read);

CREATE INDEX idx_user_activities_user ON public.user_activities(user_id);
CREATE INDEX idx_user_activities_type ON public.user_activities(activity_type);
CREATE INDEX idx_user_activities_created_at ON public.user_activities(created_at);

CREATE INDEX idx_achievements_user ON public.achievements(user_id);
CREATE INDEX idx_achievements_type ON public.achievements(achievement_type);

-- 9. Functions (MUST BE BEFORE RLS POLICIES)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.user_profiles (
        id, 
        email, 
        full_name, 
        role
    )
    VALUES (
        NEW.id, 
        NEW.email, 
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'alumni'::public.user_role)
    );
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- 10. Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- 11. RLS Policies (following 7-pattern system)

-- Pattern 1: Core user table (user_profiles) - Simple only, no functions
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Public read access for user profiles (directory functionality)
CREATE POLICY "public_can_read_user_profiles"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (is_active = true);

-- Pattern 2: Simple user ownership for connections
CREATE POLICY "users_manage_own_connections"
ON public.user_connections
FOR ALL
TO authenticated
USING (requester_id = auth.uid() OR requestee_id = auth.uid())
WITH CHECK (requester_id = auth.uid());

-- Pattern 2: Simple user ownership for events
CREATE POLICY "users_manage_own_events"
ON public.events
FOR ALL
TO authenticated
USING (organizer_id = auth.uid())
WITH CHECK (organizer_id = auth.uid());

-- Public read access for public events
CREATE POLICY "public_can_read_public_events"
ON public.events
FOR SELECT
TO authenticated
USING (is_public = true AND status = 'upcoming'::public.event_status);

-- Pattern 2: Simple user ownership for event registrations
CREATE POLICY "users_manage_own_event_registrations"
ON public.event_registrations
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Event organizers can view registrations
CREATE POLICY "event_organizers_can_view_registrations"
ON public.event_registrations
FOR SELECT
TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.events e 
    WHERE e.id = event_id AND e.organizer_id = auth.uid()
));

-- Pattern 2: Simple user ownership for job postings
CREATE POLICY "users_manage_own_job_postings"
ON public.job_postings
FOR ALL
TO authenticated
USING (posted_by = auth.uid())
WITH CHECK (posted_by = auth.uid());

-- Public read access for active job postings
CREATE POLICY "public_can_read_active_job_postings"
ON public.job_postings
FOR SELECT
TO authenticated
USING (is_active = true);

-- Pattern 2: Simple user ownership for job applications
CREATE POLICY "users_manage_own_job_applications"
ON public.job_applications
FOR ALL
TO authenticated
USING (applicant_id = auth.uid())
WITH CHECK (applicant_id = auth.uid());

-- Job posters can view applications
CREATE POLICY "job_posters_can_view_applications"
ON public.job_applications
FOR SELECT
TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.job_postings jp 
    WHERE jp.id = job_id AND jp.posted_by = auth.uid()
));

-- Pattern 2: Simple user ownership for messages
CREATE POLICY "users_manage_own_messages"
ON public.messages
FOR ALL
TO authenticated
USING (sender_id = auth.uid() OR recipient_id = auth.uid())
WITH CHECK (sender_id = auth.uid());

-- Pattern 2: Simple user ownership for activities
CREATE POLICY "users_manage_own_activities"
ON public.user_activities
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Public read access for public activities
CREATE POLICY "public_can_read_public_activities"
ON public.user_activities
FOR SELECT
TO authenticated
USING (is_public = true);

-- Pattern 2: Simple user ownership for achievements
CREATE POLICY "users_manage_own_achievements"
ON public.achievements
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Public read access for achievements
CREATE POLICY "public_can_read_achievements"
ON public.achievements
FOR SELECT
TO authenticated
USING (true);

-- 12. Create triggers for automatic profile creation and timestamp updates
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_connections_updated_at
    BEFORE UPDATE ON public.user_connections
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON public.events
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_postings_updated_at
    BEFORE UPDATE ON public.job_postings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_applications_updated_at
    BEFORE UPDATE ON public.job_applications
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 13. Mock data with complete auth.users records
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    alumni_uuid UUID := gen_random_uuid();
    student_uuid UUID := gen_random_uuid();
    faculty_uuid UUID := gen_random_uuid();
    manager_uuid UUID := gen_random_uuid();
    
    event1_id UUID := gen_random_uuid();
    event2_id UUID := gen_random_uuid();
    job1_id UUID := gen_random_uuid();
    job2_id UUID := gen_random_uuid();
BEGIN
    -- Create complete auth.users records with all required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@punjab.gov.in', crypt('Admin@123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Admin User", "role": "administrator"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (alumni_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'alumni@example.com', crypt('Alumni@123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "John Alumni", "role": "alumni"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (student_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'student@college.edu', crypt('Student@123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Jane Student", "role": "student"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (faculty_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'faculty@college.edu', crypt('Faculty@123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Dr. Faculty Member", "role": "faculty"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (manager_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'manager@punjab.gov.in', crypt('Manager@123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Alumni Manager", "role": "management"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create sample events
    INSERT INTO public.events (id, organizer_id, title, description, location, start_date, end_date, status, is_public, event_type) VALUES
        (event1_id, admin_uuid, 'Annual Alumni Meetup 2025', 'Join us for our annual alumni gathering with networking, presentations, and celebration.', 'Punjab University Main Campus', now() + interval '1 month', now() + interval '1 month 1 day', 'upcoming'::public.event_status, true, 'networking'),
        (event2_id, faculty_uuid, 'Career Development Workshop', 'Professional development workshop covering resume building, interview skills, and career planning.', 'Online Event', now() + interval '2 weeks', now() + interval '2 weeks 3 hours', 'upcoming'::public.event_status, true, 'workshop');

    -- Create sample job postings
    INSERT INTO public.job_postings (id, posted_by, title, company, job_type, location, description, requirements, is_active) VALUES
        (job1_id, alumni_uuid, 'Software Engineer', 'Tech Solutions Inc.', 'full_time'::public.job_type, 'Chandigarh, India', 'We are looking for a talented software engineer to join our growing team.', 'Bachelor degree in Computer Science or related field, 2+ years experience in web development', true),
        (job2_id, manager_uuid, 'Marketing Manager', 'Punjab Development Agency', 'full_time'::public.job_type, 'Ludhiana, Punjab', 'Marketing manager position for government development programs and initiatives.', 'MBA in Marketing, 3+ years experience in government or NGO sector', true);

    -- Create sample achievements
    INSERT INTO public.achievements (user_id, title, description, achievement_type, date_earned, issuer, is_featured) VALUES
        (alumni_uuid, 'Outstanding Alumni Award 2024', 'Recognized for exceptional contributions to technology and community development.', 'award', now() - interval '6 months', 'Punjab University Alumni Association', true),
        (faculty_uuid, 'Excellence in Teaching Award', 'Awarded for innovative teaching methods and student mentorship.', 'academic', now() - interval '1 year', 'Punjab University', false);

    -- Create sample user activities
    INSERT INTO public.user_activities (user_id, activity_type, activity_data, is_public) VALUES
        (alumni_uuid, 'job_posted', '{"job_id": "' || job1_id || '", "job_title": "Software Engineer", "company": "Tech Solutions Inc."}', true),
        (admin_uuid, 'event_created', '{"event_id": "' || event1_id || '", "event_title": "Annual Alumni Meetup 2025"}', true),
        (faculty_uuid, 'profile_updated', '{"fields_updated": ["current_position", "bio"]}', false);

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;



