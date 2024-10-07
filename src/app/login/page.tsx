import CreateAccount from '@/components/CreateAccount';
import SignIn from '@/components/SignIn';

const LoginPage = () => {
  return (
    <div className="grid grid-cols-2 w-full">
      <CreateAccount />
      <SignIn />
    </div>
  );
};

export default LoginPage;
