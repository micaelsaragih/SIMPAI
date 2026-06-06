-- ─── Journal Templates ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.journal_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  publisher TEXT,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general'
    CHECK (category IN ('computer-science', 'information-systems', 'engineering', 'education', 'general')),
  required_sections JSONB NOT NULL DEFAULT '[]'::jsonb,
  section_order JSONB NOT NULL DEFAULT '[]'::jsonb,
  section_keywords JSONB NOT NULL DEFAULT '{}'::jsonb,
  heading_structure JSONB NOT NULL DEFAULT '[]'::jsonb,
  quality_score REAL NOT NULL DEFAULT 0,
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_journal_templates_slug ON public.journal_templates(slug);
CREATE INDEX idx_journal_templates_created_by ON public.journal_templates(created_by);
CREATE INDEX idx_journal_templates_category ON public.journal_templates(category);

-- ─── Template Versions ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.template_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES public.journal_templates(id) ON DELETE CASCADE,
  version_name TEXT NOT NULL,
  version_number TEXT NOT NULL,
  notes TEXT,
  section_snapshot JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_template_versions_template_id ON public.template_versions(template_id);

-- ─── RLS Policies ───────────────────────────────────────────────────────────

ALTER TABLE public.journal_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_versions ENABLE ROW LEVEL SECURITY;

-- Templates: anyone authenticated can read, only owner can write
CREATE POLICY "Templates are viewable by authenticated users"
  ON public.journal_templates FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own templates"
  ON public.journal_templates FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own templates"
  ON public.journal_templates FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can delete their own templates"
  ON public.journal_templates FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Versions: anyone authenticated can read, only owner can insert
CREATE POLICY "Template versions are viewable by authenticated users"
  ON public.template_versions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create versions for their own templates"
  ON public.template_versions FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = created_by
    AND EXISTS (
      SELECT 1 FROM public.journal_templates
      WHERE id = template_id AND created_by = auth.uid()
    )
  );

-- ─── Updated At Trigger ─────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_journal_templates_updated_at
  BEFORE UPDATE ON public.journal_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
