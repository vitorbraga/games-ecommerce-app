import * as React from 'react';
import { AccountSideMenu, SideMenuItemName } from './side-menu';

import styles from './base-structure.module.scss';

interface Props {
    activeMenuItem: SideMenuItemName;
}

export const BaseStructure: React.FC<Props> = ({ activeMenuItem, children }) => {
    return (
        <div className={styles['base-structure-page']}>
            <div className={styles['base-container']}>
                <AccountSideMenu activeMenuItem={activeMenuItem} />
                <div className={styles['right-wrapper']}>
                    {children}
                </div>
            </div>
        </div>
    );
};
