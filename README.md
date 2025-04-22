# Next.js 15 + React 19 Vibe Coding テンプレート

AI支援型「Vibe Coding」に最適化されたフルスタックスターター🚀

## 主な特徴

- **Next.js 15**（App Router）＋ **React 19 RC**
- **pnpm** 開発サーバー & ワークスペース
- **厳格なTypeScript**
- **Vitest v2**（ユニット・コンポーネントテスト）＋ **Playwright 1.44**（E2E）
- **MSW 2**による共通モック
- **ESLint v9**による厳格Lint + **Prettier 3**
- **commitlint v19**、Conventional Commits、Huskyフック、lint‑staged
- **TurboRepo**によるキャッシュ付き並列タスク
- GitHub Actions CIワークフロー

## クイックスタート

```bash
pnpm i
pnpm dev           # ローカル開発サーバー（localhost:3000）
pnpm test          # vitest + API + e2e（turbo経由）

# ESLint / Prettier / ts‑prune
pnpm format
pnpm lint
pnpm check
pnpm prune
```

## DBレイヤ設計思想（Prisma対応・Vibe Coding流）

本プロジェクトでは、**DBスキーマは「境界付けられたコンテキスト」として一元管理し、各featureは「操作（クエリ・ミューテーション）」のみを責務に持つ**構成を推奨します。

- Prismaを使う場合の具体例：

```
project-root/
├─ prisma/
│   ├─ schema.prisma           # Prismaスキーマ定義
│   └─ migrations/             # マイグレーション履歴
├─ src/
│   ├─ db/
│   │   └─ client.ts           # PrismaClient初期化・export
│   └─ features/
│       ├─ profile/
│       │   └─ server.ts       # profile用DB操作関数
│       └─ post/
│           └─ server.ts       # post用DB操作関数
└─ .env                        # DATABASE_URLなど
```

- 各featureは`db/client.ts`経由でDB操作のみを記述し、スキーマ定義に依存します。

---

### Prisma用サンプル

#### prisma/schema.prisma

```prisma
model Profile {
  id        Int      @id @default(autoincrement())
  name      String
  bio       String?
  createdAt DateTime @default(now())
  posts     Post[]
}

model Post {
  id         Int      @id @default(autoincrement())
  profileId  Int
  content    String
  createdAt  DateTime @default(now())
  profile    Profile  @relation(fields: [profileId], references: [id])
}
```

#### src/db/client.ts

```ts
import { PrismaClient } from '@prisma/client';
export const db = new PrismaClient();
```

#### src/features/profile/server.ts

```ts
import { db } from '@/db/client';

export const getProfileById = (id: number) => db.profile.findUnique({ where: { id } });
```

#### src/features/post/server.ts

```ts
import { db } from '@/db/client';

export const getPostsByProfile = (profileId: number) =>
  db.post.findMany({
    where: { profileId },
    orderBy: { createdAt: 'desc' },
  });
```

#### .env例

```
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
```

---

### なぜこの構成が良いのか？

1. **境界付けられたコンテキスト**：DB定義は横断的に一元管理し、各featureはそこだけ参照。
2. **型安全性**：Prismaの型をそのままTSで活用し、AI生成コードの型エラーを激減。
3. **LLMプロンプト簡潔化**：「prisma/schema.prismaを変更して」→影響範囲が一目瞭然。
4. **CIキャッシュ効率化**：スキーマ変更のみでDBクライアント再ビルド、Turboキャッシュ有効。

---

### ディレクトリ構成（全体）

#### 1. 縦割り構造のフォルダ構成

SNSの開発で、タイムライン・プロフィール・投稿のような機能があることを想定した場合のフォルダ構成

