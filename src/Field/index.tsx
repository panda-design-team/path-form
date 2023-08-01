import {Children, cloneElement, isValidElement, ReactNode, useCallback, useEffect, useMemo, useRef} from 'react';
import {ValidateStatus} from 'antd/es/form/FormItem';
import {Path, PathSegment} from '../path';
import {useFormContext} from '../Context';
import {useField, useFormSubmitCount} from '../storeHooks';
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
    const {setFieldValue, setFieldValidate} = formContext;
    const removeValidateCallbackRef = useRef<() => void>();

    if (validate) {
        removeValidateCallbackRef.current = setFieldValidate(name, validate);
    }

    useEffect(
        () => {
            return () => {
                removeValidateCallbackRef.current?.();
            };
        },
        []
    );

    const errorProps = useMemo(
        (): {validateStatus?: ValidateStatus, help?: string} => {
            if (submitCount === 0 && !touched && !enableErrorWhenUntouched) {
                return {};
            }
            return {
                validateStatus: error ? 'error' : undefined,
                help: error,
            };
        },
        [error, submitCount, touched, enableErrorWhenUntouched]
    );

    const handleChange = useCallback(
        (e: any) => {
            const value = e?.target
                ? (props.type === 'checkbox' ? e.target.checked : e.target.value)
                : e;
            setFieldValue(name, value);
        },
        [name, props.type, setFieldValue]
    );

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
