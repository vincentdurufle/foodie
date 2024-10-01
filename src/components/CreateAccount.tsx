'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createAccount } from '@/actions/auth';
import { useFormState } from 'react-dom';

const CreateAccount = () => {
  const [state, action] = useFormState(createAccount, {
    message: '',
  });

  return (
    <form
      action={action}
      className="flex flex-col justify-center h-full items-center p-4 gap-2"
    >
      <h3>Create an account</h3>
      <div className="flex flex-col w-2/3 mb-2">
        <label htmlFor="username">Username</label>
        <Input
          id="username"
          name="username"
          placeholder="Enter your username"
        />
        <p className="text-red-500 pl-4 text-sm">{state?.message?.username}</p>
      </div>
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
        <p className="text-red-500 pl-4 text-xs">{state?.message?.password}</p>
      </div>
      <p className="text-red-500 pl-4">{state?.message?.error}</p>
      <Button type="submit">Submit</Button>
    </form>
  );
};

export default CreateAccount;
