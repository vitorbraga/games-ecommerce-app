import * as React from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';

import styles from './search-bar.module.scss';

interface Props {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyUp: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    onClickSearch: () => void;
    value: string;
}

export const SearchBar: React.FC<Props> = (props) => {
    return (
        <div className={styles['search-bar']}>
            <InputGroup className={styles['search-bar-input-group']}>
                <FormControl
                    className={styles['text-input']}
                    placeholder="What are you looking for?"
                    onChange={props.onChange}
                    onKeyUp={props.onKeyUp}
                    value={props.value}
                />
                <InputGroup.Append>
                    <Button
                        className={styles['search-button']}
                        variant="outline-secondary"
                        onClick={props.onClickSearch}
                    >
                        Search
                    </Button>
                </InputGroup.Append>
            </InputGroup>
        </div>
    );
};
