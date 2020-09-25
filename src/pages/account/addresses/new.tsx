import React from 'react';
import Router from 'next/router';
import classNames from 'classnames';
import * as Yup from 'yup';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { connect } from 'react-redux';
import Alert from 'react-bootstrap/Alert';
import { BaseStructure } from '../../../components/account/base-structure';
import { SideMenuItemEnum } from '../../../components/account/side-menu';
import { Layout } from '../../../components/layout';
import * as AddressApi from '../../../modules/address/api';
import * as CountryApi from '../../../modules/countries/api';
import { User } from '../../../modules/user/model';
import { getUser } from '../../../modules/user/selector';
import { AppState } from '../../../store';
import { FetchStatus, FetchStatusEnum } from '../../../utils/api-helper';
import { withAuthenticationCheck } from '../../../utils/authentication-wrapper';
import { Country } from '../../../modules/countries/model';
import { CustomButton } from '../../../widgets/custom-buttom/custom-button';
import { getErrorMessage } from '../../../utils/messages-mapper';

import styles from './new.module.scss';
import { CustomSpinner } from '../../../widgets/custom-spinner/custom-spinner';

interface Props {
    authToken: string;
    user: User;
}

interface State {
    fetchStatus: FetchStatus;
    fetchError: string | null;
    allCountries: Country[];
}

interface FormData {
    fullName: string;
    line1: string;
    line2?: string;
    city: string;
    countryId: string;
    zipCode: string;
    info?: string;
    mainAddress: boolean;
}

class NewAddressPage extends React.PureComponent<Props, State> {
    public state: State = {
        fetchStatus: FetchStatusEnum.initial,
        fetchError: null,
        allCountries: []
    };

    private formInitialValues: FormData = {
        fullName: '',
        line1: '',
        line2: undefined,
        city: '',
        countryId: '',
        zipCode: '',
        info: undefined,
        mainAddress: false
    };

    private validationSchema = Yup.object().shape({
        fullName: Yup.string().required('Full name is required'),
        line1: Yup.string().required('Line 1 is required'),
        city: Yup.string().required('City is required'),
        countryId: Yup.string().required('Country is required'),
        zipCode: Yup.string().required('Zip code is required')
    });

    public componentDidMount() {
        this.setState({ fetchStatus: FetchStatusEnum.loading }, async () => {
            try {
                const allCountries = await CountryApi.getAllCountries();
                this.setState({ fetchStatus: FetchStatusEnum.success, allCountries });
            } catch (error) {
                this.setState({ fetchStatus: FetchStatusEnum.failure, fetchError: error.message });
            }
        });
    }

    private handleSubmit = async (formData: FormData) => {
        this.setState({ fetchStatus: FetchStatusEnum.loading }, async () => {
            try {
                const { user: { id: userId }, authToken } = this.props;

                const addressesOrFieldsWithErrors = await AddressApi.createAddress(userId, formData, authToken);
                if ('id' in addressesOrFieldsWithErrors) {
                    Router.push('/account/addresses');
                } else {
                    const fieldsWithErrors = addressesOrFieldsWithErrors;
                    if (fieldsWithErrors.length > 0) {
                        this.setState({ fetchStatus: FetchStatusEnum.failure, fetchError: getErrorMessage(Object.values(fieldsWithErrors[0].constraints)[0]) });
                    }
                }
            } catch (error) {
                this.setState({ fetchStatus: FetchStatusEnum.failure, fetchError: error.message });
            }
        });
    };

    private renderFetchStatus() {
        const { fetchStatus, fetchError } = this.state;

        if (fetchStatus === FetchStatusEnum.loading) {
            return <CustomSpinner />;
        } else if (fetchStatus === FetchStatusEnum.failure) {
            return <Alert variant="danger" style={{ marginTop: '12px' }}>{fetchError}</Alert>;
        }

        return null;
    }

    public render() {
        return (
            <Layout title="My addresses" showNav={true} customContentClass={styles['custom-layout-content']}>
                <BaseStructure activeMenuItem={SideMenuItemEnum.addresses}>
                    <div className={styles['form-wrapper']}>
                        <h3>Register a new address</h3>
                        {this.renderFetchStatus()}
                        <Formik
                            initialValues={this.formInitialValues}
                            validationSchema={this.validationSchema}
                            onSubmit={this.handleSubmit}
                        >
                            {({ errors, touched }) => {
                                return (
                                    <Form style={{ marginTop: '20px' }}>
                                        <div className="form-group">
                                            <label htmlFor="fullName">Full name *</label>
                                            <Field
                                                name="fullName"
                                                placeholder="John Doe"
                                                type="text"
                                                className={classNames('form-control', styles['text-input'], { 'is-invalid': errors.fullName && touched.fullName })}
                                            />
                                            <ErrorMessage name="fullName" component="div" className="invalid-feedback" />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="line1">Line 1 *</label>
                                            <Field
                                                name="line1"
                                                placeholder="Leidsestraat 97"
                                                type="text"
                                                className={classNames('form-control', styles['text-input'], { 'is-invalid': errors.line1 && touched.line1 })}
                                            />
                                            <ErrorMessage name="line1" component="div" className="invalid-feedback" />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="line2">Line 2</label>
                                            <Field
                                                name="line2"
                                                type="text"
                                                placeholder="Apartment 102"
                                                className={classNames('form-control', styles['text-input'])}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="city">City *</label>
                                            <Field
                                                name="city"
                                                type="text"
                                                placeholder="Amsterdam"
                                                className={classNames('form-control', styles['text-input'], { 'is-invalid': errors.city && touched.city })}
                                            />
                                            <ErrorMessage name="city" component="div" className="invalid-feedback" />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="city">Country *</label>
                                            <Field
                                                name="countryId"
                                                as="select"
                                                className={classNames('form-control', styles['dropdown-input'], { 'is-invalid': errors.countryId && touched.countryId })}
                                            >
                                                <option>Select the country</option>
                                                {this.state.allCountries.map((country, index) => <option key={`country-${index}`} value={country.id}>{country.name}</option>)}
                                            </Field>
                                            <ErrorMessage name="countryId" component="div" className="invalid-feedback" />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="city">Zip code *</label>
                                            <Field
                                                name="zipCode"
                                                type="text"
                                                placeholder="1011 AC"
                                                className={classNames('form-control', styles['text-input'], { 'is-invalid': errors.zipCode && touched.zipCode })}
                                            />
                                            <ErrorMessage name="zipCode" component="div" className="invalid-feedback" />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="city">Additional info</label>
                                            <Field
                                                name="info"
                                                type="text"
                                                placeholder="Close to the supermarket"
                                                className={classNames('form-control', styles['text-input'])}
                                            />
                                        </div>
                                        <div className="form-group form-check">
                                            <Field type="checkbox" name="mainAddress" className={'form-check-input ' + (errors.mainAddress && touched.mainAddress ? ' is-invalid' : '')} />
                                            <label htmlFor="mainAddress" className="form-check-label">Set as main address</label>
                                            <ErrorMessage name="mainAddress" component="div" className="invalid-feedback" />
                                        </div>
                                        <div className="form-group">
                                            <CustomButton type="submit" variant="primary" className={styles['submit-button']}>Register address</CustomButton>
                                        </div>
                                    </Form>
                                );
                            }}
                        </Formik>
                    </div>
                </BaseStructure>
            </Layout>
        );
    }
};

const mapStateToProps = (state: AppState) => ({
    user: getUser(state.user)
});

export default connect(mapStateToProps)(withAuthenticationCheck(NewAddressPage));
