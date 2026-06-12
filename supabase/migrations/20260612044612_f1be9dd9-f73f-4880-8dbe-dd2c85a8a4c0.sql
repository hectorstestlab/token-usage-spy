
-- 1. Restrict profiles SELECT to own profile only
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON public.profiles;
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- 2. Remove self-insert on user_roles (handle_new_user trigger handles assignment via SECURITY DEFINER)
DROP POLICY IF EXISTS "Users can insert their own role on signup" ON public.user_roles;

-- 3. Revoke EXECUTE on internal SECURITY DEFINER helpers from public roles
REVOKE EXECUTE ON FUNCTION public.is_wedding_owner(uuid, uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_wedding_member(uuid, uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.owns_interview(uuid, uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_current_user_role() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.generate_invite_code() FROM PUBLIC, anon, authenticated;

-- join_wedding_by_code must remain callable by authenticated users
GRANT EXECUTE ON FUNCTION public.join_wedding_by_code(text, text) TO authenticated;
