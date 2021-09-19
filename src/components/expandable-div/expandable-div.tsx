import * as React from 'react';
import classNames from 'classnames';

import styles from './expandable-div.module.scss';

interface Props {
    text: string;
    maxChars: number;
}

export const ExpandableDiv: React.FC<Props> = ({ text, maxChars }) => {
    const [open, setOpen] = React.useState<boolean>(false);

    const handleOpenMore = () => {
        setOpen(true);
    };

    if (text.length > maxChars && !open) {
        return (
            <div className={styles['expandable-div']}>
                <div>{`${text.substr(0, maxChars)}...`}</div>
                <div><span onClick={handleOpenMore} className={classNames(styles.link, styles['more-link'])}>See more</span></div>
            </div>
        );
    }

    return (
        <div>{text}</div>
    );
};
