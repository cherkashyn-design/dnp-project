import { useState } from "react";
import { ProgressiveImage } from "../media/ProgressiveImage.jsx";

export function ProfileTabsBlock({ id, title, description, tabs }) {
  const [activeId, setActiveId] = useState(tabs[0]?.id ?? null);
  const activeTab = tabs.find((tab) => tab.id === activeId) || tabs[0];

  if (!activeTab) {
    return null;
  }

  return (
    <section className="case-section case-profile-tabs" id={id}>
      <div className="profile-tabs-layout">
        <div className="profile-tabs-copy">
          <div className="section-heading-row section-heading-stack">
            <h2>{title}</h2>
            {description ? <p>{description}</p> : null}
          </div>
          <div className="profile-tabs-list" role="tablist" aria-label={`${title} views`}>
            {tabs.map((tab) => {
              const selected = tab.id === activeTab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  id={`${tab.id}-tab`}
                  aria-selected={selected}
                  aria-controls={`${tab.id}-panel`}
                  className={["profile-tab", selected ? "is-active" : ""].filter(Boolean).join(" ")}
                  onClick={() => setActiveId(tab.id)}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <figure
          className="case-media-block profile-tabs-media"
          id={activeTab.id}
          role="tabpanel"
          aria-labelledby={`${activeTab.id}-tab`}
        >
          <div className="case-media case-media-wide">
            <ProgressiveImage src={activeTab.src} alt={activeTab.label} fill />
          </div>
          {activeTab.caption ? <figcaption>{activeTab.caption}</figcaption> : null}
        </figure>
      </div>
    </section>
  );
}
