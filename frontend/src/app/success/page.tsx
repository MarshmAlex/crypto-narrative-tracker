export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-surface-900 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold text-white mb-3">Bienvenue sur GeniBiz Pro !</h1>
        <p className="text-slate-400 mb-8">
          Tu as maintenant accès à toutes les narratives crypto, les performances 7j détaillées et les alertes en temps réel.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-colors"
        >
          Voir les narratives →
        </a>
      </div>
    </main>
  );
}
