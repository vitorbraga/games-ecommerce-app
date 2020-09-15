import * as React from 'react';
import classNames from 'classnames';
import Image from 'react-bootstrap/Image';
import ListGroup from 'react-bootstrap/ListGroup';

import styles from './side-menu.module.scss';

export enum SideMenuItemEnum {
    account = 'account',
    orders = 'orders',
    reviews = 'reviews',
    changePassword = 'changePassword'
}

export type SideMenuItemName = keyof typeof SideMenuItemEnum;

interface Props {
    activeMenuItem: SideMenuItemName;
}

export const AccountSideMenu: React.FC<Props> = ({ activeMenuItem }) => {
    const menuRouteMapper = {
        account: { path: '/account', icon: '/account_circle.svg', label: 'Account overview' },
        orders: { path: '/account/orders', icon: '/list_bulleted.svg', label: 'My orders' },
        reviews: { path: '/account/reviews', icon: '/feedback.svg', label: 'My reviews' },
        changePassword: { path: '/account/change-password', icon: '/lock.svg', label: 'Change password' }
    };

    const activeKey = menuRouteMapper[activeMenuItem];

    return (
        <div className={styles['side-menu']}>
            <ListGroup defaultActiveKey="orders" activeKey={activeKey.path}>
                {(Object.keys(SideMenuItemEnum) as SideMenuItemName[]).map((item) => {
                    const menuInfo = menuRouteMapper[item];
                    const isActive = activeKey.path === menuInfo.path;

                    return (
                        <ListGroup.Item
                            action
                            href={menuInfo.path}
                            className={classNames(styles['list-item'], { [styles.active]: isActive })}
                            key={`item-${item}`}
                        >
                            <Image src={menuInfo.icon} className={styles.icon} />
                            {menuInfo.label}
                        </ListGroup.Item>
                    );
                })}
            </ListGroup>
        </div>
    );
};
