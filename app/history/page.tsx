import Link from "next/link";
import { HistoryDashboard } from "../components/history-dashboard";

export default function HistoryPage() {
  return (
    <main className="shell">
      <nav className="topbar" aria-label="Main navigation">
        <Link className="brand" href="/">
          Visitor
        </Link>
        <Link className="navLink" href="/">
          Capture
        </Link>
      </nav>

      <section className="historyBand">
        <div className="sectionHeader">
          <p className="eyebrow">Admin</p>
          <h1>Visit history</h1>
        </div>
        <HistoryDashboard />
      </section>
    </main>
  );
}
