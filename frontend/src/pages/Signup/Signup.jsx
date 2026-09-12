import SignupHeader from './components/SignupHeader.jsx';
import SignupForm from './components/SignupForm.jsx';
import SignupFooter from './components/SignupFooter.jsx';

export default function Signup() {
  return (
    <div className="w-full max-w-sm">
      <div className="p-7 sm:p-8 rounded-2xl bg-surface-2/30 backdrop-blur-xl border border-white/20 shadow-2xl">
        <SignupHeader />
        <SignupForm />
      </div>
      <SignupFooter />
    </div>
  );
}
