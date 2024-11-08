"use client";

import { useFormState, useFormStatus } from "react-dom";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { signupAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";

const Signup = () => {
  const [state, action] = useFormState(signupAction, undefined);
  const { pending } = useFormStatus();

  return (
    <form action={action}>
      {state?.message && <p className="text-red-500">{state.message}</p>}
      <div>
        <Label htmlFor="name">Name</Label>
        <Input type="text" id="name" name="name" placeholder="John Doe" />
        {state?.error?.name && (
          <p className="text-red-500">{state.error.name}</p>
        )}
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          name="email"
          placeholder="john@doe.com"
        />
        {state?.error?.email && (
          <p className="text-red-500">{state.error.email}</p>
        )}
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          id="password"
          name="password"
          placeholder="********"
        />
        {state?.error?.password && (
          <p className="text-red-500">{state.error.password}</p>
        )}
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Signing up..." : "Sign up"}
      </Button>
    </form>
  );
};

export default Signup;
