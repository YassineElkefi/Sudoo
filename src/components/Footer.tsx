export default function Footer({ theme }: { theme: "light" | "dark" }) {
  const isDark = theme === "dark";

  return (
    <footer
      className="relative z-10 w-full py-4 text-center border-t"
      style={{
        borderColor: isDark ? "#2a2835" : "#d6d3cc",
        background: isDark ? "#0f0f17" : "#f2f0eb",
      }}
    >
      <p
        className="text-xs"
        style={{
          color: isDark ? "#a8a5b5" : "#6b7280",
        }}
      >
        made by{" "}
        <span className="font-semibold text-indigo-400">Yassine</span>{" "}
        with <span className="text-red-500">♥</span>
      </p>
    </footer>
  );
}