```
src/
├─ app/                        # Next.jsルーティング
├─ features/                   # 機能別の縦割り構造
│   ├─ timeline/               # タイムライン機能
│   │   ├─ index.ts           # re-export
│   │   ├─ types.ts           # タイムライン関連の型定義
│   │   ├─ components/        # UIコンポーネント
│   │   │   └─ Feed.tsx       # フィードコンポーネント
│   │   ├─ hooks/             # カスタムフック
│   │   │   └─ useInfiniteFeed.ts
│   │   ├─ api/               # APIハンドラー
│   │   │   └─ route.ts       # App Router形式のAPIエンドポイント
│   │   └─ __tests__/         # テスト
│   ├─ post/                   # 投稿機能
│   ├─ profile/                # プロフィール機能
├─ libs/                       # 横断ユーティリティ
│   ├─ date.ts                 # 日付関連ユーティリティ
│   ├─ fetcher.ts              # データフェッチユーティリティ
│   ├─ store/                  # グローバル状態管理
│   └─ util/                   # 共通ユーティリティ関数
└─ ui/                         # 共通UIコンポーネント
    ├─ index.ts                # UIコンポーネントのエクスポート
    └─ Button.tsx              # 汎用ボタンコンポーネント
```

#### 2. サブ機能を切り出すときの「ひな形」

機能が大きくなった場合のサブ機能分割例：

```
src/
└─ features/
   └─ timeline/
      ├─ index.ts                # re‑export (hooks, types, ctx…)
      ├─ types.ts
      ├─ components/
      │   └─ Feed.tsx
      ├─ hooks/
      │   └─ useInfiniteFeed.ts
      ├─ api/
      │   └─ like/route.ts
      ├─ __tests__/              # timeline 全体の結合テスト
      │   └─ e2e.spec.ts
      ├─ highlight/              # ← "巨大機能"をさらに分割
      │   ├─ types.ts
      │   ├─ components/
      │   │   └─ Highlights.tsx
      │   ├─ hooks/
      │   │   └─ useHighlights.ts
      │   ├─ api/
      │   │   └─ route.ts
      │   └─ __tests__/
      │       └─ Highlights.test.tsx
      └─ comment/
          ├─ types.ts
          ├─ components/
          │   └─ CommentList.tsx
          ├─ hooks/
          │   └─ useComments.ts
          ├─ api/
          │   └─ route.ts
          └─ __tests__/
              └─ CommentList.test.tsx
```

#### 3. App Routerのフォルダ構成

```
src/
└─ app/
   ├─ layout.tsx            # ① 全体レイアウト（ヘッダー・ThemeProvider など）
   ├─ globals.css
   ├─ middleware.ts         # ② Edge Middleware（認可 / i18n）
   ├─ (public)/
   │   └─ page.tsx          # ホーム or LP
   ├─ timeline/             # URL セグメント = 機能入口
   │   ├─ page.tsx          # ③ RSC。features/timeline を呼び出すだけ
   │   └─ loading.tsx       # ④ Suspense フォールバック
   ├─ stories/
   │   └─ page.tsx
   ├─ profile/
   │   └─ [userId]/page.tsx # ⑤ 動的ルート
   ├─ api/                  # ⑥ 横断 API だけ (例: health)
   │   └─ health/route.ts
   ├─ auth/                 # ⑦ モーダルルーティング例
   │   └─ signin/page.tsx
   └─ error.tsx             # ⑧ App 全体のエラーバウンダリ
```

| 番号                          | 入れるもの                                                       | 具体例 / Why                                    |
| ----------------------------- | ---------------------------------------------------------------- | ----------------------------------------------- |
| ① layout.tsx                  | グローバル UI・Providers・Metadata                               | `<Header/>`, `<Toaster/>`, `<ThemeProvider>`    |
| ② middleware.ts               | Auth token 検証・AB テスト・i18n rewrite                         | Edge KV でフラグ→next/rewriter                  |
| ③ page.tsx (Server Component) | Feature エントリ`import { Feed } from '@/src/features/timeline'` | データ取得は features/timeline/server.ts に委譲 |
| ④ loading.tsx                 | Skeleton / shimmer UI                                            | ページ‐レベル Suspense                          |
| ⑤ [param]/page.tsx            | 動的ルート。URL param → feature hook に渡す                      | `const profile = await getProfile(userId)`      |
| ⑥ app/api/                    | サービス横断の health, metrics, webhooks                         | 機能固有 API は features/\*/api/                |
| ⑦ モーダルルート              | (auth)/signin など as Route Groups                               | UI は features/auth                             |
| ⑧ error.tsx                   | 全ページ共通エラー UI                                            | Sentry / Logger 連携                            |

