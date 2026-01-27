-- Add canvas_data column to store canvas nodes/objects for each project
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS canvas_data jsonb;

-- Add comment
COMMENT ON COLUMN public.projects.canvas_data IS 'Stores the canvas nodes and objects as JSON';
