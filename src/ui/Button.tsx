'use client';
import React from 'react';

/**
 * ボタンコンポーネントのProps型
 * @param {React.ReactNode} children - ボタン内部の要素
 * @param {'primary' | 'secondary'} [variant] - ボタンのバリアント
 * @returns {JSX.Element} ボタン要素
 */
export type ButtonProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'md' | 'lg' | 'sm';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  isLoading?: boolean;
};

const styles = {
  primary: {
    md: 'rounded-2xl px-4 py-2 bg-primary text-white shadow-sm',
    lg: 'rounded-2xl px-6 py-3 bg-primary text-white shadow-sm',
    sm: 'rounded-2xl px-2 py-1 bg-primary text-white shadow-sm',
  },
  secondary: {
    md: 'rounded-2xl px-4 py-2 bg-secondary text-gray-900 shadow-sm',
    lg: 'rounded-2xl px-6 py-3 bg-secondary text-gray-900 shadow-sm',
    sm: 'rounded-2xl px-2 py-1 bg-secondary text-gray-900 shadow-sm',
  },
} as const;

/**
 * 汎用的なボタンコンポーネント。
 *
 * @param root0 - ボタンのprops
 * @param root0.children - ボタン内部の要素
 * @param root0.variant - バリアント種別
 * @param root0.size - サイズ種別
 * @param root0.type - ボタンタイプ
 * @param root0.disabled - 非活性フラグ
 * @param root0.isLoading - ローディング状態
 * @returns ボタン要素
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled,
  isLoading,
}: ButtonProps) => (
  <button type={type} className={styles[variant][size]} disabled={disabled || isLoading}>
    {children}
  </button>
);
