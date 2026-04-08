"use client";

import { SoccerAverages, NBAaverages } from "@/lib/types";

interface Props {
  sport: "soccer" | "nba";
  teamName: string;
  averages: SoccerAverages | NBAaverages | null;
}

export default function StatsPanel({ sport, teamName, averages }: Props) {
  if (!averages)
    return (
      <div className="text-center py-8" style={{ color: "var(--muted)" }}>
        No stats available yet
      </div>
    );

  const stats =
    sport === "soccer"
      ? [
          { label: "Avg Goals", value: (averages as SoccerAverages).avg_goals },
          {
            label: "Avg Corners",
            value: (averages as SoccerAverages).avg_corners,
          },
          {
            label: "Avg Yellow Cards",
            value: (averages as SoccerAverages).avg_yellow_cards,
          },
          {
            label: "Avg Red Cards",
            value: (averages as SoccerAverages).avg_red_cards,
          },
          {
            label: "Avg Possession %",
            value: (averages as SoccerAverages).avg_possession,
          },
          {
            label: "Avg Shots on Target",
            value: (averages as SoccerAverages).avg_shots_on_target,
          },
        ]
      : [
          { label: "Avg Points", value: (averages as NBAaverages).avg_points },
          {
            label: "Avg Rebounds",
            value: (averages as NBAaverages).avg_rebounds,
          },
          {
            label: "Avg Assists",
            value: (averages as NBAaverages).avg_assists,
          },
          {
            label: "Avg FG %",
            value: (averages as NBAaverages).avg_fg_percentage,
          },
          {
            label: "Avg 3PT %",
            value: (averages as NBAaverages).avg_three_point_percentage,
          },
          {
            label: "Avg Turnovers",
            value: (averages as NBAaverages).avg_turnovers,
          },
        ];

  return (
    <div
      className="rounded-xl p-4 border"
      style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
    >
      <h3 className="font-bold mb-4 text-blue-400">
        {teamName} — Last 5 Games
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg p-3"
            style={{ backgroundColor: "var(--background)" }}
          >
            <div className="text-xs mb-1" style={{ color: "var(--muted)" }}>
              {stat.label}
            </div>
            <div className="text-xl font-bold text-blue-400">
              {stat.value ?? "N/A"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
