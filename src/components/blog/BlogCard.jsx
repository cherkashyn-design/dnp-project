import arrowRightIcon from "../../assets/icons/arrow-right-icon.svg";
import linkIcon from "../../assets/icons/link-icon.svg";

export function BlogCard({ post }) {
  return (
    <article className="blog-card">
      <a
        className="blog-card-link"
        href={post.href}
        target="_blank"
        rel="noreferrer"
      >
        <div className="blog-card-cover" aria-hidden="true">
          <span className="blog-card-cover-label">{post.tags[0]}</span>
        </div>
        <div className="blog-card-body">
          <div className="blog-card-meta">
            <time dateTime={post.publishedAt}>{post.publishedLabel}</time>
            <span className="blog-card-meta-dot" aria-hidden="true" />
            <span>Medium</span>
          </div>
          <div className="blog-card-title-row">
            <img className="blog-card-hover-arrow" src={arrowRightIcon} alt="" aria-hidden="true" />
            <h2>{post.title}</h2>
          </div>
          <p className="blog-card-excerpt">{post.excerpt}</p>
          <ul className="blog-card-tags" aria-label={`${post.title} topics`}>
            {post.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
          <span className="blog-card-external">
            Read on Medium
            <img src={linkIcon} alt="" aria-hidden="true" />
          </span>
        </div>
      </a>
    </article>
  );
}
