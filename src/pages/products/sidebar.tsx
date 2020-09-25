import * as React from 'react';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import { getFullTreeOfCategories } from '../../modules/category/api';
import { Category } from '../../modules/category/model';
import { CustomSpinner } from '../../widgets/custom-spinner/custom-spinner';

import styles from './sidebar.module.scss';

interface Props {
    selectedCategories: string[];
    onSelectFilter: (categoryId: string, checked: boolean) => void;
}

export const Sidebar: React.FC<Props> = (props) => {
    const [categories, setCategories] = React.useState<Category[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [fetchError, setFetchError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const fetchCategories = async () => {
            try {
                // TODO Improve this code, putting all together in the same object to make one single call
                setLoading(true);
                const categories = await getFullTreeOfCategories();
                setCategories(categories);
                setLoading(false);
            } catch (error) {
                setFetchError(error.message);
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
        if (loading) {
            return <CustomSpinner />;
        } else if (fetchError) {
            return <Alert variant="danger" style={{ marginTop: '10px' }}>{fetchError}</Alert>;
        } else {
            return renderCategories(categories);
        }
    };

    return (
        <div className={styles.sidebar}>
            {renderSidebarContent()}
        </div>
    );
};
