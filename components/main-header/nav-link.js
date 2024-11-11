"use client"; // Indicates that this code runs on the client side

import Link from "next/link"; // Import the Link component from Next.js for client-side navigation
import { usePathname } from "next/navigation"; // Import the usePathname hook from Next.js to get the current path
import classes from "./nav-link.module.css"; // Import CSS module for styling

// NavLink component to create a navigation link with active state styling
export default function NavLink({ href, children }) {
  const path = usePathname(); // Get the current path using the usePathname hook

  return (
    <Link
      href={href} // Set the href attribute to the provided href prop
      className={
        path.startsWith(href) // Check if the current path starts with the href
          ? `${classes.link} ${classes.active}` // If true, apply both link and active classes
          : classes.link // If false, apply only the link class
      }
    >
      {children}
    </Link>
  );
}
