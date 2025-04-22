/**
 * サインインページのコンポーネント (`/signin` - モーダル表示などを想定)
 * (auth) ルートグループ内に配置される
 */
import type { JSX } from 'react';
// import { SignInForm } from '@/src/features/auth/components'; // 仮

/**
 * サインインページコンポーネント
 * @returns {JSX.Element} サインインページの要素
 */
const SignInPage = (): JSX.Element => {
  return (
    <div>
      <h2>Sign In</h2>
      {/* <SignInForm /> */}
      <p>Sign-in form will be displayed here (potentially in a modal).</p>
    </div>
  );
};

export default SignInPage;
