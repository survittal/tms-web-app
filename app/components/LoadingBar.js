//LoadingBar.jsx
"use client";
import styles from "./LoadingBar.module.css";
import { useOnNavigate } from "../hooks/useOnNavigate";

export default function LoadingBar() {
  const loading = useOnNavigate();
  return <div aria-busy={loading} className={styles.loading}></div>;
}
