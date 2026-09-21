"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

import { CountUp } from "./CountUp";
import { Reveal } from "./Reveal";
import { useEntrance } from "./useInView";
import {
  allIndustriesImage,
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

/** イラストの読み込み幅。実際に表示される大きさに合わせています。 */
const TILE_SIZES =
  "(max-width: 620px) 44vw, (max-width: 900px) 30vw, (max-width: 1200px) 22vw, 15vw";

export function ProjectRecords() {
  const [discipline, setDiscipline] = useState<DisciplineFilter>("all");
  const [industry, setIndustry] = useState<IndustryFilter>("all");
  const stats = useEntrance<HTMLDivElement>(0.3);

  const sectionRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  /*
   * 絞り込みバーは画面の上端に固定されるため、業種の見出しがその裏に
   * 隠れないよう、バーの高さを知っている必要があります。高さは画面幅に
   * よって変わるので、決め打ちにせず実測しています。
   */
  useEffect(() => {
    const section = sectionRef.current;
    const bar = barRef.current;
    if (!section || !bar) return;

    const measure = () => {
      section.style.setProperty("--filter-height", `${bar.offsetHeight}px`);
    };

    measure();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }

    const observer = new ResizeObserver(measure);
    observer.observe(bar);
    return () => observer.disconnect();
  }, []);

  /** 分野の絞り込みだけを反映した件数。業種タイルに出す数字です。 */
  const countsByIndustry = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const group of industries) {
      counts[group.id] = group.projects.filter(
        (project) => discipline === "all" || project.disciplines.includes(discipline),
      ).length;
    }
    return counts;
  }, [discipline]);

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
  const selectedIndustry = industries.find((group) => group.id === industry);

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
                開発実績
              </p>
              <h2 id="records-title" className={`display ${styles.title}`}>
                これまでの
                <br />
                開発実績です。
              </h2>
            </div>

            <div className={styles.headAside}>
              <p className="lead">
                {`${totalIndustries}の業種にわたる、${totalProjects}件の主な開発実績です。最初の要件定義のお打ち合わせから、納品後の運用・保守まで一貫して担当しています。`}
              </p>
              <p className={`mono ${styles.headHint}`}>
                分野または業種を選ぶと、絞り込めます
              </p>
            </div>
          </header>
        </Reveal>

        {/* 分野ごとの件数 ------------------------------------------------ */}
        <div
          ref={stats.ref}
          className={styles.stats}
          data-shown={stats.active ? "true" : "false"}
          role="group"
          aria-label="分野ごとの件数"
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
                style={{ "--share": caseCounts[key] / peakCount } as CSSProperties}
              >
                <span className={`mono ${styles.statIndex}`}>
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className={styles.statLabel}>{disciplineLabels[key]}</span>

                <span className={styles.statFigure}>
                  <span className={`display ${styles.statValue}`}>
                    <CountUp value={caseCounts[key]} />
                  </span>
                  <span className={`mono ${styles.statUnit}`}>件</span>
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
          {`${totalProjects}件の開発実績を、分野ごとに数えたものです。多くの案件は複数の分野にまたがるため、それぞれの分野に計上しています。`}
        </p>

        {/* 業種から探す -------------------------------------------------- */}
        <Reveal>
          <div className={styles.picker}>
            <p className={`mono ${styles.pickerLabel}`}>業種から探す</p>

            <div className={styles.tiles} role="group" aria-label="業種で絞り込む">
              <button
                type="button"
                className={styles.tile}
                data-active={industry === "all" ? "true" : "false"}
                aria-pressed={industry === "all"}
                onClick={() => setIndustry("all")}
              >
                <span className={styles.tileImage}>
                  <Image
                    src={allIndustriesImage}
                    alt=""
                    fill
                    sizes={TILE_SIZES}
                    placeholder="blur"
                  />
                </span>
                <span className={styles.tileMeta}>
                  <span className={styles.tileName}>すべての業種</span>
                  <span className={`mono ${styles.tileCount}`}>
                    {shownAll(countsByIndustry)}件
                  </span>
                </span>
              </button>

              {industries.map((group) => {
                const count = countsByIndustry[group.id];
                const isActive = industry === group.id;

                return (
                  <button
                    key={group.id}
                    type="button"
                    className={styles.tile}
                    data-active={isActive ? "true" : "false"}
                    data-empty={count === 0 ? "true" : "false"}
                    aria-pressed={isActive}
                    onClick={() => setIndustry(isActive ? "all" : group.id)}
                  >
                    <span className={styles.tileImage}>
                      <Image
                        src={group.image}
                        alt=""
                        fill
                        sizes={TILE_SIZES}
                        placeholder="blur"
                      />
                    </span>
                    <span className={styles.tileMeta}>
                      <span className={styles.tileName}>{group.name}</span>
                      <span className={`mono ${styles.tileCount}`}>{count}件</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>

      {/* 絞り込みバー ---------------------------------------------------- */}
      <div ref={barRef} className={styles.filterBar}>
        <div className={`shell ${styles.filterInner}`}>
          <div className={styles.filterGroup}>
            <span className={`mono ${styles.filterLegend}`}>分野</span>
            <div
              className={styles.segmented}
              role="group"
              aria-label="分野で絞り込む"
            >
              <button
                type="button"
                className={styles.segment}
                data-active={discipline === "all" ? "true" : "false"}
                aria-pressed={discipline === "all"}
                onClick={() => setDiscipline("all")}
              >
                すべて
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

          {selectedIndustry ? (
            <button
              type="button"
              className={styles.selected}
              onClick={() => setIndustry("all")}
              aria-label={`業種の絞り込み「${selectedIndustry.name}」を解除する`}
            >
              <span className={styles.selectedThumb} aria-hidden="true">
                <Image
                  src={selectedIndustry.image}
                  alt=""
                  fill
                  sizes="28px"
                  placeholder="blur"
                />
              </span>
              <span className={styles.selectedName}>{selectedIndustry.name}</span>
              <span className={styles.selectedClear} aria-hidden="true">
                ×
              </span>
            </button>
          ) : null}

          <p className={`mono ${styles.count}`} role="status">
            <span className={styles.countValue}>
              {String(shown).padStart(2, "0")}
            </span>
            {/* 画面が狭いときは表記を短くし、バーが収まるようにしています。 */}
            <span className={`${styles.countLabel} ${styles.countLong}`}>
              件（全{totalProjects}件）
            </span>
            <span className={`${styles.countLabel} ${styles.countShort}`}>
              / {totalProjects}
            </span>
            {isFiltered ? (
              <button type="button" className={styles.reset} onClick={resetFilters}>
                解除
              </button>
            ) : null}
          </p>
        </div>
      </div>

      {/* 一覧 ------------------------------------------------------------ */}
      <div className="shell">
        {groups.length === 0 ? (
          <p className={styles.empty}>
            条件に一致する開発実績はありません。別の業種をお選びください。
          </p>
        ) : (
          <div className={styles.groups}>
            {groups.map((group, groupIndex) => (
              <Reveal key={group.id} delay={Math.min(groupIndex, 4) * 60}>
                <article className={styles.group}>
                  <header className={styles.groupHead}>
                    <span className={styles.groupImage}>
                      <Image
                        src={group.image}
                        alt=""
                        fill
                        sizes="(max-width: 1080px) 72px, 104px"
                        placeholder="blur"
                      />
                    </span>
                    <h3 className={`display ${styles.groupTitle}`}>{group.name}</h3>
                    <p className={styles.groupNote}>{group.note}</p>
                    <span className={`mono ${styles.groupCount}`}>
                      {String(group.projects.length).padStart(2, "0")}件
                    </span>
                  </header>

                  <ol className={styles.rows}>
                    {group.projects.map((project) => (
                      <li key={project.id} className={styles.row}>
                        <span className={`mono ${styles.rowIndex}`}>{project.id}</span>

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

/** 「すべての業種」タイルに出す、分野の絞り込みを反映した合計件数。 */
function shownAll(counts: Record<string, number>): number {
  return Object.values(counts).reduce((total, count) => total + count, 0);
}
