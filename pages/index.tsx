import Link from 'next/link';
import styles from '@styles/home.module.scss';
import Image from 'next/image';

const ConstructionPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.buttonContainer}>
        <div className={styles.buttonItem}>
          <div className={styles.logoContainer}>
            <Image src="/logo.jpg" alt="Logo 1" layout="fill" objectFit="contain" />
          </div>
          <Link legacyBehavior href="/cisco">
            <a className={styles.button}>Cisco</a>
          </Link>
        </div>
        <div className={`${styles.buttonItem} ${styles.secondButton}`}>
          <div className={styles.logoContainer}>
            <Image src="/logo2.jpg" alt="Logo 2" width={320} height={320} />
          </div>
          <Link legacyBehavior href="/fortinet">
            <a className={styles.button}>NSE4</a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ConstructionPage;
