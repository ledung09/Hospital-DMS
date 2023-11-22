"use client"

import { signIn, signOut, useSession  } from "next-auth/react"
import React from 'react'

export default function SignInButton() {
  const { data: session } = useSession();
  if (session && session.user) {
    return (
      <>
          <p>{session.user.name}</p>
          <button onClick={() => signOut()}>signOut</button>
      </>
    )
  } else {
    return (
      <>
        <button onClick={() => signIn()}>singIN</button>
      </>
    )
  }
  return (
    <div>SignInButton</div>
  )
}