**原則** : app/ のファイルは 「URL を解析し、適切な feature を呼び出し、構成する」 以外の責務を持たない。

##### 典型的な page.tsx 実装

```typescript
// src/app/timeline/page.tsx
import { Feed } from '@/src/features/timeline';
import { getInfiniteFeed } from '@/src/features/timeline/server';

export default async function TimelinePage() {
  const initialFeed = await getInfiniteFeed({ first: 20 });
  return <Feed initial={initialFeed} />;
}
```

- データ取得 (getInfiniteFeed) は feature 側の Server Helper に置く
- UI コンポジション (`<Feed />`) も feature 内 `<components/Feed.tsx>`

#### Turbo連携の例

```json
// turbo.json
{
  "pipeline": {
    "build": { "outputs": [".next/**"] },
    "test": {
      "dependsOn": ["build"],
      "inputs": ["features/**", "libs/**"]
    }
  }
}
```

- `turbo run test --filter=features/story` → ストーリーズ機能だけテスト
- GitHub Actionsで `turbo run build --filter={ mergeBase }...HEAD` → 変更機能だけビルド

#### Vibe Codingでの活用ポイント

1. **コンテキスト局所化**：LLMが読むコンテキストを極小化し、的確な修正が可能

2. **近接型定義**：types.tsを機能内に配置し、機能固有の型定義を明確化

3. **明確なプロンプト**：例えば「features/search/ にユーザー検索を実装。DBはlibs/db.tsを使って」のように具体的指示が可能

4. **限定コンテキスト**：Cursorの限定コンテキスト機能でfeatures/profile/\*\*を指定すれば、その範囲だけでLLMが推論

5. **シンプルなリファクタリング**：「features/stories/\*をzodスキーマを使用するようにリファクタして」のような指示だけでパッチ生成

#### よくある質問

| Q                                  | A                                                                                                             |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| ページ内の小コンポーネントはどこ？ | src/ui/ か、当該 feature 内 components/。app/ には置かない                                                    |
| App Router の Route Handlers は？  | 機能横断 (例: /api/health, /api/webhooks/...) だけ app/api/。機能固有 (like, comment) は features/<feat>/api/ |
| Server Actions                     | pages 内で宣言可。ただしロジック本体は features/\*/actions.ts に委譲しテスト容易に                            |
| Shared Providers                   | グローバル: app/layout.tsx — 機能固有: features/<feat>/providers.tsx を page で wrap                          |

#### 5. LLM プロンプト運用例

- **ページ追加**
  - "Create app/search/page.tsx that renders <Search /> from features/search with server-side query param support."
- **ルート‐グループ移動**
  - "Move timeline under (auth), update imports."
- **エラー境界拡張**
  - "Add a fallback UI to app/error.tsx that links to /timeline."

---

## Vibe CodingにおけるCSSベストプラクティス

- **ゴール**: ドキュメント≤400token・局所化・AIが理解しやすいスタイル＆開発体験最適化

### 1. 方針 — Utility-First + Design Tokens

- Tailwind CSS中心。ユーティリティクラスのみで即時フィードバック
- Design Token（colors, spacing, fontSize等）は`tailwind.config.js`で一元管理
- グローバル: `app/globals.css`（reset/base/theme/dark-modeのみ）
- 各コンポーネント: 完全ユーティリティ記述。独自クラスはshadcn/uiやclassnamesで制御

### 2. 必須ツール

