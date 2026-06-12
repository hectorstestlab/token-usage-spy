
-- ============ HELPER: timestamps ============
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============ HELPER: invite code ============
CREATE OR REPLACE FUNCTION public.generate_invite_code()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  code TEXT;
  exists_already BOOLEAN;
BEGIN
  LOOP
    code := upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 6));
    SELECT EXISTS(SELECT 1 FROM public.weddings WHERE invite_code = code) INTO exists_already;
    EXIT WHEN NOT exists_already;
  END LOOP;
  RETURN code;
END;
$$;

-- ============ TABLE: weddings ============
CREATE TABLE public.weddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  planner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  couple TEXT NOT NULL,
  wedding_date DATE,
  venue TEXT,
  guests INTEGER DEFAULT 0,
  budget_total NUMERIC(12,2) DEFAULT 0,
  progress INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Planificando',
  invite_code TEXT UNIQUE NOT NULL DEFAULT public.generate_invite_code(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.weddings TO authenticated;
GRANT ALL ON public.weddings TO service_role;
ALTER TABLE public.weddings ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_weddings_updated BEFORE UPDATE ON public.weddings
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============ TABLE: wedding_members ============
CREATE TABLE public.wedding_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  member_role TEXT NOT NULL CHECK (member_role IN ('client','vendor')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (wedding_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wedding_members TO authenticated;
GRANT ALL ON public.wedding_members TO service_role;
ALTER TABLE public.wedding_members ENABLE ROW LEVEL SECURITY;

-- ============ HELPER: is wedding member / owner (security definer) ============
CREATE OR REPLACE FUNCTION public.is_wedding_owner(_wedding UUID, _user UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.weddings WHERE id = _wedding AND planner_id = _user);
$$;

CREATE OR REPLACE FUNCTION public.is_wedding_member(_wedding UUID, _user UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.weddings WHERE id = _wedding AND planner_id = _user
    UNION
    SELECT 1 FROM public.wedding_members WHERE wedding_id = _wedding AND user_id = _user
  );
$$;

-- weddings policies
CREATE POLICY "weddings owner full" ON public.weddings FOR ALL TO authenticated
  USING (planner_id = auth.uid()) WITH CHECK (planner_id = auth.uid());
CREATE POLICY "weddings members read" ON public.weddings FOR SELECT TO authenticated
  USING (public.is_wedding_member(id, auth.uid()));

-- wedding_members policies
CREATE POLICY "wm planner manage" ON public.wedding_members FOR ALL TO authenticated
  USING (public.is_wedding_owner(wedding_id, auth.uid()))
  WITH CHECK (public.is_wedding_owner(wedding_id, auth.uid()));
CREATE POLICY "wm self read" ON public.wedding_members FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY "wm self leave" ON public.wedding_members FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- ============ FUNCTION: join_wedding_by_code ============
CREATE OR REPLACE FUNCTION public.join_wedding_by_code(_code TEXT, _role TEXT)
RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  w_id UUID;
BEGIN
  IF _role NOT IN ('client','vendor') THEN
    RAISE EXCEPTION 'Rol inválido';
  END IF;
  SELECT id INTO w_id FROM public.weddings WHERE invite_code = upper(_code);
  IF w_id IS NULL THEN
    RAISE EXCEPTION 'Código no válido';
  END IF;
  INSERT INTO public.wedding_members (wedding_id, user_id, member_role)
  VALUES (w_id, auth.uid(), _role)
  ON CONFLICT (wedding_id, user_id) DO NOTHING;
  RETURN w_id;
END;
$$;
GRANT EXECUTE ON FUNCTION public.join_wedding_by_code(TEXT, TEXT) TO authenticated;

-- ============ TABLE: planner_vendors ============
CREATE TABLE public.planner_vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  planner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  rating NUMERIC(2,1) DEFAULT 0,
  bookings INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Nuevo',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.planner_vendors TO authenticated;
GRANT ALL ON public.planner_vendors TO service_role;
ALTER TABLE public.planner_vendors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pv owner" ON public.planner_vendors FOR ALL TO authenticated
  USING (planner_id = auth.uid()) WITH CHECK (planner_id = auth.uid());

-- ============ TABLE: tasks ============
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  due_date DATE,
  urgent BOOLEAN DEFAULT FALSE,
  done BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tasks TO authenticated;
GRANT ALL ON public.tasks TO service_role;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tasks members read" ON public.tasks FOR SELECT TO authenticated
  USING (public.is_wedding_member(wedding_id, auth.uid()));
CREATE POLICY "tasks owner write" ON public.tasks FOR INSERT TO authenticated
  WITH CHECK (public.is_wedding_owner(wedding_id, auth.uid()));
CREATE POLICY "tasks owner update" ON public.tasks FOR UPDATE TO authenticated
  USING (public.is_wedding_owner(wedding_id, auth.uid()));
CREATE POLICY "tasks owner delete" ON public.tasks FOR DELETE TO authenticated
  USING (public.is_wedding_owner(wedding_id, auth.uid()));

-- ============ TABLE: budget_categories ============
CREATE TABLE public.budget_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  allocated NUMERIC(12,2) NOT NULL DEFAULT 0,
  spent NUMERIC(12,2) NOT NULL DEFAULT 0,
  scope TEXT NOT NULL CHECK (scope IN ('planner','client')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.budget_categories TO authenticated;
GRANT ALL ON public.budget_categories TO service_role;
ALTER TABLE public.budget_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "budget members read" ON public.budget_categories FOR SELECT TO authenticated
  USING (public.is_wedding_member(wedding_id, auth.uid()));
CREATE POLICY "budget owner write" ON public.budget_categories FOR INSERT TO authenticated
  WITH CHECK (public.is_wedding_owner(wedding_id, auth.uid()));
CREATE POLICY "budget owner update" ON public.budget_categories FOR UPDATE TO authenticated
  USING (public.is_wedding_owner(wedding_id, auth.uid()));
CREATE POLICY "budget owner delete" ON public.budget_categories FOR DELETE TO authenticated
  USING (public.is_wedding_owner(wedding_id, auth.uid()));

-- ============ TABLE: interview_questions ============
CREATE TABLE public.interview_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  planner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  type TEXT NOT NULL,
  category TEXT NOT NULL,
  options JSONB,
  required BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.interview_questions TO authenticated;
GRANT ALL ON public.interview_questions TO service_role;
ALTER TABLE public.interview_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "iq owner" ON public.interview_questions FOR ALL TO authenticated
  USING (planner_id = auth.uid()) WITH CHECK (planner_id = auth.uid());

-- ============ TABLE: interviews ============
CREATE TABLE public.interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  planner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  wedding_id UUID REFERENCES public.weddings(id) ON DELETE SET NULL,
  interview_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'Borrador',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.interviews TO authenticated;
GRANT ALL ON public.interviews TO service_role;
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_interviews_updated BEFORE UPDATE ON public.interviews
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE POLICY "interviews owner" ON public.interviews FOR ALL TO authenticated
  USING (planner_id = auth.uid()) WITH CHECK (planner_id = auth.uid());

-- ============ TABLE: interview_answers ============
CREATE TABLE public.interview_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id UUID NOT NULL REFERENCES public.interviews(id) ON DELETE CASCADE,
  question_id UUID NOT NULL,
  value JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.interview_answers TO authenticated;
GRANT ALL ON public.interview_answers TO service_role;
ALTER TABLE public.interview_answers ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE FUNCTION public.owns_interview(_interview UUID, _user UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS(SELECT 1 FROM public.interviews WHERE id = _interview AND planner_id = _user);
$$;
CREATE POLICY "ia owner" ON public.interview_answers FOR ALL TO authenticated
  USING (public.owns_interview(interview_id, auth.uid()))
  WITH CHECK (public.owns_interview(interview_id, auth.uid()));

-- ============ TABLE: vendor_services ============
CREATE TABLE public.vendor_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vendor_services TO authenticated;
GRANT ALL ON public.vendor_services TO service_role;
ALTER TABLE public.vendor_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "vs owner" ON public.vendor_services FOR ALL TO authenticated
  USING (vendor_id = auth.uid()) WITH CHECK (vendor_id = auth.uid());

-- ============ TABLE: vendor_bookings ============
CREATE TABLE public.vendor_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  booking_date DATE,
  venue TEXT,
  status TEXT NOT NULL DEFAULT 'Pendiente',
  amount TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vendor_bookings TO authenticated;
GRANT ALL ON public.vendor_bookings TO service_role;
ALTER TABLE public.vendor_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "vb owner" ON public.vendor_bookings FOR ALL TO authenticated
  USING (vendor_id = auth.uid()) WITH CHECK (vendor_id = auth.uid());

-- ============ TABLE: messages ============
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.messages TO authenticated;
GRANT ALL ON public.messages TO service_role;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "msg participants read" ON public.messages FOR SELECT TO authenticated
  USING (sender_id = auth.uid() OR recipient_id = auth.uid());
CREATE POLICY "msg sender insert" ON public.messages FOR INSERT TO authenticated
  WITH CHECK (sender_id = auth.uid());
CREATE POLICY "msg recipient update" ON public.messages FOR UPDATE TO authenticated
  USING (recipient_id = auth.uid());

-- ============ TABLE: payment_methods ============
CREATE TABLE public.payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  brand TEXT NOT NULL,
  last4 TEXT NOT NULL,
  holder_name TEXT NOT NULL,
  exp_month TEXT NOT NULL,
  exp_year TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payment_methods TO authenticated;
GRANT ALL ON public.payment_methods TO service_role;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pm self" ON public.payment_methods FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ============ TABLE: transactions ============
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  wedding_id UUID REFERENCES public.weddings(id) ON DELETE SET NULL,
  service_name TEXT NOT NULL,
  vendor_name TEXT,
  amount NUMERIC(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'pendiente',
  payment_method_last4 TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.transactions TO authenticated;
GRANT ALL ON public.transactions TO service_role;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tx self" ON public.transactions FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ============ TABLE: payment_approval_requests ============
CREATE TABLE public.payment_approval_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  planner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL,
  vendor_name TEXT,
  amount NUMERIC(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  payment_method_last4 TEXT,
  payment_method_brand TEXT,
  status TEXT NOT NULL DEFAULT 'pendiente' CHECK (status IN ('pendiente','aprobado','denegado')),
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payment_approval_requests TO authenticated;
GRANT ALL ON public.payment_approval_requests TO service_role;
ALTER TABLE public.payment_approval_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "par members read" ON public.payment_approval_requests FOR SELECT TO authenticated
  USING (public.is_wedding_member(wedding_id, auth.uid()));
CREATE POLICY "par planner insert" ON public.payment_approval_requests FOR INSERT TO authenticated
  WITH CHECK (planner_id = auth.uid() AND public.is_wedding_owner(wedding_id, auth.uid()));
CREATE POLICY "par members update" ON public.payment_approval_requests FOR UPDATE TO authenticated
  USING (public.is_wedding_member(wedding_id, auth.uid()));
CREATE POLICY "par planner delete" ON public.payment_approval_requests FOR DELETE TO authenticated
  USING (public.is_wedding_owner(wedding_id, auth.uid()));

-- ============ TABLE: reviews ============
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_role TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews read all" ON public.reviews FOR SELECT TO authenticated USING (true);
CREATE POLICY "reviews author write" ON public.reviews FOR INSERT TO authenticated
  WITH CHECK (author_id = auth.uid());
CREATE POLICY "reviews author update" ON public.reviews FOR UPDATE TO authenticated
  USING (author_id = auth.uid());
CREATE POLICY "reviews author delete" ON public.reviews FOR DELETE TO authenticated
  USING (author_id = auth.uid());
