"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

import { CountUp } from "./CountUp";
import { Reveal } from "./Reveal";
import { useEntrance } from "./useInView";
import {
  caseCounts,
  disciplineLabels,
  disciplineNotes,
  disciplineOrder,
  disciplineShortLabels,
  industries,
  totalIndustries,
  totalProjects,
  type Discipline,
} from "@/data/projects";

import styles from "./ProjectRecords.module.css";

type DisciplineFilter = Discipline | "all";
type IndustryFilter = string | "all";

const peakCount = Math.max(...disciplineOrder.map((d) => caseCounts[d]));

export function ProjectRecords() {
  const [discipline, setDiscipline] = useState<DisciplineFilter>("all");
  const [industry, setIndustry] = useState<IndustryFilter>("all");
  const stats = useEntrance<HTMLDivElement>(0.3);

  const sectionRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);

  /*
   * The filter bar sticks to the top of the viewport, so the industry headings
   * need to know how tall it is in order to sit below it rather than behind it.
   * Its height changes with the viewport, so it is measured rather than guessed.
   */
  useEffect(() => {
    const section = sectionRef.current;
    const bar = barRef.current;
    const chips = chipsRef.current;
    if (!section || !bar || !chips) return;

    const measure = () => {
      section.style.setProperty("--filter-height", `${bar.offsetHeight}px`);
      chips.dataset.overflow =
        chips.scrollWidth > chips.clientWidth + 1 ? "true" : "false";
    };

    measure();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }

    const observer = new ResizeObserver(measure);
    observer.observe(bar);
    observer.observe(chips);
    return () => observer.disconnect();
  }, []);

  const groups = useMemo(() => {
    return industries
      .filter((group) => industry === "all" || group.id === industry)
      .map((group) => ({
        ...group,
        projects: group.projects.filter(
          (project) =>
            discipline === "all" || project.disciplines.includes(discipline),
        ),
      }))
      .filter((group) => group.projects.length > 0);
  }, [discipline, industry]);

  const shown = groups.reduce((total, group) => total + group.projects.length, 0);
  const isFiltered = discipline !== "all" || industry !== "all";

  const resetFilters = () => {
    setDiscipline("all");
    setIndustry("all");
  };

  return (
    <section
      ref={sectionRef}
      id="project-records"
      className={styles.section}
      aria-labelledby="records-title"
    >
      <div className="shell">
        <Reveal>
          <header className={styles.head}>
            <div>
              <p className={`mono ${styles.kicker}`}>
                <span className={styles.kickerNum}>01</span>
                Project records
              </p>
              <h2 id="records-title" className={`display ${styles.title}`}>
                A record of
                <br />
                work delivered.
              </h2>
            </div>

            <div className={styles.headAside}>
              <p className="lead">
                {totalProjects} flagship engagements across {totalIndustries}{" "}
                industries, from the first requirements meeting through to the
                handover and the years of quiet maintenance that follow.
              </p>
              <p className={`mono ${styles.headHint}`}>
                Select a discipline or an industry to narrow the list
              </p>
            </div>
          </header>
        </Reveal>

        {/* Case counts ------------------------------------------------- */}
        <div
          ref={stats.ref}
          className={styles.stats}
          data-shown={stats.active ? "true" : "false"}
          role="group"
          aria-label="Case counts by discipline"
        >
          {disciplineOrder.map((key, index) => {
            const isActive = discipline === key;

            return (
              <button
                key={key}
                type="button"
                className={styles.stat}
                data-active={isActive ? "true" : "false"}
                aria-pressed={isActive}
                onClick={() => setDiscipline(isActive ? "all" : key)}
                style={
                  { "--share": caseCounts[key] / peakCount } as CSSProperties
                }
              >
                <span className={`mono ${styles.statIndex}`}>
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className={styles.statLabel}>{disciplineLabels[key]}</span>

                <span className={styles.statFigure}>
                  <span className={`display ${styles.statValue}`}>
                    <CountUp value={caseCounts[key]} />
                  </span>
                  <span className={`mono ${styles.statUnit}`}>cases</span>
                </span>

                <span className={styles.meter} aria-hidden="true">
                  <span className={styles.meterFill} />
                </span>

                <span className={styles.statNote}>{disciplineNotes[key]}</span>
              </button>
            );
          })}
        </div>

        <p className={styles.statsNote}>
          Counted by discipline across {totalProjects} flagship engagements. Most
          projects draw on more than one, so they are recorded under each.
        </p>
      </div>

      {/* Filters ------------------------------------------------------- */}
      <div ref={barRef} className={styles.filterBar}>
        <div className={`shell ${styles.filterInner}`}>
          <div className={styles.filterRow}>
            <div className={styles.filterGroup}>
              <span className={`mono ${styles.filterLegend}`}>Discipline</span>
              <div
                className={styles.segmented}
                role="group"
                aria-label="Filter the records by discipline"
              >
                <button
                  type="button"
                  className={styles.segment}
                  data-active={discipline === "all" ? "true" : "false"}
                  aria-pressed={discipline === "all"}
                  onClick={() => setDiscipline("all")}
                >
                  All
                </button>
                {disciplineOrder.map((key) => (
                  <button
                    key={key}
                    type="button"
                    className={styles.segment}
                    data-active={discipline === key ? "true" : "false"}
                    aria-pressed={discipline === key}
                    onClick={() => setDiscipline(key)}
                  >
                    {disciplineShortLabels[key]}
                  </button>
                ))}
              </div>
            </div>

            <p className={`mono ${styles.count}`} role="status">
              <span className={styles.countValue}>
                {String(shown).padStart(2, "0")}
              </span>
              {/* The wording shortens on narrow screens so the bar stays two rows. */}
              <span className={`${styles.countLabel} ${styles.countLong}`}>
                of {totalProjects} shown
              </span>
              <span className={`${styles.countLabel} ${styles.countShort}`}>
                / {totalProjects}
              </span>
              {isFiltered ? (
                <button type="button" className={styles.reset} onClick={resetFilters}>
                  Clear
                </button>
              ) : null}
            </p>
          </div>

          <div className={`${styles.filterRow} ${styles.filterRowWide}`}>
            <span className={`mono ${styles.filterLegend}`}>Industry</span>
            <div
              ref={chipsRef}
              className={styles.chips}
              data-overflow="false"
              role="group"
              aria-label="Filter the records by industry"
            >
              <button
                type="button"
                className={styles.chip}
                data-active={industry === "all" ? "true" : "false"}
                aria-pressed={industry === "all"}
                onClick={() => setIndustry("all")}
              >
                All industries
              </button>
              {industries.map((group) => (
                <button
                  key={group.id}
                  type="button"
                  className={styles.chip}
                  data-active={industry === group.id ? "true" : "false"}
                  aria-pressed={industry === group.id}
                  onClick={() => setIndustry(group.id)}
                >
                  {group.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Records ------------------------------------------------------- */}
      <div className="shell">
        {groups.length === 0 ? (
          <p className={styles.empty}>
            No engagements match that combination. Please try another industry.
          </p>
        ) : (
          <div className={styles.groups}>
            {groups.map((group, groupIndex) => (
              <Reveal key={group.id} delay={Math.min(groupIndex, 4) * 60}>
                <article className={styles.group}>
                  <header className={styles.groupHead}>
                    <h3 className={`display ${styles.groupTitle}`}>{group.name}</h3>
                    <p className={styles.groupNote}>{group.note}</p>
                    <span className={`mono ${styles.groupCount}`}>
                      {String(group.projects.length).padStart(2, "0")}{" "}
                      {group.projects.length === 1 ? "record" : "records"}
                    </span>
                  </header>

                  <ol className={styles.rows}>
                    {group.projects.map((project) => (
                      <li key={project.id} className={styles.row}>
                        <span className={`mono ${styles.rowIndex}`}>
                          {project.id}
                        </span>

                        <div className={styles.rowBody}>
                          <h4 className={`display ${styles.rowTitle}`}>
                            {project.title}
                          </h4>
                          <ul className={styles.caps}>
                            {project.capabilities.map((capability) => (
                              <li key={capability} className={styles.cap}>
                                {capability}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <ul className={styles.rowTags}>
                          {disciplineOrder
                            .filter((key) => project.disciplines.includes(key))
                            .map((key) => (
                              <li
                                key={key}
                                className={`mono ${styles.tag}`}
                                data-discipline={key}
                              >
                                {disciplineShortLabels[key]}
                                <span className="u-sr-only">
                                  {" "}
                                  {disciplineLabels[key]}
                                </span>
                              </li>
                            ))}
                        </ul>
                      </li>
                    ))}
                  </ol>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