| ツール                        | 役割                           |
| ----------------------------- | ------------------------------ |
| Tailwind CSS                  | Utility-Firstスタイル          |
| PostCSS + Autoprefixer        | ベンダープレフィックス自動付与 |
| Stylelint                     | CSS/SCSS静的解析               |
| Prettier + plugin-tailwindcss | className自動ソート            |
| shadcn/ui                     | デザインコンポーネント薄ラッパ |

#### 設定例

```js
// tailwind.config.js
module.exports = {
  content: ['./src/app/**/*.{ts,tsx}', './src/features/**/*.{ts,tsx}', './src/ui/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
      },
      spacing: {
        sm: '0.5rem',
        md: '1rem',
        lg: '2rem',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};
```

### 3. ファイル配置例

```
src/
├─ app/
│   └─ globals.css     # Tailwind base + reset + theme vars
├─ features/
│   └─ timeline/components/Feed.tsx
└─ ui/
    └─ Button.tsx     # <button className="rounded-lg px-4 py-2 bg-primary ...">
```

### 4. 運用フロー

- globals.cssに`@tailwind base; @tailwind components; @tailwind utilities;`を記述
- すべてJSX上でユーティリティクラス指定。独自クラスはshadcn/ui/`classnames`で制御
- `pnpm lint-staged`でstylelint/prettierチェック

### 5. レスポンシブ＆ダークモード

- `sm:`, `md:`, `lg:`でレスポンシブ
- `dark:`でダークモード、`<html className={theme}>`で切替

### 6. AIプロンプト例

- 「theme.colors.brandを追加し、Box背景に反映」
- 「Feed.tsxのpaddingをmd:2xl→sm:mdに変更」
- 「timeline/page.tsxにdarkモード背景色追加」

---

## Vibe Coding ワークフロー

🗺️ ゼロ→Vibe Coding までの "ロードマップ＋プロンプト" 一覧

ゴール : コードに着手する前に「AI が誤解しない 400 token 以下の設計アセット」をそろえる。
現実には何度も行き来しますが、まずは順番どおりに "最小で回す" とスムーズです。

| #   | フェーズ              | 目的                      | 生成物 & 保存場所              | 代表プロンプト例（Cursor / WindSurf チャット用）                                                                      |
| --- | --------------------- | ------------------------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| 0   | ビジョン共有          | プロジェクト北極星を 1 文 | docs/README.md                 | "プロダクトビジョンを1文で要約してください。"                                                                         |
| 1   | ペルソナ作成          | 利用者像を固定            | docs/requirements/personas.yml | `text\n役割: プロダクトオーナー\n目標: TikTokのようなSNSの3つのペルソナを定義する\n出力: 120トークン以下のYAMLリスト` |
| 2   | エピック & ストーリー | 作る機能を箇条書き        | docs/requirements/epics.yml    | "これらの口頭アイデアをGherkinスタイルのユーザーストーリーに変換してください。"                                       |
| 3   | NFR 定義              | SLA/SLO を数値化          | docs/requirements/nfr.yml      | "タイムラインAPIのp95レイテンシーとエラーバジェットをリスト化してください。"                                          |
| 4   | 用語集                | あいまい語を排除          | docs/requirements/glossary.md  | "'ストーリー'、'ハイライト'、'リール'の用語集を作成してください。"                                                    |
| 5   | ADR #001              | 不可逆な技術選択を刻む    | docs/adr/ADR‑0001-db-choice.md | "ADRを作成：PlanetScale MySQLとDynamoDBのどちらかを選択してください。"                                                |
| 6   | C4 Context/Container  | 全体構成を 1 画           | docs/architecture/c4.mmd       | `text\n役割: アーキテクト\n目標: ウェブアプリ+エッジ+DBのC4コンテキスト+コンテナ図（mermaid）を作成する`              |
| 7   | ドメインモデル        | エンティティ関係を可視化  | docs/architecture/domain.mmd   | "ユーザー、投稿、コメント、ストーリーのER図を作成してください。"                                                      |
| 8   | サービス境界          | Feature ↔ 依存を宣言     | docs/architecture/services.yml | "機能を境界付けられたコンテキストにYAMLでマッピングしてください。"                                                    |
| 9   | API 契約              | 外部 I/F を固定           | docs/api/{feature}.yml         | "ストーリーTL-03から、GET /api/timelineのOpenAPI 3.1を生成してください。"                                             |
| 10  | シーケンス図          | 呼び出し順序を確定        | docs/sequence/{flow}.mmd       | "投稿アップロード（クライアント→エッジ→DB）のmermaidシーケンス図を作成してください。"                                 |
| 11  | UI ワイヤー           | 画面の構成を共有          | docs/ux/wireframes/\*.png      | Figma→PNG export; その後 "wireframe/home.pngの主要領域をテキストで説明してください。"                                 |
| 12  | 画面遷移図            | ページ間フロー            | docs/ux/flows.mmd              | "ログイン → タイムライン → プロフィールのフローチャートを生成してください。"                                          |
| 13  | コンポーネント表      | UI 再利用範囲を提示       | docs/ux/components.md          | "shadcn/uiをベースにして必要なアトミックコンポーネントをリスト化してください。"                                       |
| 14  | アクセシビリティ基準  | WCAG 整合性               | docs/ux/a11y.md                | "色のコントラストとキーボードナビゲーションのルールをMarkdownで記述してください。"                                    |
| 15  | バックログ整理        | Story → 具体タスク        | GitHub Issue / Project Board   | "ストーリーTL-03をfeature/timelineラベル付きのタスクに分解してください。"                                             |
| 16  | リポジトリ初期化      | 足場を用意                | src/ + docs/                   | スクリプト: npx create-next-app, コピペ済テンプレを push                                                              |
| 17  | 初期モック            | MSW ハンドラ用意          | src/tests/msw/handlers.ts      | "3つのフェイク投稿でタイムラインAPIをスタブ化してください。"                                                          |
| 18  | Vibe Coding Kick‑off  | AI 差分生成開始           | /prompt スニペット             | "features/timeline/\*\* の下に無限スクロールを実装してください。"                                                     |

