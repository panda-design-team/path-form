import {createContext, useContext, useRef} from 'react';
import {getInternalRef, FormRefObject} from './core';
import {FormProviderProps} from './interface';

const FormContext = createContext<FormRefObject<any>>(null as any);

export function FormProvider<T extends object = any>(props: FormProviderProps<T>) {
    const initialValueRef = useRef<T | (() => T) | undefined>(props.initialValues);
    const ref = useRef<FormRefObject<T>>(null as unknown as FormRefObject<T>);
    initialValueRef.current = props.initialValues;
    if (ref.current === null) {
        ref.current = getInternalRef<T>(props, initialValueRef);
    }
    return <FormContext.Provider value={ref.current}>{props.children}</FormContext.Provider>;
}

export function useFormContext<T extends object = any>() {
    const refCurrent: FormRefObject<T> = useContext(FormContext);
    return refCurrent;
}
