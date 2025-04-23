/**
 * 投稿フォームコンポーネント
 * 新規投稿の作成と送信を行うフォームUI
 */
'use client';
import Image from 'next/image';
import type { JSX } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useRef, useState } from 'react';

import { Button } from '../../../ui/Button';
import type { CreatePostData } from '../types';

/**
 * PostFormコンポーネントのプロパティ
 */
export interface PostFormProps {
  /**
   * フォーム送信時のハンドラー
   */
  onSubmit: (data: CreatePostData) => Promise<void>;

  /**
   * 送信中かどうかのフラグ
   */
  isSubmitting?: boolean;

  /**
   * プレースホルダーテキスト
   * @default "今何してる？"
   */
  placeholder?: string;
}

/**
 * 投稿作成フォームコンポーネント
 * @param {PostFormProps} props - コンポーネントのプロパティ
 * @returns {JSX.Element} 投稿フォーム要素
 */
// 画像最大枚数の定数化
const MAX_IMAGE_COUNT = 4;

/**
 * 投稿読み込み失敗時のエラー表示コンポーネント。
 *
 * @param root0 - props
 * @param root0.onRetry - 再試行ハンドラ
 * @returns エラー表示要素
 */
// 画像管理用カスタムフック
/**
 * 画像ファイルとURLの管理ロジックを分離
 * @param maxImageCount
 * @returns 画像ファイル配列・URL配列・追加/削除関数・inputRef
 */
const usePostFormImages = (maxImageCount: number) => {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * 画像ファイル選択時のハンドラー
   * @param {ChangeEvent<HTMLInputElement>} e - 変更イベント
   * @returns {void}
   */
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files).slice(0, maxImageCount - imageFiles.length);
    if (newFiles.length === 0) return;
    setImageFiles((prev) => [...prev, ...newFiles]);
    newFiles.forEach((file) => {
      const url = URL.createObjectURL(file);
      setImageUrls((prev) => [...prev, url]);
    });
  };

  /**
   * 画像削除ハンドラー
   * @param {number} index - 削除する画像のインデックス
   * @returns {void}
   */
  const handleRemoveImage = (index: number): void => {
    if (imageUrls[index]) {
      URL.revokeObjectURL(imageUrls[index]!);
    }
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  return {
    imageFiles,
    imageUrls,
    fileInputRef,
    handleFileChange,
    handleRemoveImage,
  };
};

/**
 * 投稿作成フォームコンポーネント
 * @param {PostFormProps} props - コンポーネントのプロパティ
 * @returns {JSX.Element} 投稿フォーム要素
 */
export const PostForm = ({
  onSubmit,
  isSubmitting = false,
  placeholder = '今何してる？',
}: PostFormProps): JSX.Element => {
  const handlers = usePostFormHandlers({ onSubmit, isSubmitting, placeholder });
  return (
    <form className="bg-white rounded-lg shadow-sm p-4 mb-6" onSubmit={handlers.onFormSubmit}>
      <textarea
        className="w-full border-none resize-none outline-none min-h-[60px] mb-3 placeholder-gray-400"
        placeholder={placeholder}
        value={handlers.content}
        onChange={handlers.onTextareaChange}
        disabled={isSubmitting}
      />
      {/* 画像プレビュー */}
      {handlers.imageUrls.length > 0 && (
        <ImagePreview
          imageUrls={handlers.imageUrls}
          handleRemoveImage={handlers.handleRemoveImage}
        />
      )}
      <ActionButtons
        isSubmitting={isSubmitting}
        imageFilesCount={handlers.imageFiles.length}
        handleImageButtonClick={handlers.handleImageButtonClick}
        isSubmitDisabled={handlers.isSubmitDisabled}
      />
      <input
        type="file"
        ref={handlers.fileInputRef}
        accept="image/*"
        multiple
        className="hidden"
        onChange={handlers.handleFileChange}
        disabled={isSubmitting || handlers.imageFiles.length >= MAX_IMAGE_COUNT}
      />
    </form>
  );
};

/**
 * 画像プレビュー部分コンポーネント。
 *
 * @param root0 - props
 * @param root0.imageUrls - プレビュー画像URL配列
 * @param root0.handleRemoveImage - 画像削除ハンドラ
 * @returns プレビュー表示要素
 */
const ImagePreview: React.FC<{
  imageUrls: string[];
  handleRemoveImage: (index: number) => void;
}> = ({ imageUrls, handleRemoveImage }) => (
  <div className="grid grid-cols-2 gap-2 mb-3">
    {imageUrls.map((url, index) => (
      <div key={index} className="relative group h-32">
        <Image src={url} alt={`添付画像 ${index + 1}`} fill className="object-cover rounded-lg" />
        <button
          type="button"
          className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 text-gray-600 hover:text-red-500"
          onClick={() => handleRemoveImage(index)}
          aria-label="画像を削除"
        >
          ×
        </button>
      </div>
    ))}
  </div>
);

/**
 * 投稿フォームのアクションボタン群コンポーネント。
 *
 * @param root0 - props
 * @param root0.isSubmitting - 送信中フラグ
 * @param root0.imageFilesCount - 添付画像数
 * @param root0.handleImageButtonClick - 画像追加ボタンクリックハンドラ
 * @param root0.isSubmitDisabled - 送信不可フラグ
 * @returns ボタン表示要素
 */
