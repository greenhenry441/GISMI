import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const geojsonSchema = z.object({
  type: z.literal("FeatureCollection"),
  features: z.array(z.any()).max(5000),
});

const saveSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1).max(120),
  description: z.string().max(2000).optional().nullable(),
  category: z.string().max(80).optional().nullable(),
  geojson: geojsonSchema,
  center_lat: z.number().min(-90).max(90),
  center_lng: z.number().min(-180).max(180),
  zoom: z.number().int().min(1).max(20),
  is_public: z.boolean(),
});

export const listPublicMaps = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("maps")
    .select("id,title,description,category,center_lat,center_lng,zoom,view_count,created_at,user_id")
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(60);
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getMap = createServerFn({ method: "GET" })
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("maps")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) return null;
    if (!row.is_public) return null; // only public via this endpoint
    return row;
  });

export const saveMap = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => saveSchema.parse(d))
  .handler(async ({ data, context }) => {
    const payload = {
      user_id: context.userId,
      title: data.title,
      description: data.description ?? null,
      category: data.category ?? null,
      geojson: data.geojson,
      center_lat: data.center_lat,
      center_lng: data.center_lng,
      zoom: data.zoom,
      is_public: data.is_public,
    };
    if (data.id) {
      const { data: row, error } = await context.supabase
        .from("maps").update(payload).eq("id", data.id).select().single();
      if (error) throw new Error(error.message);
      return row;
    }
    const { data: row, error } = await context.supabase
      .from("maps").insert(payload).select().single();
    if (error) throw new Error(error.message);
    return row;
  });

export const listMyMaps = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("maps")
      .select("id,title,description,category,is_public,view_count,updated_at")
      .eq("user_id", context.userId)
      .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const getMyMap = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("maps").select("*").eq("id", data.id).eq("user_id", context.userId).maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

export const deleteMap = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("maps").delete().eq("id", data.id).eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
