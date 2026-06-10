"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ROUNDS, matchesByRound } from "@/lib/mock-data";
import { PredictionCard } from "@/components/molecules/prediction-card";

export function MatchBoard() {
  return (
    <Tabs defaultValue="r16" className="w-full">
      <TabsList className="mb-2">
        {ROUNDS.map((r) => (
          <TabsTrigger key={r.id} value={r.id}>
            {r.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {ROUNDS.map((r) => (
        <TabsContent key={r.id} value={r.id} className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {matchesByRound(r.id).map((m) => (
              <PredictionCard key={m.id} match={m} />
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