⸻

🎯 **ポイント解説 & 提示テンプレ**

1.  **各ファイル ≤ 400 tokens**
    Cursor / WindSurf の埋め込みがズレず、LLM が全文読めます。
2.  **フォーマット 3 種に限定**
    YAML（構造）・Markdown（説明）・Mermaid（図）。AI が最も誤解しにくい。
3.  **"Prompt→Artifact" ワンペア原則**
    - 人間: ゴール・受け入れ基準を短文で。
    - AI: 上記表のプロンプトをそのまま投げ、生成結果を 即コミット。

⸻

🚀 **例: ストーリー TL‑03 作成フルチェーン**

```
// ① ユーザーストーリー
役割: プロダクトオーナー
目標: TL-03をGherkin形式で形式化する
出力: YAMLスニペット

↓ Commit docs/requirements/epics.yml

// ② API 契約
役割: API設計者
目標: TL-03のOpenAPI仕様を作成
制約: 1エンドポイント、最大200トークン
出力: YAMLファイル

↓ Commit docs/api/timeline.yml

// ③ UI Flow
役割: UX担当
目標: flows.mmdに無限スクロール状態を追加
出力: mermaidパッチ

↓ Commit docs/ux/flows.mmd

// ④ Vibe Coding (/prompt)
役割: タイムライン担当のシニアTS開発者
目標: 無限スクロールを実装
制約: features/timeline/**のみ変更
出力: gitパッチ
```

すべて git で履歴に残り、以降は通常の Vibe 開発ループ（lint → test → PR）へ。

✅ **まとめ**

1.  **順番重視**：上表 0→18 を 1 ファイルずつ最小で回す。
2.  **Prompt ＝ 作業指示書**：ひな形をコピペ、3 行で完結。
3.  **コミット単位**：1 生成物 = 1 コミット = レビューしやすい。

この流れなら "設計が軽いのに中身はブレない" 状態で Vibe Coding に突入できます。
さらなるテンプレ拡張や自動化スクリプトが必要なときは、気軽に声をかけてください！
