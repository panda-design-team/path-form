import {Children, cloneElement, isValidElement, ReactNode, useEffect, useMemo} from 'react';
import {ValidateStatus} from 'antd/es/form/FormItem';
import {encodePath, Path, PathSegment} from '../path';
import {useFormContext} from '../Context';
import {useField, useFieldHandler} from '../useField';
import {useFormSubmitCount} from '../useFormMeta';
import {FieldValidate} from '../interface';
import {FieldLayout, FieldLayoutProps} from './FieldLayout';
import {useFieldDefaultProps} from './FieldDefaultProps';

export interface FieldProps extends FieldLayoutProps {
    name: Path | PathSegment;
    type?: 'checkbox';
    validate?: FieldValidate;
    // 开源版本没有以下的
    extraChildren?: ReactNode;
    enableErrorWhenUntouched?: boolean;
}

export const Field = (props: FieldProps) => {
    const {
        name,
        type,
        validate,
        children,
        extraChildren,
        enableErrorWhenUntouched,
        ...layoutProps
    } = props;
    const {value, error, touched} = useField(name);
    const defaultProps = useFieldDefaultProps();
    const submitCount = useFormSubmitCount();
    const formContext = useFormContext();
    const {setFieldValidate} = formContext;

    useEffect(
        () => {
            setFieldValidate(name, validate);
            return () => {
                setFieldValidate(name, undefined);
            };
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [encodePath(name), setFieldValidate, validate]
    );

    const errorProps = useMemo(
        (): {validateStatus?: ValidateStatus, help?: string} => {
            if (submitCount === 0 && !touched && !enableErrorWhenUntouched) {
                return {};
            }
            if (typeof error === 'object' && error !== null) {
                return {};
            }
            return {
                validateStatus: error ? 'error' : undefined,
                help: error,
            };
        },
        [error, submitCount, touched, enableErrorWhenUntouched]
    );

    const handleChange = useFieldHandler(name, {type});

    const clonedChildren = Children.map(children as any, child => {
        if (isValidElement(child)) {
            const childProps: any = child?.props;
            const valueKey = type === 'checkbox' ? 'checked' : 'value';
            return cloneElement<any>(child, {
                [valueKey]: childProps[valueKey] ?? value,
                onChange: childProps.onChange ?? handleChange,
                disabled: defaultProps.disabled || childProps.disabled,
            });
        }
        return child;
    });

    return (
        <FieldLayout {...errorProps} {...layoutProps} extraChildren={extraChildren}>
            {clonedChildren}
        </FieldLayout>
    );
};
