import type { ReactNode } from "react";

import { story } from "@/data/story";

import s from "./Scene.module.css";
import { Draw, Figure, Heart, M, Scene, Tag, cheer, cx, fx } from "./kit";

const { labels } = story;

/** 親のボードから、子どものノートへ飛んでいく「教わったこと」。 */
function Lesson({ at, from, children }: { at: number; from: number; children: ReactNode }) {
  return (
    <M k="out" a={at + 0.1} b={at + 0.13}>
      <M k="in" a={at} b={at + 0.12} dx={from} dy={26}>
        {children}
      </M>
    </M>
  );
}

/** 第5章：母からデザインを、父からシステムを、並んで教わる。 */
export function Lessons() {
  return (
    <Scene>
      {/* 母の画板：デザイン */}
      <M k="in" a={0} b={0.08} dy={24}>
        <path className={s.line} d="M 252 462 L 236 660 M 352 462 L 368 660 M 302 262 V 244" />
        <rect className={s.paper} x={212} y={262} width={180} height={200} rx={8} />
        <text className={cx(s.text, s.code, s.mute)} x={302} y={230} fontSize={13}>
          {labels.design}
        </text>
      </M>
      <M k="pop" a={0.06} b={0.12}>
        <circle className={s.ink} cx={242} cy={294} r={13} />
      </M>
      <M k="pop" a={0.09} b={0.15}>
        <circle className={cx(s.toneDark, s.line, s.thin)} cx={276} cy={294} r={13} />
      </M>
      <M k="pop" a={0.12} b={0.18}>
        <circle className={cx(s.paper, s.thin)} cx={310} cy={294} r={13} />
      </M>
      <M k="in" a={0.14} b={0.2} dy={10}>
        <text className={cx(s.text, s.sign)} x={356} y={296} fontSize={30}>
          Aa
        </text>
      </M>
      <M k="in" a={0.17} b={0.24} dy={10}>
        <rect className={cx(s.paper, s.thin)} x={230} y={326} width={144} height={66} rx={6} />
        <rect className={s.ink} x={240} y={336} width={60} height={10} rx={3} />
        <path className={cx(s.line, s.thin, s.soft)} d="M 240 358 H 330 M 240 372 H 304" />
        <rect className={s.ink} x={322} y={368} width={42} height={14} rx={7} />
      </M>
      <Draw a={0.22} b={0.3} className={s.thin} d="M 238 440 C 262 404 300 452 368 414" />
      <M k="pop" a={0.28} b={0.33}>
        <rect className={cx(s.paper, s.thin)} x={231} y={434} width={12} height={12} />
        <rect className={cx(s.paper, s.thin)} x={362} y={408} width={12} height={12} />
      </M>

      {/* 父の白板：システム */}
      <M k="in" a={0.36} b={0.44} dy={24}>
        <path className={s.line} d="M 848 462 L 832 660 M 948 462 L 964 660 M 898 262 V 244" />
        <rect className={s.paper} x={808} y={262} width={180} height={200} rx={8} />
        <text className={cx(s.text, s.code, s.mute)} x={898} y={230} fontSize={13}>
          {labels.system}
        </text>
      </M>
      <M k="pop" a={0.42} b={0.48}>
        <rect className={cx(s.paper, s.thin)} x={826} y={282} width={58} height={30} rx={5} />
      </M>
      <Draw a={0.46} b={0.5} className={s.thin} d="M 884 297 H 910 M 903 290 L 911 297 L 903 304" />
      <M k="pop" a={0.48} b={0.54}>
        <rect className={s.ink} x={912} y={282} width={58} height={30} rx={5} />
      </M>
      <Draw a={0.52} b={0.56} className={s.thin} d="M 941 312 V 340 M 934 333 L 941 341 L 948 333" />
      <M k="pop" a={0.55} b={0.61}>
        <path className={cx(s.paper, s.thin)} d="M 918 352 v 32 a 23 8 0 0 0 46 0 v -32" />
        <ellipse className={cx(s.paper, s.thin)} cx={941} cy={352} rx={23} ry={8} />
        <path className={cx(s.line, s.hair)} d="M 918 368 a 23 8 0 0 0 46 0" />
      </M>
      <M k="in" a={0.5} b={0.57} dy={10}>
        <text className={cx(s.text, s.code)} x={856} y={366} fontSize={36}>
          {"{ }"}
        </text>
      </M>
      <Draw a={0.6} b={0.66} className={cx(s.thin, s.soft)} d="M 828 420 H 900 M 842 436 H 938 M 828 452 H 884" />

      {/* 子どものノート。教わるほど、二本の目盛りが伸びていきます。 */}
      <M k="pop" a={0.02} b={0.09}>
        <path
          className={s.paper}
          d="M 524 300 H 676 a 12 12 0 0 1 12 12 v 78 a 12 12 0 0 1 -12 12 H 614 l -14 18 l -14 -18 H 524 a 12 12 0 0 1 -12 -12 v -78 a 12 12 0 0 1 12 -12 Z"
        />
        <text className={cx(s.text, s.start)} x={526} y={333} fontSize={14}>
          {labels.skills[0]}
        </text>
        <rect className={cx(s.paper, s.thin)} x={598} y={326} width={76} height={13} rx={6.5} />
        <text className={cx(s.text, s.start)} x={526} y={370} fontSize={14}>
          {labels.skills[1]}
        </text>
        <rect className={cx(s.paper, s.thin)} x={598} y={363} width={76} height={13} rx={6.5} />
      </M>
      <M k="growX" a={0.1} b={0.34}>
        <rect className={s.ink} x={600} y={328} width={72} height={9} rx={4.5} />
      </M>
      <M k="growX" a={0.46} b={0.68}>
        <rect className={s.ink} x={600} y={365} width={72} height={9} rx={4.5} />
      </M>

      <Lesson at={0.1} from={-300}>
        <circle className={s.ink} cx={610} cy={332} r={8} />
      </Lesson>
      <Lesson at={0.17} from={-300}>
        <rect className={cx(s.paper, s.thin)} x={602} y={324} width={16} height={16} rx={3} />
      </Lesson>
      <Lesson at={0.24} from={-300}>
        <circle className={cx(s.toneDark, s.line, s.thin)} cx={610} cy={332} r={8} />
      </Lesson>
      <Lesson at={0.46} from={260}>
        <rect className={s.ink} x={652} y={361} width={18} height={16} rx={3} />
      </Lesson>
      <Lesson at={0.52} from={260}>
        <circle className={cx(s.paper, s.thin)} cx={661} cy={369} r={8} />
      </Lesson>
      <Lesson at={0.58} from={260}>
        <rect className={s.ink} x={652} y={361} width={18} height={16} rx={3} />
      </Lesson>

      {/* ひらめき */}
      <M k="pop" a={0.76} b={0.84}>
        <circle className={s.paper} cx={600} cy={246} r={19} />
        <path className={s.line} d="M 592 268 H 608 M 594 276 H 606" />
        <path
          className={cx(s.line, s.thin)}
          d="M 600 212 V 200 M 566 246 H 554 M 634 246 H 646 M 576 222 L 568 214 M 624 222 L 632 214"
        />
      </M>
      <M k="pop" a={0.84} b={0.91}>
        <Heart x={534} y={500} size={1.1} />
      </M>
      <M k="pop" a={0.88} b={0.95}>
        <Heart x={666} y={500} size={1.1} />
      </M>

      <M k="pop" a={0.02} b={0.08}>
        <Tag x={455} y={364} w={58} label={labels.mother} />
      </M>
      <M k="pop" a={0.38} b={0.44}>
        <Tag x={745} y={384} w={58} label={labels.father} />
      </M>

      <Figure
        who="mother"
        x={455}
        dir={1}
        fx={{ ...cheer(0.74), armL: fx("lift", 0.04, 0.34, { dr: 118 }) }}
      />
      <Figure
        who="father"
        x={745}
        dir={-1}
        fx={{ ...cheer(0.74), armR: fx("lift", 0.4, 0.68, { dr: -118 }) }}
      />

      {/* 私。母のほうを見て、父のほうを見て、最後に両手を上げます。 */}
      <M k="hop" a={0.78} b={0.96} n={2} dy={-26}>
        <Figure
          who="me"
          kid
          x={600}
          armL={[150, 15]}
          armR={[150, 15]}
          fx={{
            ...cheer(0.73),
            face: [
              fx("shift", 0.03, 0.35, { dx: -7 }),
              fx("shift", 0.39, 0.69, { dx: 7 }),
            ],
            armL: fx("turn", 0.72, 0.78, { dr: -142 }),
            armR: fx("turn", 0.72, 0.78, { dr: 142 }),
          }}
        />
      </M>
    </Scene>
  );
}
