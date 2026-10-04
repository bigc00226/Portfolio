import { story } from "@/data/story";

import s from "./Scene.module.css";
import { Figure, Heart, M, Scene, Sparkle, Tag, cheer, cx, fx } from "./kit";

const { labels } = story;

/** 第4章：誕生。二人のハートが、ゆりかごへ降りてくる。 */
export function Birth() {
  return (
    <Scene>
      {/* 夜空 */}
      <M k="in" a={0} b={0.14} dy={-24}>
        <path className={s.paper} d="M 252 128 a 46 46 0 1 0 46 58 a 36 36 0 0 1 -46 -58 Z" />
        <Sparkle x={182} y={236} size={0.8} />
        <Sparkle x={340} y={98} size={0.6} />
        <Sparkle x={946} y={150} size={1.1} />
        <Sparkle x={1010} y={258} size={0.7} />
        <Sparkle x={884} y={80} size={0.6} />
      </M>

      {/* 家 */}
      <M k="in" a={0} b={0.12} dy={30}>
        <rect className={s.paper} x={708} y={206} width={40} height={90} />
        <rect className={s.paper} x={382} y={344} width={436} height={316} />
        <path className={s.paper} d="M 340 350 L 600 194 L 860 350 Z" />
        <circle className={cx(s.paper, s.thin)} cx={600} cy={292} r={22} />
        <path className={cx(s.line, s.hair)} d="M 578 292 H 622 M 600 270 V 314" />
      </M>

      {/* 降りてくるハート。赤ちゃんの胸のハートになります。 */}
      <M k="out" a={0.42} b={0.47}>
        <g transform="translate(623 578)">
          <M k="move" a={0.1} b={0.42} dy={-200} ds={3}>
            <M k="pulse" a={0.1} b={0.42} n={3} ds={1.1}>
              <Heart size={1.17} />
            </M>
          </M>
        </g>
      </M>

      {/* ゆりかごと赤ちゃん */}
      <M k="in" a={0.04} b={0.14} dy={20}>
        <g transform="translate(602 656) scale(1.3) translate(-602 -656)">
          <M k="sway" a={0.5} b={0.98} n={3} dr={4}>
            <M k="pop" a={0.42} b={0.52}>
              <ellipse className={s.fig} cx={618} cy={598} rx={34} ry={20} />
              <Heart x={618} y={596} size={0.9} className={s.face} />
              <path
                className={s.fig}
                d="M 578 566 C 574 554 582 546 594 548 C 588 552 586 558 586 566 Z"
              />
              <circle className={s.fig} cx={580} cy={588} r={21} />
              <path className={s.faceLine} d="M 569 588 q 4 -6 8 0 M 583 588 q 4 -6 8 0" />
            </M>
            <path className={s.paper} d="M 540 598 H 664 Q 664 644 602 644 Q 540 644 540 598 Z" />
            <path className={cx(s.line, s.thin)} d="M 562 620 H 642" />
            <path
              className={s.line}
              d="M 532 656 Q 602 632 672 656 M 566 642 V 650 M 638 642 V 650"
            />
          </M>
        </g>
      </M>

      <M k="pop" a={0.6} b={0.68}>
        <Tag x={574} y={506} w={58} label={labels.me} />
      </M>
      <M k="pop" a={0.5} b={0.58}>
        <Sparkle x={520} y={470} size={0.9} />
      </M>
      <M k="pop" a={0.54} b={0.62}>
        <Sparkle x={668} y={486} size={1.2} />
      </M>
      <M k="pop" a={0.66} b={0.74}>
        <Sparkle x={636} y={420} size={0.7} />
      </M>

      {/* 母と父。生まれた子を、両側からのぞきこみます。 */}
      <M k="fade" a={0.03} b={0.1}>
        <Figure
          who="mother"
          x={452}
          dir={1}
          look={[0.9, 0.8]}
          armR={[34, -30]}
          fx={{ ...cheer(0.47), armR: fx("turn", 0.44, 0.52, { dr: 26 }) }}
        />
        <Figure
          who="father"
          x={748}
          dir={-1}
          look={[-0.9, 0.8]}
          armL={[34, -30]}
          fx={{ ...cheer(0.47), armL: fx("turn", 0.44, 0.52, { dr: -26 }) }}
        />
      </M>
    </Scene>
  );
}
