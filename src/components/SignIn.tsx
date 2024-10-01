'use client';

import { useFormState } from 'react-dom';
import { signInAccount } from '@/actions/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const SignInPage = () => {
  const [state, action] = useFormState(signInAccount, {
    message: '',
  });

  return (
    <div className="flex justify-center items-center p-4 bg-secondary">
      <form
        action={action}
        className="flex flex-col justify-center items-center p-4 gap-2 w-2/3 min-h-[50%] bg-white rounded-xl"
      >
        <h3>Sign in</h3>
        <div className="flex flex-col w-2/3 mb-2">
          <label htmlFor="email">Email</label>
          <Input
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
          />
          <p className="text-red-500 pl-4 text-xs">{state?.message?.email}</p>
        </div>
        <div className="flex flex-col w-2/3 mb-2">
          <label htmlFor="password">Password</label>
          <Input
            name="password"
            type="password"
            id="password"
            placeholder="Enter your password"
          />
          <p className="text-red-500 pl-4 text-xs">
            {state?.message?.password}
          </p>
        </div>
        <p className="text-red-500 pl-4">{state?.message?.error}</p>
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
};

export default SignInPage;
