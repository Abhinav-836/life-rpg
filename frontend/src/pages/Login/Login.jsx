import LoginHeader from './components/LoginHeader.jsx';
import LoginForm from './components/LoginForm.jsx';
import SocialLogin from './components/SocialLogin.jsx';
import LoginFooter from './components/LoginFooter.jsx';

export default function Login() {
  return (
    <div className="w-full max-w-sm">
      <div className="p-7 sm:p-8 rounded-2xl bg-surface-2/30 backdrop-blur-xl border border-white/20 shadow-2xl">
        <LoginHeader />
        <LoginForm />
        <SocialLogin />
      </div>
      <LoginFooter />
    </div>
  );
}
