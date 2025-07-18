
-- Add admin role to vyakarni@gmail.com
INSERT INTO public.user_roles (user_id, role, assigned_at)
VALUES ('21961b65-6782-4cb2-a05c-b160e82692ec', 'admin', NOW())
ON CONFLICT (user_id, role) DO NOTHING;
