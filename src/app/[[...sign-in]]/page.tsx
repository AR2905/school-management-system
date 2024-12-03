"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";  
import Spinner from "./spiner";

const LoginPage = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [loading, setLoading] = useState(false); 

  const router = useRouter();
 

  const handleLoading = () => {
    setLoading(true);
    router.refresh();

  };

  // Error handler function
  const handleError = (errorMessage: string) => { 
    setLoading(false) 
    router.refresh();

  };

  useEffect(() => {
    const role = user?.publicMetadata.role;

    if (isSignedIn && role) {
      router.push(`/${role}`);
    } else {
      setLoading(false);
    }
    router.refresh();
    setLoading(false);
  }, [isLoaded, user, router, isSignedIn]);

  if (isSignedIn) {
    return <Spinner />; // You can show a loading message or spinner here
  }
  
  return (
    <div className="h-screen flex items-center justify-center bg-lamaSkyLight">
      <SignIn.Root>
        <SignIn.Step
          name="start"
          className="bg-white p-12 rounded-md shadow-2xl flex flex-col gap-2"
        >
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Image src="/logo.png" alt="" width={24} height={24} />
            School
          </h1>
          <h2 className="text-gray-400">Sign in to your account</h2>

          {/* Displaying global error */}
          <Clerk.GlobalError className="text-sm text-red-400" />

          {/* Username field */}
          <Clerk.Field name="identifier" className="flex flex-col gap-2">
            <Clerk.Label className="text-xs text-gray-500">
              Username
            </Clerk.Label>
            <Clerk.Input
              type="text"
              required
              className="p-2 rounded-md ring-1 ring-gray-300"
            />
            {/* Clerk.FieldError expects a render function that returns ReactNode */}
            <Clerk.FieldError className="text-xs text-red-400">
              {(fieldError) => {
                if (fieldError) {
                  handleError(fieldError.message); // Call handleError if there's a field error
                  return null; // Don't render anything here, we'll display the error separately
                }
                return null; // No error, so return nothing
              }}
            </Clerk.FieldError>
          </Clerk.Field>

          {/* Password field */}
          <Clerk.Field name="password" className="flex flex-col gap-2">
            <Clerk.Label className="text-xs text-gray-500">
              Password
            </Clerk.Label>
            <Clerk.Input
              type="password"
              required
              className="p-2 rounded-md ring-1 ring-gray-300"
            />
            {/* Handle error for password field similarly */}
            <Clerk.FieldError className="text-xs text-red-400">
              {(fieldError) => {
                if (fieldError) {
                  handleError(fieldError.message); // Call handleError if there's a field error
                  return null; // Don't render anything here
                }
                return null; // No error, so return nothing
              }}
            </Clerk.FieldError>
          </Clerk.Field>

          {/* Display the error message globally (e.g., from field or global errors) */}
          {/* {error && <div className="text-sm text-red-500 mt-2">{error}</div>} */}

          {/* Sign In Button */}
          <SignIn.Action
            onClick={() => handleLoading()}
            submit 
            className="bg-blue-500 text-white my-1 rounded-md text-sm p-[10px]"
          >
            {loading ? <div className="cursor-not-allowed">Loading...</div> : <>Sign In</>}
          </SignIn.Action>
        </SignIn.Step>
      </SignIn.Root>
    </div>
  );
};

export default LoginPage;
