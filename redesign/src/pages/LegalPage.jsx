export function LegalPage({ title, updated, children }) {
  return (
    <article className="legal-page">
      <header className="legal-heading">
        <h1>{title}</h1>
        {updated ? <p className="legal-updated">Last updated: {updated}</p> : null}
      </header>
      <div className="legal-body">{children}</div>
    </article>
  );
}
