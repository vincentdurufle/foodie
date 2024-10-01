import CreateAccount from '@/components/CreateAccount';

const LoginPage = () => {
  return (
    <div className="grid grid-cols-2 w-full">
      <CreateAccount />
      <div className="flex p-4"></div>
    </div>
  );
};

export default LoginPage;
