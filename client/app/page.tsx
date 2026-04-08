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
  const [statsLoading, setStatsLoading] = useState(false);

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
    setStatsLoading(true);
    setHomeAverages(null);
    setAwayAverages(null);
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
    } finally {
      setStatsLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "32px 40px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "40px",
        }}
      >
        <div>
          <h1
            className="font-display"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "36px",
              fontWeight: 800,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              background: "linear-gradient(135deg, #fff 30%, var(--accent))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            ⚡ SportsPulse
          </h1>
          <p
            style={{
              fontSize: "13px",
              color: "var(--muted-bright)",
              marginTop: "2px",
            }}
          >
            Live scores · Team analytics
          </p>
        </div>

        {/* Sport Toggle */}
        <div
          style={{
            display: "flex",
            gap: "4px",
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            padding: "4px",
          }}
        >
          {(["soccer", "nba"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSport(s)}
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                padding: "8px 20px",
                borderRadius: "7px",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s ease",
                backgroundColor: sport === s ? "var(--accent)" : "transparent",
                color: sport === s ? "#fff" : "var(--muted-bright)",
                boxShadow:
                  sport === s ? "0 2px 12px var(--accent-glow)" : "none",
              }}
            >
              {s === "soccer" ? "⚽ Soccer" : "🏀 NBA"}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
          alignItems: "start",
        }}
      >
        {/* Matches Column */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "20px",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--muted-bright)",
              }}
            >
              {sport === "soccer" ? "⚽ Matches" : "🏀 Games"}
            </h2>
            <button
              onClick={fetchMatches}
              style={{
                fontSize: "12px",
                padding: "6px 14px",
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                color: "var(--muted-bright)",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "var(--border-bright)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "var(--border)")
              }
            >
              ↻ Refresh
            </button>
          </div>

          {loading ? (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    height: "90px",
                    borderRadius: "12px",
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    animation: "pulse-live 1.5s ease-in-out infinite",
                    opacity: 0.5,
                  }}
                />
              ))}
            </div>
          ) : matches.length === 0 ? (
            <div
              style={{
                padding: "48px 24px",
                textAlign: "center",
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                color: "var(--muted)",
              }}
            >
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>🏟️</div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "16px",
                  letterSpacing: "0.05em",
                }}
              >
                No matches right now
              </div>
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {matches.map((match, i) => (
                <div key={match.id} style={{ animationDelay: `${i * 0.05}s` }}>
                  <MatchCard
                    match={match}
                    onClick={handleMatchClick}
                    isSelected={selectedMatch?.id === match.id}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats Column */}
        <div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "20px",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--muted-bright)",
              marginBottom: "16px",
            }}
          >
            📊 Team Analytics
          </h2>

          {!selectedMatch ? (
            <div
              style={{
                padding: "48px 24px",
                textAlign: "center",
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                color: "var(--muted)",
              }}
            >
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>👆</div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "16px",
                  letterSpacing: "0.05em",
                }}
              >
                Select a match to view team analytics
              </div>
            </div>
          ) : statsLoading ? (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {[1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    height: "200px",
                    borderRadius: "12px",
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    opacity: 0.5,
                  }}
                />
              ))}
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <StatsPanel
                sport={sport}
                teamName={selectedMatch.home_team}
                averages={homeAverages}
                logo={selectedMatch.home_logo}
              />
              <StatsPanel
                sport={sport}
                teamName={selectedMatch.away_team}
                averages={awayAverages}
                logo={selectedMatch.away_logo}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
