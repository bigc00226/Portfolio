/**
 * 開発実績のデータ。
 *
 * それぞれの案件に、関わった分野（システム／アプリ／AI）を付けています。
 * ページ上部の「◯件」という数字は、この一覧から自動で集計しています。
 * このファイルを編集すれば、ページ内の件数もすべて追従します。
 */

export type Discipline = "system" | "app" | "ai";

export type Project = {
  /** 通し番号を兼ねた識別子。 */
  id: string;
  title: string;
  /** その案件で組み合わせた機能。 */
  capabilities: string[];
  disciplines: Discipline[];
};

export type IndustryGroup = {
  id: string;
  name: string;
  /** その業種で担当した仕事の概要。 */
  note: string;
  projects: Project[];
};

export const disciplineLabels: Record<Discipline, string> = {
  system: "システム開発",
  app: "アプリ開発",
  ai: "AI開発",
};

export const disciplineShortLabels: Record<Discipline, string> = {
  system: "システム",
  app: "アプリ",
  ai: "AI",
};

export const disciplineNotes: Record<Discipline, string> = {
  system: "基幹業務システム、外部サービス連携、それを支えるインフラ。",
  app: "毎日お使いになる方を想定して設計した、Web・モバイルアプリ。",
  ai: "モデル、データ基盤、言語処理を、実務で使えるかたちに。",
};

export const disciplineOrder: Discipline[] = ["system", "app", "ai"];

