"use client";

import { useEffect, useState } from "react";
import {
  getSoccerMatches,
  getNBAGames,
  getSoccerAverages,
  getNBAAverages,
} from "@/lib/api";
import { Match, SoccerAverages, NBAaverages } from "@/lib/types";
import MatchCard from "@/componets/MatchCatd";
import StatsPanel from "@/componets/StatsPanel";

export default function Home() {
  const [sport, setSport] = useState<"soccer" | "nba">("soccer");
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [homeAverages, setHomeAverages] = useState<
    SoccerAverages | NBAaverages | null
  >(null);
  const [awayAverages, setAwayAverages] = useState<
    SoccerAverages | NBAaverages | null
  >(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMatches();
    setSelectedMatch(null);
    setHomeAverages(null);
    setAwayAverages(null);
  }, [sport]);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const data =
        sport === "soccer" ? await getSoccerMatches() : await getNBAGames();
      setMatches(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMatchClick = async (match: Match) => {
    setSelectedMatch(match);
    try {
      if (sport === "soccer") {
        const [home, away] = await Promise.all([
          getSoccerAverages(match.home_team_id),
          getSoccerAverages(match.away_team_id),
        ]);
        setHomeAverages(home);
        setAwayAverages(away);
      } else {
        const [home, away] = await Promise.all([
          getNBAAverages(match.home_team_id),
          getNBAAverages(match.away_team_id),
        ]);
        setHomeAverages(home);
        setAwayAverages(away);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-blue-400">⚡ SportsPulse</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setSport("soccer")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              sport === "soccer"
                ? "bg-blue-500 text-white"
                : "text-gray-400 hover:text-white"
            }`}
            style={sport !== "soccer" ? { backgroundColor: "var(--card)" } : {}}
          >
            ⚽ Soccer
          </button>
          <button
            onClick={() => setSport("nba")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              sport === "nba"
                ? "bg-blue-500 text-white"
                : "text-gray-400 hover:text-white"
            }`}
            style={sport !== "nba" ? { backgroundColor: "var(--card)" } : {}}
          >
            🏀 NBA
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Matches List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">
              {sport === "soccer" ? "⚽ Live Matches" : "🏀 Today's Games"}
            </h2>
            <button
              onClick={fetchMatches}
              className="text-xs px-3 py-1 rounded-lg hover:text-white transition-all"
              style={{ backgroundColor: "var(--card)", color: "var(--muted)" }}
            >
              ↻ Refresh
            </button>
          </div>

          {loading ? (
            <div
              className="text-center py-12"
              style={{ color: "var(--muted)" }}
            >
              Loading matches...
            </div>
          ) : matches.length === 0 ? (
            <div
              className="text-center py-12"
              style={{ color: "var(--muted)" }}
            >
              No matches right now
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {matches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onClick={handleMatchClick}
                />
              ))}
            </div>
          )}
        </div>

        {/* Stats Panel */}
        <div>
          <h2 className="font-semibold text-lg mb-4">
            📊 Last 5 Games Averages
          </h2>
          {!selectedMatch ? (
            <div
              className="rounded-xl p-8 border text-center"
              style={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
                color: "var(--muted)",
              }}
            >
              Click a match to see team averages
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <StatsPanel
                sport={sport}
                teamName={selectedMatch.home_team}
                averages={homeAverages}
              />
              <StatsPanel
                sport={sport}
                teamName={selectedMatch.away_team}
                averages={awayAverages}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
