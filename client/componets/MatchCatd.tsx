"use client";

import { Match } from "@/lib/types";

interface Props {
  match: Match;
  onClick: (match: Match) => void;
  isSelected?: boolean;
}

export default function MatchCard({ match, onClick, isSelected }: Props) {
  const isLive = !match.status.includes("2026") && match.status !== "FT";

  const getTime = () => {
    if (isLive) return match.status;
    try {
      return new Date(match.status).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return match.status;
    }
  };

  return (
    <div
      onClick={() => onClick(match)}
      className="animate-slide-up"
      style={{
        backgroundColor: isSelected ? "var(--card-hover)" : "var(--card)",
        border: `1px solid ${isSelected ? "var(--accent)" : "var(--border)"}`,
        borderRadius: "12px",
        padding: "16px 20px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: isSelected
          ? "0 0 0 1px var(--accent), 0 4px 24px var(--accent-glow)"
          : "none",
      }}
      onMouseEnter={(e) => {
        if (!isSelected)
          (e.currentTarget as HTMLElement).style.borderColor =
            "var(--border-bright)";
      }}
      onMouseLeave={(e) => {
        if (!isSelected)
          (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
      }}
    >
      {/* Top row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "14px",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.1em",
            color: "var(--muted-bright)",
            textTransform: "uppercase",
          }}
        >
          {match.league}
        </span>

        {isLive ? (
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              className="animate-pulse-live"
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "var(--live)",
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "12px",
                fontWeight: 700,
                color: "var(--live)",
                letterSpacing: "0.05em",
              }}
            >
              LIVE {match.status}
            </span>
          </div>
        ) : (
          <span
            style={{
              fontSize: "12px",
              color: "var(--muted)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {getTime()}
          </span>
        )}
      </div>

      {/* Teams + Score */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Home */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          {match.home_logo && (
            <img
              src={match.home_logo}
              alt=""
              style={{ width: "28px", height: "28px", objectFit: "contain" }}
            />
          )}
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "17px",
              fontWeight: 700,
              letterSpacing: "0.02em",
            }}
          >
            {match.home_team}
          </span>
        </div>

        {/* Score */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "var(--surface)",
            borderRadius: "8px",
            padding: "6px 14px",
            border: "1px solid var(--border)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "22px",
              fontWeight: 800,
              letterSpacing: "0.02em",
            }}
          >
            {match.home_score ?? "-"}
          </span>
          <span style={{ color: "var(--muted)", fontSize: "14px" }}>–</span>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "22px",
              fontWeight: 800,
              letterSpacing: "0.02em",
            }}
          >
            {match.away_score ?? "-"}
          </span>
        </div>

        {/* Away */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            justifyContent: "flex-end",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "17px",
              fontWeight: 700,
              letterSpacing: "0.02em",
              textAlign: "right",
            }}
          >
            {match.away_team}
          </span>
          {match.away_logo && (
            <img
              src={match.away_logo}
              alt=""
              style={{ width: "28px", height: "28px", objectFit: "contain" }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
