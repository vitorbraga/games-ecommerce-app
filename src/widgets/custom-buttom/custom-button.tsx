import * as React from 'react';
import classNames from 'classnames';
import Button from 'react-bootstrap/Button';

import styles from './custom-button.module.scss';

interface Props {
    type?: 'submit' | 'button';
    variant: 'primary' | 'secondary';
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
}

export class CustomButton extends React.PureComponent<Props, never> {
    public render() {
        const { variant, onClick, className, children, type, disabled } = this.props;

        return (
            <Button
                type={type || 'button'}
                onClick={onClick}
                className={classNames(styles[variant], className)}
                disabled={disabled}
            >
                {children}
            </Button>
        );
    }
}
