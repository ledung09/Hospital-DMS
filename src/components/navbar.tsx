"use client";

import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { FC, HTMLAttributes, ReactNode } from "react";
import {
  HiOutlineCash,
  HiOutlineClipboardList,
  HiOutlineHome,
  HiOutlineLogout,
  HiOutlineSearchCircle,
  HiOutlineUserAdd,
} from "react-icons/hi";
import Image from "next/image";
import { signOut, signIn } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

export default function Navbar() {
  return (
    <div className="fixed top-0 left-0 w-60 px-4 py-8 h-full bg-primary text-white flex flex-col gap-y-8">
      <Logo/>
      <NavbarLinks/>
      {/* <SignIn/> */}
      <Button variant="secondary" size="lg" onClick={() => signIn()} className="mt-auto">
        Sign In
      </Button>
    </div>
  );
}

const Logo: FC = () => {
  return (
    <Link href="/" className="flex items-center gap-x-1">
      <Image
        src="/header/logo.png"
        width={50}
        height={50}
        priority={true}
        alt="Logo"
      />
      <p className="text-2xl font-bold mt-1">HospitalX</p>
    </Link>
  )
}

const NavbarLinks: FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  const pathname = usePathname();
  console.log(pathname);
  const navbar = [
    {
      name: "home",
      href: "/",
      icon: <HiOutlineHome />,
    },
    {
      name: "find patient",
      href: "/findpatient",
      icon: <HiOutlineSearchCircle />,
    },
    {
      name: "add patient",
      href: "/addpatient",
      icon: <HiOutlineUserAdd />,
    },
    {
      name: "doctor cases",
      href: "/case",
      icon: <HiOutlineClipboardList />,
    },
    {
      name: "payment report",
      href: "/payment",
      icon: <HiOutlineCash />,
    },
  ];

  return (
    <div className={cn("flex flex-col gap-y-6", className)} {...props}>
      {navbar.map((nav, idx) => {
        return (
          <div key={idx} className="flex items-center h-8 w-fit group/navlink">
            <p className={cn(
                "text-2xl font-bold w-5 text-transparent group-hover/navlink:text-white",
                pathname === nav.href && "text-inherit"
              )}
            >
              |
            </p>
            <NavbarLink icon={nav.icon} href={nav.href}>
              {nav.name}
            </NavbarLink>
          </div>
        );
      })}
    </div>
  );
};

interface NavLink extends LinkProps {
  icon: ReactNode;
  children: ReactNode;
}

const NavbarLink: FC<NavLink> = ({ icon, children, ...props }) => {
  return (
    <Link {...props}>
      <div className="flex gap-x-2.5 items-center text-white text-xl">
        {icon}
        <p className="text-lg capitalize font-normal">{children}</p>
      </div>
    </Link>
  );
};

const SignIn: FC = () => {
  return (
    <div className="w-100 flex items-center gap-x-2 text-white font-medium">
      <Image
        src="/Tutor1.png"
        width={56}
        height={56}
        priority={true}
        alt="Tutor1"
        className="rounded-full mr-1"
      />
      <div className="flex flex-col gap-y-0.5">
        <p>Nhan Nguyen</p>
        <p>Manager</p>
      </div>
      <button className="ml-auto text-2xl" onClick={() => signOut()}>
        <HiOutlineLogout/>
      </button>
      
    </div>
  )
}