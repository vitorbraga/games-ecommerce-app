import * as React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { AccountSideMenu, SideMenuItemName } from './side-menu';

import styles from './base-structure.module.scss';

interface Props {
    activeMenuItem: SideMenuItemName;
}

export const BaseStructure: React.FC<Props> = ({ activeMenuItem, children }) => {
    return (
        <div className={styles['base-structure-page']}>
            <Row className={styles['custom-row']}>
                <Col sm={3} className={styles['left-wrapper']}>
                    <AccountSideMenu activeMenuItem={activeMenuItem} />
                </Col>
                <Col sm={9} className={styles['right-wrapper']}>
                    {children}
                </Col>
            </Row>
        </div>
    );
};
