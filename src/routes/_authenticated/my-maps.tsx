import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { listMyMaps, deleteMap } from "@/lib/maps.functions";
import { Button } from "@/components/ui/button";
import { Plus, Globe, Lock, Pencil, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const myMapsQuery = queryOptions({ queryKey: ["my-maps"], queryFn: () => listMyMaps() });

export const Route = createFileRoute("/_authenticated/my-maps")({
  ssr: false,
  head: () => ({ meta: [{ title: "My maps — GISMI" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(myMapsQuery),
  component: MyMaps,
});

function MyMaps() {
  const { data: maps } = useSuspenseQuery(myMapsQuery);
  const qc = useQueryClient();

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      await deleteMap({ data: { id } });
      qc.invalidateQueries({ queryKey: ["my-maps"] });
      qc.invalidateQueries({ queryKey: ["public-maps"] });
      toast.success("Map deleted");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  };

  return (
    <div className="min-h-screen topo-bg">
      <Header />
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">Your atlas</p>
            <h1 className="mt-1 font-display text-4xl font-bold">My maps</h1>
          </div>
          <Button asChild size="lg"><Link to="/builder"><Plus className="mr-2 h-4 w-4" />New map</Link></Button>
        </div>

        {maps.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 p-16 text-center">
            <h2 className="font-display text-2xl font-semibold">No maps yet</h2>
            <p className="mt-2 text-muted-foreground">Start your first Michigan map in the builder.</p>
            <Button asChild className="mt-4"><Link to="/builder">Open the builder</Link></Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {maps.map((m) => (
              <div key={m.id} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-start justify-between gap-2">
                  {m.category && <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium">{m.category}</span>}
                  <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                    {m.is_public ? <><Globe className="h-3 w-3" />Public</> : <><Lock className="h-3 w-3" />Private</>}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold">{m.title}</h3>
                {m.description && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{m.description}</p>}
                <p className="mt-3 text-xs text-muted-foreground">Updated {new Date(m.updated_at).toLocaleDateString()}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button asChild size="sm" variant="outline"><Link to="/builder" search={{ id: m.id }}><Pencil className="mr-1 h-3.5 w-3.5" />Edit</Link></Button>
                  {m.is_public && (
                    <Button asChild size="sm" variant="ghost"><Link to="/map/$id" params={{ id: m.id }}><ExternalLink className="mr-1 h-3.5 w-3.5" />View</Link></Button>
                  )}
                  <Button size="sm" variant="ghost" className="ml-auto text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDelete(m.id, m.title)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
