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
export const PostForm = ({
  onSubmit,
  isSubmitting = false,
  placeholder = '今何してる？',
}: PostFormProps): JSX.Element => {
  const [content, setContent] = useState<string>('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * テキストエリアの変更ハンドラー
   * @param {ChangeEvent<HTMLTextAreaElement>} e - 変更イベント
   */
  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setContent(e.target.value);
  };

  /**
   * テキストエリアの自動リサイズ
   * @param {ChangeEvent<HTMLTextAreaElement>} e - 変更イベント
   */
  const handleTextareaResize = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  /**
   * 画像選択ボタンのクリックハンドラー
   */
  const handleImageButtonClick = (): void => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  /**
   * 画像ファイル選択時のハンドラー
   * @param {ChangeEvent<HTMLInputElement>} e - 変更イベント
   */
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files;
    if (!files) return;

    // 最大4枚まで
    const newFiles = Array.from(files).slice(0, 4 - imageFiles.length);
    if (newFiles.length === 0) return;

    setImageFiles((prev: File[]) => [...prev, ...newFiles]);

    // プレビュー用URL生成
    newFiles.forEach((file) => {
      const url = URL.createObjectURL(file);
      setImageUrls((prev: string[]) => [...prev, url]);
    });
  };

  /**
   * 画像削除ハンドラー
   * @param {number} index - 削除する画像のインデックス
   */
  const handleRemoveImage = (index: number): void => {
    // プレビューURL解放
    if (imageUrls[index]) {
      URL.revokeObjectURL(imageUrls[index]!);
    }

    setImageFiles((prev: File[]) => prev.filter((_, i) => i !== index));
    setImageUrls((prev: string[]) => prev.filter((_, i) => i !== index));
  };

  /**
   * フォーム送信ハンドラー
   * @param {FormEvent<HTMLFormElement>} e - フォーム送信イベント
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!content.trim() && imageFiles.length === 0) {
      return;
    }

    try {
      // 実際のアプリでは、ここで画像アップロードを行い、
      // そのURLをimageUrlsとして使用します
      // この例では簡略化のため、プレビューURLをそのまま使用
      const postData: CreatePostData = {
        content,
        imageUrls: imageUrls ?? [],
      };

      await onSubmit(postData);

      // フォームをリセット
      setContent('');

      // 画像のクリーンアップ
      imageUrls.forEach((url: string) => URL.revokeObjectURL(url));
      setImageFiles([]);
      setImageUrls([]);
    } catch (error) {
      console.error('投稿送信エラー:', error);
    }
  };

  // 送信ボタンの有効状態
  const isSubmitDisabled = (content.trim() === '' && imageFiles.length === 0) || isSubmitting;

  return (
    <form
      className="bg-white rounded-lg shadow-sm p-4 mb-6"
      // Fix: Wrap async handleSubmit in a void-returning function
      onSubmit={(e) => {
        void handleSubmit(e);
      }}
    >
      <textarea
        className="w-full border-none resize-none outline-none min-h-[60px] mb-3 placeholder-gray-400"
        placeholder={placeholder}
        value={content}
        onChange={(e) => {
          handleContentChange(e);
          handleTextareaResize(e);
        }}
        disabled={isSubmitting}
      />

      {/* 画像プレビュー */}
      {imageUrls.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-3">
          {imageUrls.map((url: string, index: number) => (
            <div key={index} className="relative group h-32">
              <Image
                src={url}
                alt={`添付画像 ${index + 1}`}
                fill
                className="object-cover rounded-lg"
                sizes="50vw"
              />
              <button
                type="button"
                className="absolute top-1 right-1 bg-gray-800 bg-opacity-70 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemoveImage(index)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 投稿アクション */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
            disabled={isSubmitting || imageFiles.length >= 4}
          />
          <button
            type="button"
            className={`p-2 rounded-full text-gray-500 hover:bg-gray-100 ${
              imageFiles.length >= 4 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={handleImageButtonClick}
            disabled={isSubmitting || imageFiles.length >= 4}
          >
            📷
          </button>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={isSubmitDisabled}
          isLoading={isSubmitting}
        >
          投稿する
        </Button>
      </div>
    </form>
  );
};
