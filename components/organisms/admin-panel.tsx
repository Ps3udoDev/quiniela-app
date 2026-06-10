"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Check, Plus } from "lucide-react";
import { MATCHES, ROUNDS, type Match, type Team } from "@/lib/mock-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/atoms/status-badge";

function ResultRow({ match }: { match: Match }) {
  const [home, setHome] = useState("");
  const [away, setAway] = useState("");
  const [done, setDone] = useState(false);

  function finalize() {
    if (home === "" || away === "") {
      toast.error("Ingresa ambos marcadores");
      return;
    }
    setDone(true);
    toast.success("Partido finalizado", {
      description: `${match.home?.code} ${home} – ${away} ${match.away?.code} · puntos recalculados`,
    });
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 text-sm">
        <span>{match.home?.flag}</span>
        <span className="font-medium">{match.home?.code}</span>
        <span className="text-muted-foreground">vs</span>
        <span className="font-medium">{match.away?.code}</span>
        <span>{match.away?.flag}</span>
        <StatusBadge status={done ? "finished" : match.status} className="ml-2" />
      </div>
      <div className="flex items-center gap-2">
        <Input
          inputMode="numeric"
          value={home}
          onChange={(e) => setHome(e.target.value.replace(/\D/g, ""))}
          className="w-14 text-center"
          placeholder="0"
          disabled={done}
        />
        <span className="text-muted-foreground">:</span>
        <Input
          inputMode="numeric"
          value={away}
          onChange={(e) => setAway(e.target.value.replace(/\D/g, ""))}
          className="w-14 text-center"
          placeholder="0"
          disabled={done}
        />
        <Button
          size="sm"
          variant={done ? "secondary" : "default"}
          onClick={finalize}
          disabled={done}
        >
          {done ? <Check className="size-4" /> : "Finalizar"}
        </Button>
      </div>
    </div>
  );
}

export function AdminPanel() {
  const teams = useMemo(() => {
    const map = new Map<string, Team>();
    for (const m of MATCHES) {
      if (m.home) map.set(m.home.code, m.home);
      if (m.away) map.set(m.away.code, m.away);
    }
    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const openMatches = MATCHES.filter(
    (m) => m.status !== "finished" && m.home && m.away
  );

  const [draft, setDraft] = useState({
    home: "",
    away: "",
    round: "qf",
    kickoff: "",
  });

  function createMatch() {
    if (!draft.home || !draft.away || !draft.kickoff) {
      toast.error("Completa equipos y fecha");
      return;
    }
    if (draft.home === draft.away) {
      toast.error("Elige equipos distintos");
      return;
    }
    toast.success("Partido creado", {
      description: `${draft.home} vs ${draft.away} · ${draft.kickoff}`,
    });
    setDraft({ home: "", away: "", round: "qf", kickoff: "" });
  }

  return (
    <Tabs defaultValue="results" className="w-full">
      <TabsList>
        <TabsTrigger value="results">Cargar resultados</TabsTrigger>
        <TabsTrigger value="new">Nuevo partido</TabsTrigger>
      </TabsList>

      <TabsContent value="results" className="mt-6 flex flex-col gap-3">
        {openMatches.map((m) => (
          <ResultRow key={m.id} match={m} />
        ))}
      </TabsContent>

      <TabsContent value="new" className="mt-6">
        <div className="max-w-xl rounded-2xl border border-border bg-card p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label>Local</Label>
              <Select
                value={draft.home}
                onValueChange={(v) =>
                  setDraft((d) => ({ ...d, home: v ?? "" }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Equipo local" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((t) => (
                    <SelectItem key={t.code} value={t.code}>
                      {t.flag} {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Visitante</Label>
              <Select
                value={draft.away}
                onValueChange={(v) =>
                  setDraft((d) => ({ ...d, away: v ?? "" }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Equipo visitante" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((t) => (
                    <SelectItem key={t.code} value={t.code}>
                      {t.flag} {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Fase</Label>
              <Select
                value={draft.round}
                onValueChange={(v) =>
                  setDraft((d) => ({ ...d, round: v ?? "qf" }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROUNDS.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="kickoff">Fecha / hora</Label>
              <Input
                id="kickoff"
                placeholder="Sáb 14 · 15:00"
                value={draft.kickoff}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, kickoff: e.target.value }))
                }
              />
            </div>
          </div>
          <Button onClick={createMatch} className="mt-6 w-full">
            <Plus className="size-4" /> Crear partido
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
}
