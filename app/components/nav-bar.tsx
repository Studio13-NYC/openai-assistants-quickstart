"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./nav-bar.module.css";

const NavBar = () => {
  const pathname = usePathname();
  const branchName = process.env.NEXT_PUBLIC_BRANCH_NAME || "UNIFII";

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <div className={styles.branchName}>{branchName}</div>
        <Link href="/" className={pathname === "/" ? styles.active : ""}>
          Home
        </Link>
        <Link 
          href="/chat" 
          className={pathname === "/chat" ? styles.active : ""}
        >
          Chat
        </Link>
        <Link 
          href="/playground" 
          className={pathname === "/playground" ? styles.active : ""}
        >
          API Playground
        </Link>
        <Link 
          href="/settings" 
          className={pathname === "/settings" ? styles.active : ""}
        >
          Settings
        </Link>
      </div>
    </nav>
  );
};

export default NavBar; 