export const industries: IndustryGroup[] = [
  {
    id: "agriculture",
    name: "農林水産業",
    note: "ハウスの中から出荷先まで、現場の動きをひと続きのデータに。",
    projects: [
      {
        id: "01",
        title: "スマート農業プラットフォーム",
        capabilities: ["圃場・作物記録", "IoTハウス環境監視", "収穫量予測"],
        disciplines: ["system", "ai"],
      },
      {
        id: "02",
        title: "病害虫対策システム",
        capabilities: ["ドローン空撮解析", "病害虫の検知", "防除スケジュール管理"],
        disciplines: ["ai", "system"],
      },
      {
        id: "03",
        title: "畜産・水産管理システム",
        capabilities: [
          "IoTによる健康・水質モニタリング",
          "繁殖記録",
          "トレーサビリティ",
        ],
        disciplines: ["system", "ai"],
      },
      {
        id: "04",
        title: "産地直送プラットフォーム",
        capabilities: ["産直EC", "出荷計画", "QRコードによる追跡"],
        disciplines: ["system", "app"],
      },
    ],
  },
  {
    id: "manufacturing",
    name: "製造業",
    note: "実際の生産現場の負荷のなかでも、数字が狂わない仕組みを。",
    projects: [
      {
        id: "05",
        title: "スマートファクトリー基盤",
        capabilities: [
          "MES生産管理",
          "IoTによる予知保全",
          "デジタルツインシミュレーション",
        ],
        disciplines: ["system", "ai"],
      },
      {
        id: "06",
        title: "品質保証システム",
        capabilities: ["外観検査AI", "ロットトレーサビリティ", "品質管理システム"],
        disciplines: ["ai", "system"],
      },
      {
        id: "07",
        title: "サプライチェーン管理システム",
        capabilities: ["調達管理", "在庫最適化", "需要予測"],
        disciplines: ["system", "ai"],
      },
    ],
  },
  {
    id: "retail",
    name: "小売・EC・飲食",
    note: "店舗、決済、バックヤードを、ひとつの在庫と数字でつなぐ。",
    projects: [
      {
        id: "08",
        title: "統合コマースプラットフォーム",
        capabilities: [
          "ECサイト",
          "PayPay・クレジットカード決済",
          "Shopify・楽天・Amazonの在庫連携",
        ],
        disciplines: ["system", "app"],
      },
      {
        id: "09",
        title: "顧客エンゲージメントシステム",
        capabilities: ["ポイント・クーポン", "LINE連携", "レコメンドエンジン"],
        disciplines: ["app", "ai"],
      },
      {
        id: "10",
        title: "市場分析システム",
        capabilities: ["価格スクレイピング", "需要予測", "模倣品の検知"],
        disciplines: ["ai", "system"],
      },
      {
        id: "11",
        title: "飲食・サロン店舗運営システム",
        capabilities: ["予約管理", "モバイルオーダー", "シフト・人件費管理"],
        disciplines: ["app", "system"],
      },
      {
        id: "12",
        title: "宿泊・観光システム",
        capabilities: [
          "予約管理・PMS",
          "ダイナミックプライシング",
          "多言語チャットボット",
        ],
        disciplines: ["system", "app", "ai"],
      },
    ],
  },
  {
    id: "healthcare",
    name: "医療・ヘルスケア",
    note: "診療科ごとの実務に合わせて設計し、監査にも耐える構成で。",
    projects: [
      {
        id: "13",
        title: "病院基幹システム",
        capabilities: [
          "電子カルテ",
          "受付・医事会計",
          "看護・薬剤・手術・救急の部門支援",
        ],
        disciplines: ["system"],
      },
      {
        id: "14",
        title: "AI診断支援システム",
        capabilities: [
          "医療画像AI（肺結節・胃がん・糖尿病網膜症）",
          "臨床検査システム",
          "治験データ管理",
        ],
        disciplines: ["ai", "system"],
      },
      {
        id: "15",
        title: "オンライン診療システム",
        capabilities: ["オンライン診察", "電子処方箋", "薬局の服薬履歴"],
        disciplines: ["app", "system"],
      },
      {
        id: "16",
        title: "予防医療アプリ",
        capabilities: ["健康診断結果の管理", "生活習慣病の管理", "ウェアラブル連携"],
        disciplines: ["app", "ai"],
      },
    ],
  },
  {
    id: "care",
    name: "介護・福祉",
    note: "机の前ではなく、忙しい手もとと短い時間のための道具を。",
    projects: [
      {
        id: "17",
        title: "介護施設運営プラットフォーム",
        capabilities: ["介護記録", "ケアプラン作成", "センサーによる見守り"],
        disciplines: ["system", "ai"],
      },
      {
        id: "18",
        title: "訪問介護業務システム",
        capabilities: ["訪問スケジュール管理", "ルート最適化", "ご家族への通知"],
        disciplines: ["system", "app"],
      },
      {
        id: "19",
        title: "コミュニケーション支援サービス",
        capabilities: [
          "音声認識",
          "音声合成",
          "高齢の方・障がいのある方に向けたAI会話",
        ],
        disciplines: ["ai", "app"],
      },
      {
        id: "20",
        title: "保育園管理システム",
        capabilities: ["登降園管理", "保護者への連絡", "利用料の請求"],
        disciplines: ["system", "app"],
      },
    ],
  },
  {
    id: "government",
    name: "行政・公共",
    note: "アクセシビリティ、セキュリティ、調達要件を満たした公共サービス。",
    projects: [
      {
        id: "21",
        title: "自治体DXプラットフォーム",
        capabilities: [
          "オンライン申請",
          "マイナンバーカード認証",
          "住民・税務管理",
        ],
        disciplines: ["system", "app"],
      },
      {
        id: "22",
        title: "防災情報システム",
        capabilities: [
          "地震・台風・水害の警報配信",
          "避難誘導",
          "避難所の運営管理",
        ],
        disciplines: ["system", "app"],
      },
      {
        id: "23",
        title: "公共施設予約システム",
        capabilities: ["施設予約", "オンライン決済", "利用状況の分析"],
        disciplines: ["system", "app"],
      },
    ],
  },
  {
    id: "education",
    name: "教育",
    note: "先生方とご一緒に、無理のない進め方で導入を。",
    projects: [
      {
        id: "24",
        title: "AI学習プラットフォーム",
        capabilities: ["LMS", "AIチューター", "自動採点"],
        disciplines: ["ai", "system"],
      },
      {
        id: "25",
        title: "語学学習システム",
        capabilities: ["日本語の発音評価", "動画講義", "学習進捗の管理"],
        disciplines: ["ai", "app"],
      },
      {
        id: "26",
        title: "学校・学習塾運営システム",
        capabilities: ["成績・出欠管理", "保護者への連絡", "授業料の請求"],
        disciplines: ["system", "app"],
      },
    ],
  },
  {
    id: "finance",
    name: "金融・保険",
    note: "規制対応を前提に、外部監査にも耐える記録を残す設計で。",
    projects: [
      {
        id: "27",
        title: "リスク管理プラットフォーム",
        capabilities: [
          "与信スコアリング",
          "不正検知",
          "マネーロンダリング対策の監視",
        ],
        disciplines: ["ai", "system"],
      },
      {
        id: "28",
        title: "保険業務自動化システム",
        capabilities: ["保険金支払査定", "引受査定", "OCRによる書類取り込み"],
        disciplines: ["ai", "system"],
      },
      {
        id: "29",
        title: "決済・会計システム",
        capabilities: [
          "QR・モバイル決済",
          "freee・マネーフォワード・弥生との連携",
        ],
        disciplines: ["system", "app"],
      },
    ],
  },
  {
    id: "logistics",
    name: "物流・運輸・モビリティ",
    note: "実際のドライバー、道路事情、積み方に合う計画を。",
    projects: [
      {
        id: "30",
        title: "スマート物流プラットフォーム",
        capabilities: ["倉庫管理（WMS）", "配送ルート最適化", "ドライバー配車"],
        disciplines: ["system", "ai"],
      },
      {
        id: "31",
        title: "車両・モビリティ管理システム",
        capabilities: ["車検・整備管理", "カーシェアリング", "駐車場管理"],
        disciplines: ["system", "app"],
      },
      {
        id: "32",
        title: "交通情報システム",
        capabilities: ["渋滞予測", "信号制御", "公共交通の時刻表配信"],
        disciplines: ["ai", "system"],
      },
    ],
  },
  {
    id: "property",
    name: "不動産・建設",
    note: "契約、現場、建物を、ひとつの確かな記録に。",
    projects: [
      {
        id: "33",
        title: "不動産管理プラットフォーム",
        capabilities: ["物件掲載", "電子契約", "家賃の集金管理"],
        disciplines: ["system", "app"],
      },
      {
        id: "34",
        title: "建設プロジェクト管理システム",
        capabilities: ["進捗管理", "BIM/CIMモデル連携", "ドローン測量"],
        disciplines: ["system", "ai"],
      },
      {
        id: "35",
        title: "スマートビル管理システム",
        capabilities: ["設備管理", "エネルギー監視", "予知保全"],
        disciplines: ["system", "ai"],
      },
    ],
  },
  {
    id: "energy",
    name: "エネルギー・環境",
    note: "まず測ること。次に予測。そして、通る報告を。",
    projects: [
      {
        id: "36",
        title: "エネルギーマネジメント基盤",
        capabilities: [
          "スマートメーター",
          "太陽光・風力の発電量予測",
          "ビルEMS",
        ],
        disciplines: ["system", "ai"],
      },
      {
        id: "37",
        title: "環境モニタリングシステム",
        capabilities: [
          "大気・水質センサー",
          "CO2排出量の報告",
          "廃棄物・リサイクルの回収ルート",
        ],
        disciplines: ["system", "ai"],
      },
    ],
  },
  {
    id: "operations",
    name: "バックオフィス・経営管理",
    note: "社内の地道な業務に、時間をお返しする仕組みを。",
    projects: [
      {
        id: "38",
        title: "バックオフィス自動化スイート",
        capabilities: [
          "請求書・領収書のOCR",
          "インボイス制度への対応",
          "RPA",
        ],
        disciplines: ["ai", "system"],
      },
      {
        id: "39",
        title: "人事・勤怠システム",
        capabilities: ["勤怠管理", "シフト管理", "給与計算・社会保険の対応"],
        disciplines: ["system", "app"],
      },
      {
        id: "40",
        title: "採用管理プラットフォーム",
        capabilities: ["AIによる書類選考", "求人マッチング", "応募者管理（ATS）"],
        disciplines: ["ai", "system"],
      },
      {
        id: "41",
        title: "営業・カスタマーサポート基盤",
        capabilities: [
          "CRM・SFA",
          "LINE・OpenAIチャットボット",
          "FAQナレッジベース",
        ],
        disciplines: ["system", "ai", "app"],
      },
      {
        id: "42",
        title: "議事録・ナレッジ管理システム",
        capabilities: [
          "Whisper・GPTによる文字起こし",
          "議事録の自動生成",
          "社内文書検索（RAG）",
        ],
        disciplines: ["ai", "system"],
      },
      {
        id: "43",
        title: "ワークフロー・文書管理システム",
        capabilities: ["電子稟議", "文書管理", "全文検索"],
        disciplines: ["system"],
      },
    ],
  },
  {
    id: "media",
    name: "メディア・エンタメ・スポーツ",
    note: "キャンペーン時の急なアクセス増が、前提となる規模のサービス。",
    projects: [
      {
        id: "44",
        title: "スポーツ・公営競技分析基盤",
        capabilities: [
          "データ収集（PHP・Python）",
          "統計分析",
          "オッズ連動のレース予測",
        ],
        disciplines: ["ai", "system"],
      },
      {
        id: "45",
        title: "キャンペーン・販促システム",
        capabilities: [
          "抽選・懸賞キャンペーン",
          "ポイント・クーポン",
          "LINE・アプリ連携",
        ],
        disciplines: ["app", "system"],
      },
      {
        id: "46",
        title: "ファン・イベントプラットフォーム",
        capabilities: ["チケット販売", "会員コミュニティ", "コンテンツ配信"],
        disciplines: ["app", "system"],
      },
      {
        id: "47",
        title: "クリエイター支援システム",
        capabilities: [
          "アニメ・漫画・イラストの生成AI",
          "著作権・素材の管理",
        ],
        disciplines: ["ai", "app"],
      },
    ],
  },
  {
    id: "security",
    name: "セキュリティ・インフラ",
    note: "ほかのすべてが止まった日にも、動き続ける層を。",
    projects: [
      {
        id: "48",
        title: "セキュリティ運用基盤",
        capabilities: ["AIによる異常検知", "ログ分析", "ネットワーク監視"],
        disciplines: ["ai", "system"],
      },
      {
        id: "49",
        title: "認証・アクセス管理システム",
        capabilities: ["生体認証", "シングルサインオン", "監視カメラ映像の解析"],
        disciplines: ["system", "ai"],
      },
      {
        id: "50",
        title: "事業継続・インフラ基盤",
        capabilities: ["バックアップ", "災害復旧（DR）", "クラウドインフラ管理"],
        disciplines: ["system"],
      },
    ],
  },
  {
    id: "research",
    name: "研究・科学・分野横断AI",
    note: "研究水準の処理を、本番運用に耐える品質で。",
    projects: [
      {
        id: "51",
        title: "ライフサイエンス研究基盤",
        capabilities: [
          "ゲノム解析",
          "機械学習による創薬支援",
          "臨床データ管理",
        ],
        disciplines: ["ai", "system"],
      },
      {
        id: "52",
        title: "地球観測システム",
        capabilities: [
          "衛星画像の解析",
          "気象・気候シミュレーション",
          "災害予測",
        ],
        disciplines: ["ai", "system"],
      },
      {
        id: "53",
        title: "企業向けAI基盤",
        capabilities: [
          "LLMとRAGによるナレッジ検索",
          "IoTデータの収集・可視化",
          "業務フローの自動化",
        ],
        disciplines: ["ai", "system"],
      },
      {
        id: "54",
        title: "ロボティクス基盤",
        capabilities: [
          "コミュニケーションロボット",
          "介護ロボット",
          "音声・画像認識AI",
        ],
        disciplines: ["ai", "system"],
      },
    ],
  },
];

export const allProjects: Project[] = industries.flatMap((group) => group.projects);

/** 分野ごとの件数。 */
export const caseCounts: Record<Discipline, number> = disciplineOrder.reduce(
  (counts, discipline) => {
    counts[discipline] = allProjects.filter((project) =>
      project.disciplines.includes(discipline),
    ).length;
    return counts;
  },
  {} as Record<Discipline, number>,
);

export const totalProjects = allProjects.length;
export const totalIndustries = industries.length;
