import * as React from 'react';
import { Field } from 'formik';
import MaskedInput from 'react-text-mask';

interface Props {
    mask: (string | RegExp)[];
    name: string;
    placeholder?: string;
    className?: string;
}

export const MaskedField: React.FC<Props> = ({ mask, name, placeholder, className }) => {
    return (
        <Field
            name={name}
            type="text"
        >
            {({ field }: any) => {
                return (
                    <MaskedInput
                        mask={mask}
                        {...field}
                        placeholder={placeholder}
                        className={className}
                    />
                );
            }}
        </Field>
    );
};
