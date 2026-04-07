// components/Footer.tsx
export default function Footer({ theme }: { theme: "light" | "dark" }) {
  const isDark = theme === "dark";

  return (
    <footer
      style={{
        textAlign: "center",
        padding: "20px 16px 28px",
        fontSize: "0.78rem",
        letterSpacing: "0.06em",
        color: isDark ? "rgba(232,230,240,0.35)" : "rgba(26,24,37,0.35)",
        fontFamily: "'Palatino Linotype', Palatino, 'Book Antiqua', serif",
        userSelect: "none",
      }}
    >
      made with{" "}
      <span
        style={{
          color: "#e05c5c",
          display: "inline-block",
          animation: "heartbeat 1.6s ease-in-out infinite",
        }}
      >
        ♥
      </span>{" "}
      by Yassine
      <style>{`
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          14%       { transform: scale(1.25); }
          28%       { transform: scale(1); }
          42%       { transform: scale(1.15); }
          70%       { transform: scale(1); }
        }
      `}</style>
    </footer>
  );
}