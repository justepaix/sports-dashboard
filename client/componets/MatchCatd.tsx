"use client";

import { Match } from "@/lib/types";

interface Props {
  match: Match;
  onClick: (match: Match) => void;
}

export default function MatchCard({ match, onClick }: Props) {
  const isLive = !match.status.includes("2026") && match.status !== "FT";

  return (
    <div
      onClick={() => onClick(match)}
      className="cursor-pointer rounded-xl p-4 border transition-all hover:border-blue-500"
      style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
    >
      {/* League + Status */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs" style={{ color: "var(--muted)" }}>
          {match.league}
        </span>
        {isLive ? (
          <span className="text-xs font-bold text-red-500 animate-pulse">
            ● LIVE {match.status}
          </span>
        ) : (
          <span className="text-xs" style={{ color: "var(--muted)" }}>
            {new Date(match.status).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        )}
      </div>

      {/* Teams + Score */}
      <div className="flex items-center justify-between gap-2">
        {/* Home */}
        <div className="flex flex-col items-center gap-1 flex-1">
          {match.home_logo && (
            <img
              src={match.home_logo}
              alt={match.home_team}
              className="w-8 h-8 object-contain"
            />
          )}
          <span className="text-sm font-medium text-center">
            {match.home_team}
          </span>
        </div>

        {/* Score */}
        <div className="flex items-center gap-2 px-3">
          <span className="text-2xl font-bold">{match.home_score ?? "-"}</span>
          <span style={{ color: "var(--muted)" }}>:</span>
          <span className="text-2xl font-bold">{match.away_score ?? "-"}</span>
        </div>

        {/* Away */}
        <div className="flex flex-col items-center gap-1 flex-1">
          {match.away_logo && (
            <img
              src={match.away_logo}
              alt={match.away_team}
              className="w-8 h-8 object-contain"
            />
          )}
          <span className="text-sm font-medium text-center">
            {match.away_team}
          </span>
        </div>
      </div>
    </div>
  );
}
