'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from '../styles/page.module.css';

const getAuthUrl = () => {
  const clientId = process.env.NEXT_PUBLIC_CLIENTID;
  const redirectUri = process.env.NEXT_PUBLIC_REDIRECTURI;
  return `https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=identify%20email%20guilds`;
};

export default function Home() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const currentTheme = localStorage.getItem('theme') || 'light';
    setTheme(currentTheme);
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>DiscLogger</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.toggleContainer}>
          <button onClick={toggleTheme} className={styles.toggleButton}>
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
        <div className={styles.contentBox}>
          <h1 className={styles.header}>DiscLogger</h1>
          <Link href={getAuthUrl()} className={styles.link}>
            Login with Discord
          </Link>
          <footer className={styles.footer}>
            <p>OAuth2 integration powered by Discord</p>
          </footer>
        </div>
      </div>
    </>
  );
}