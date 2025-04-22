# コンポーネントカタログ

このドキュメントでは、アプリケーション全体で再利用可能なUIコンポーネントを定義します。

## 基本コンポーネント

### Button

```tsx
<Button variant="primary" size="md" onClick={handleClick}>
  ボタンテキスト
</Button>
```

**バリエーション**:

- `variant`: "primary" | "secondary" | "outline" | "ghost" | "danger"
- `size`: "sm" | "md" | "lg"
- `isLoading`: boolean - ローディング状態を表示
- `isDisabled`: boolean - 無効状態

### Input

```tsx
<Input
  type="text"
  placeholder="入力してください"
  value={value}
  onChange={handleChange}
  error={error}
/>
```

**バリエーション**:

- `type`: "text" | "password" | "email" | "number"
- `size`: "sm" | "md" | "lg"
- `error`: string - エラーメッセージ

### Card

```tsx
<Card>
  <Card.Header>タイトル</Card.Header>
  <Card.Body>コンテンツ</Card.Body>
  <Card.Footer>フッター</Card.Footer>
</Card>
```

## 複合コンポーネント

### PostCard

投稿を表示するためのカード。

```tsx
<PostCard
  post={{
    id: '1',
    text: '投稿内容',
    author: {
      id: 'user1',
      name: 'ユーザー名',
      avatar: '/avatar.png',
    },
    createdAt: '2023-01-01T00:00:00Z',
    likeCount: 5,
    commentCount: 2,
    isLiked: false,
  }}
  onLike={() => {}}
  onComment={() => {}}
/>
```

### UserListItem

ユーザーリストの各アイテム。

```tsx
<UserListItem
  user={{
    id: 'user1',
    name: 'ユーザー名',
    avatar: '/avatar.png',
    bio: '自己紹介',
  }}
  isFollowing={false}
  onFollow={() => {}}
/>
```

### CommentInput

コメント入力フォーム。

```tsx
<CommentInput placeholder="コメントを入力..." onSubmit={(text) => {}} isLoading={false} />
```
