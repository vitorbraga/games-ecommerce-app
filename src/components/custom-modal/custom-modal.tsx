import * as React from 'react';
import Modal from 'react-bootstrap/Modal';

import styles from './custom-modal.module.scss';

interface Props {
    title: string;
    footer?: React.ReactNode;
    show: boolean;
    onClose: () => void;
}

export const CustomModal: React.FC<Props> = ({ title, show, onClose, children, footer }) => {
    return (
        <Modal show={show} onHide={onClose} className={styles['custom-modal']} centered>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{children}</Modal.Body>
            {footer && <Modal.Footer>{footer}</Modal.Footer>}
        </Modal>
    );
};
