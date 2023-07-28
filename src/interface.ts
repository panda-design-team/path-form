import {ReactNode} from 'react';
import {FormRefObject} from './core';

export interface FormProviderProps<T> {
    initialValues?: T;
    // initialErrors?: any;
    // initialTouched?: any;
    onInternalRefCreate?: (refCurrent: FormRefObject<T>) => FormRefObject<T>;
    validate?: (values: T) => any;
    children: ReactNode;
}

export interface FieldState<V = any> {
    value: V;
    error: string;
    touched: boolean;
}

export type FieldValidate<V = any> = (value: V) => void | string | Promise<void | string>;
