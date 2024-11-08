"use client";

import { useFormState, useFormStatus } from "react-dom";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { signinAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";

const Signin = () => {
  const [state, action] = useFormState(signinAction, undefined);
  const { pending } = useFormStatus();

  return (
    <form action={action}>
      {state?.message && <p className="text-red-500">{state.message}</p>}
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
        {pending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
};

export default Signin;
