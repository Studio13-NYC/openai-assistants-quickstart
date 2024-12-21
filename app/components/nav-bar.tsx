"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./nav-bar.module.css";

const NavBar = () => {
  const pathname = usePathname();

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
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