"use client";

import { SoccerAverages, NBAaverages } from "@/lib/types";

interface Props {
  sport: "soccer" | "nba";
  teamName: string;
  averages: SoccerAverages | NBAaverages | null;
  logo?: string;
}

export default function StatsPanel({ sport, teamName, averages, logo }: Props) {
  const stats = !averages
    ? []
    : sport === "soccer"
      ? [
          {
            label: "Goals",
            value: (averages as SoccerAverages).avg_goals,
            unit: "",
          },
          {
            label: "Corners",
            value: (averages as SoccerAverages).avg_corners,
            unit: "",
          },
          {
            label: "Yellow Cards",
            value: (averages as SoccerAverages).avg_yellow_cards,
            unit: "",
          },
          {
            label: "Red Cards",
            value: (averages as SoccerAverages).avg_red_cards,
            unit: "",
          },
          {
            label: "Possession",
            value: (averages as SoccerAverages).avg_possession,
            unit: "%",
          },
          {
            label: "Shots on Target",
            value: (averages as SoccerAverages).avg_shots_on_target,
            unit: "",
          },
        ]
      : [
          {
            label: "Points",
            value: (averages as NBAaverages).avg_points,
            unit: "",
          },
          {
            label: "Rebounds",
            value: (averages as NBAaverages).avg_rebounds,
            unit: "",
          },
          {
            label: "Assists",
            value: (averages as NBAaverages).avg_assists,
            unit: "",
          },
          {
            label: "FG%",
            value: (averages as NBAaverages).avg_fg_percentage,
            unit: "%",
          },
          {
            label: "3PT%",
            value: (averages as NBAaverages).avg_three_point_percentage,
            unit: "%",
          },
          {
            label: "Turnovers",
            value: (averages as NBAaverages).avg_turnovers,
            unit: "",
          },
        ];

  return (
    <div
      className="animate-fade-in"
      style={{
        backgroundColor: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      {/* Team Header */}
      <div
        style={{
          padding: "14px 20px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          background: "linear-gradient(135deg, var(--card-hover), var(--card))",
        }}
      >
        {logo && (
          <img
            src={logo}
            alt=""
            style={{ width: "32px", height: "32px", objectFit: "contain" }}
          />
        )}
        <div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "18px",
              fontWeight: 700,
              letterSpacing: "0.03em",
            }}
          >
            {teamName}
          </div>
          <div
            style={{
              fontSize: "11px",
              color: "var(--muted-bright)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Last 5 Games Average
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          padding: "16px",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "10px",
        }}
      >
        {!averages ? (
          <div
            style={{
              gridColumn: "span 3",
              textAlign: "center",
              padding: "24px",
              color: "var(--muted)",
            }}
          >
            No stats available yet
          </div>
        ) : (
          stats.map((stat) => (
            <div
              key={stat.label}
              style={{
                backgroundColor: "var(--surface)",
                borderRadius: "8px",
                padding: "12px",
                border: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--muted-bright)",
                  marginBottom: "6px",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {stat.label}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "26px",
                  fontWeight: 800,
                  color: "var(--accent)",
                  lineHeight: 1,
                }}
              >
                {stat.value ?? "—"}
                {stat.value ? stat.unit : ""}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
