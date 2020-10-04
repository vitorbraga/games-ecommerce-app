import * as React from 'react';
import Form from 'react-bootstrap/Form';
import { getFullTreeOfCategories } from '../../modules/category/api';
import { Category } from '../../modules/category/model';
import { CustomSpinner } from '../custom-spinner/custom-spinner';
import { CustomStatusBox } from '../custom-status-box/custom-status-box';
import { FetchState, FetchStatusEnum } from '../../utils/api-helper';

import styles from './sidebar.module.scss';

interface Props {
    selectedCategories: string[];
    onSelectFilter: (categoryId: string, checked: boolean) => void;
}

export const Sidebar: React.FC<Props> = (props) => {
    const [fetchState, setFetchState] = React.useState<FetchState<Category[]>>({ status: FetchStatusEnum.initial, fetchError: null, data: [] });

    React.useEffect(() => {
        const fetchCategories = async () => {
            try {
                setFetchState({ status: FetchStatusEnum.loading, fetchError: null, data: [] });
                const categories = await getFullTreeOfCategories();
                setFetchState({ status: FetchStatusEnum.success, fetchError: null, data: categories });
            } catch (error) {
                setFetchState({ status: FetchStatusEnum.failure, fetchError: error.message, data: [] });
            }
        };

        fetchCategories();
    }, []);

    const handleChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.onSelectFilter(event.target.name, event.target.checked);
    };

    // TODO future improvement: if we have more than two levels of categories, we should be
    //  able to filter by a mid-level category, not only by the "leaves"
    const renderCategories = (categories: Category[]) => {
        return categories.map((category) => {
            if (category.subCategories.length > 0) {
                return (
                    <div className={styles['category-wrapper']} key={category.id}>
                        <div className={styles.subtitle}>{category.label}</div>
                        {renderCategories(category.subCategories)}
                    </div>
                );
            }

            const checked = props.selectedCategories.includes(category.id);
            return (
                <Form.Check type="checkbox" id={category.id} className={styles['form-item']} key={category.id}>
                    <Form.Check.Input type="checkbox" name={category.id} onChange={handleChangeCheckbox} checked={checked} />
                    <Form.Check.Label>{category.label}</Form.Check.Label>
                </Form.Check>
            );
        });
    };

    const renderSidebarContent = () => {
        if (fetchState.status === FetchStatusEnum.loading) {
            return <CustomSpinner />;
        } else if (fetchState.status === FetchStatusEnum.failure) {
            return <CustomStatusBox type="danger">{fetchState.fetchError}</CustomStatusBox>;
        } else {
            return renderCategories(fetchState.data);
        }
    };

    return (
        <div className={styles.sidebar}>
            {renderSidebarContent()}
        </div>
    );
};
