import * as React from 'react';
import { Image } from 'react-bootstrap';
import styles from './star-rating.module.scss';

interface Props {
    numberOfStars: number;
}

export const StarRating: React.FC<Props> = ({ numberOfStars }) => {
    const MAXIMUM_STARS = 5;

    const output: React.ReactNode[] = [];
    for (let i = 0; i < numberOfStars; i++) {
        output.push(<Image src="/star-yellow.svg" className={styles.icon} key={`star-yellow-${i}`} />);
    }

    for (let i = 0; i < MAXIMUM_STARS - numberOfStars; i++) {
        output.push(<Image src="/star-empty.svg" className={styles.icon} key={`star-empty-${i}`} />);
    }

    return <div className={styles['star-rating']}>{output}</div>;
};
