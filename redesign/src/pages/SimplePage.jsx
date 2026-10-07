export function SimplePage({ title, children }) {
  return (
    <article className="case-page">
      <h1>{title}</h1>
      {children}
    </article>
  );
}