const ActionButtons: React.FC<{
  isSubmitting: boolean;
  imageFilesCount: number;
  handleImageButtonClick: () => void;
  isSubmitDisabled: boolean;
}> = ({ isSubmitting, imageFilesCount, handleImageButtonClick, isSubmitDisabled }) => (
  <div className="flex items-center justify-between">
    <button
      type="button"
      className={`mr-2 px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm ${
        isSubmitting || imageFilesCount >= MAX_IMAGE_COUNT ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onClick={handleImageButtonClick}
      disabled={isSubmitting || imageFilesCount >= MAX_IMAGE_COUNT}
    >
      画像追加
    </button>
    <Button
      type="submit"
      variant="primary"
      size="md"
      disabled={isSubmitDisabled}
      isLoading={isSubmitting}
    >
      投稿
    </Button>
  </div>
);

/**
 * 投稿フォームの状態・ハンドラをまとめるカスタムフック
 * @param {object} params
 * @param {(data: CreatePostData) => Promise<void>} params.onSubmit
 * @param {boolean} params.isSubmitting
 * @param {string} params.placeholder
 * @returns フォーム状態・ハンドラ群
 */
/**
 * 投稿フォームのテキスト状態・ハンドラを管理するカスタムフック
 * @returns テキスト値・onChange・onResizeハンドラ
 */
const usePostFormText = () => {
  const [content, setContent] = useState<string>('');
  /**
   * テキストエリアの変更ハンドラー
   * @param {ChangeEvent<HTMLTextAreaElement>} e - 変更イベント
   * @returns {void}
   */
  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setContent(e.target.value);
  };
  /**
   * テキストエリアの自動リサイズ
   * @param {ChangeEvent<HTMLTextAreaElement>} e - 変更イベント
   * @returns {void}
   */
  const handleTextareaResize = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };
  return { content, setContent, handleContentChange, handleTextareaResize };
};

/**
 * 投稿フォームの送信処理を管理するカスタムフック
 * @param props - onSubmit, isSubmitting, imageFiles, imageUrls, setContent
 * @param props.onSubmit
 * @param props.isSubmitting
 * @param props.imageFiles
 * @param props.imageUrls
 * @param props.content
 * @param props.setContent
 * @param content
 * @param imageFiles
 * @param isSubmitting
 * @returns 送信ハンドラ・送信可否
 */
const isSubmitDisabled = (content: string, imageFiles: File[], isSubmitting: boolean) =>
  (content.trim() === '' && imageFiles.length === 0) || isSubmitting;

/**
 * 投稿データを生成するユーティリティ関数。
 *
 * @param content - 投稿本文
 * @param imageUrls - 添付画像URL配列
 * @returns 投稿データオブジェクト
 */
const createPostData = (content: string, imageUrls: string[]): CreatePostData => ({
  content,
  imageUrls: imageUrls ?? [],
});

/**
 * 投稿フォームの送信イベントハンドラ。
 *
 * @param e - フォームイベント
 * @param content - 投稿本文
 * @param imageFiles - 添付画像ファイル配列
 * @param imageUrls - 添付画像URL配列
 * @param onSubmit - 投稿送信関数
 * @param setContent - テキストsetter
 * @returns Promise<void>
 */
const handleFormSubmit = async (
  e: FormEvent<HTMLFormElement>,
  content: string,
  imageFiles: File[],
  imageUrls: string[],
  onSubmit: (data: CreatePostData) => Promise<void>,
  setContent: (v: string) => void,
) => {
  e.preventDefault();
  if (!content.trim() && imageFiles.length === 0) {
    return;
  }
  try {
    const postData = createPostData(content, imageUrls);
    await onSubmit(postData);
    setContent('');
    imageUrls.forEach((url: string) => URL.revokeObjectURL(url));
  } catch (error) {
    console.error('投稿送信エラー:', error);
  }
};

/**
 * 投稿フォームの状態・ハンドラをまとめるカスタムフック（分割版）
 * @param {object} params
 * @param {(data: CreatePostData) => Promise<void>} params.onSubmit
 * @param {boolean} params.isSubmitting
 * @returns フォーム状態・ハンドラ群
 */
const usePostFormHandlers = ({ onSubmit, isSubmitting = false }: PostFormProps) => {
  const text = usePostFormText();
  const { imageFiles, imageUrls, fileInputRef, handleFileChange, handleRemoveImage } =
    usePostFormImages(MAX_IMAGE_COUNT);

  /**
   * 画像追加ボタンのクリックハンドラ。
   * @returns なし
   */
  const handleImageButtonClick = (): void => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  /**
   * 指定した画像を削除するハンドラ。
   * @param index - 削除対象画像のインデックス
   * @returns なし
   */
  const handleRemoveImageWrapper = (index: number): void => {
    handleRemoveImage(index);
  };

  /**
   * 投稿フォーム送信時のハンドラ。
   * @param e - フォームイベント
   * @returns なし
   */
  const onFormSubmit = (e: FormEvent<HTMLFormElement>) =>
    handleFormSubmit(e, text.content, imageFiles, imageUrls, onSubmit, text.setContent);

  return {
    MAX_IMAGE_COUNT,
    content: text.content,
    imageFiles,
    imageUrls,
    fileInputRef,
    handleFileChange,
    handleRemoveImage: handleRemoveImageWrapper,
    handleImageButtonClick,
    isSubmitDisabled: isSubmitDisabled(text.content, imageFiles, isSubmitting),
    onFormSubmit,
    /**
     * テキストエリア変更時のハンドラ。
     * テキストエリアの値を更新し、自動リサイズする。
     * @param e - テキストエリアイベント
     * @returns なし
     */
    onTextareaChange: (e: ChangeEvent<HTMLTextAreaElement>) => {
      text.handleContentChange(e);
      text.handleTextareaResize(e);
    },
  };
};
