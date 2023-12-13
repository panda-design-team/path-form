/* eslint-disable no-underscore-dangle, camelcase */
import {get, isEmpty, merge, set} from 'lodash';
import {encodePath, Path, PathSegment} from './path';
import {FormProviderProps, FieldState, FieldValidate} from './interface';

type Listener = () => void;
type Errors = any;
type ValueParams<V = any> = V | ((prevValue: V) => V);

export interface FormRefObject<T = any> {
    values: T;
    errors: Errors;
    touched: any;
    validate?: (values: T) => Errors | Promise<Errors>;
    validateMap: Map<string, FieldValidate>;
    isValidating: boolean;
    isSubmitting: boolean;
    submitMutex: number;
    submitCount: number;
    listeners: Set<Listener>;
    listenersMap: Map<string, Set<Listener>>;
    // utils
    emitAll: () => void;
    emitField: (name: (Path | PathSegment)) => void;
    subscribe: (listener: () => void) => () => void;
    subscribeField: (name: (Path | PathSegment), listener: () => void) => () => void;
    // getters and setters
    getTouched: () => any;
    // setTouched: (touched: any) => void;
    getErrors: () => Errors;
    // setErrors: (errors: Errors) => void;
    getValues: () => T;
    // setValues: (values: T) => void;
    getFieldTouched: (name: (Path | PathSegment)) => boolean;
    // setFieldTouched: (name: (Path | PathSegment), touched: boolean) => void;
    getFieldError: (name: (Path | PathSegment)) => string;
    // setFieldError: (name: (Path | PathSegment), error: string) => void;
    getFieldValue: <V = any>(name: (Path | PathSegment)) => V;
    setFieldValue: <V = any>(name: (Path | PathSegment), value: ValueParams<V>) => void;
    getFieldState: <V = any>(name: (Path | PathSegment)) => FieldState<V>;
    setFieldValidate: <V = any>(name: (Path | PathSegment), validate: FieldValidate<V> | undefined) => void;
    waitForValidation: () => Promise<Errors>;
}

const getInitialValue = (initialValues: any) => {
    if (typeof initialValues === 'function') {
        return initialValues();
    }
    if (initialValues === undefined) {
        return {};
    }
    return initialValues;
};

export function getInternalRef<T extends object = any>(props: FormProviderProps<T>) {
    const initialValues: T = getInitialValue(props.initialValues);
    const ref = {
        current: {
            values: initialValues,
            errors: {},
            touched: {},
            validate: props.validate,
            validateMap: new Map(),
            isValidating: false,
            isSubmitting: false,
            submitMutex: 0,
            submitCount: 0,
            listeners: new Set(),
            listenersMap: new Map(),
        } as FormRefObject<T>,
    };

    // subscription utils
    ref.current.emitAll = (): void => {
        ref.current.listenersMap.forEach(
            listeners => listeners.forEach(listener => listener())
        );
        ref.current.listeners.forEach(listener => listener());
    };

    ref.current.emitField = (name: Path | PathSegment): void => {
        const key = encodePath(name);
        const listeners = ref.current.listenersMap.get(key);
        if (!listeners) {
            return;
        }
        listeners.forEach(listener => listener());
    };

    ref.current.subscribe = (listener: () => void) => {
        ref.current.listeners.add(listener);
        return () => {
            ref.current.listeners.delete(listener);
        };
    };

    ref.current.subscribeField = (name: Path | PathSegment, listener: () => void) => {
        const key = encodePath(name);
        const listeners = ref.current.listenersMap.get(key);
        if (listeners) {
            listeners.add(listener);
        } else {
            ref.current.listenersMap.set(key, new Set([listener]));
        }
        return () => {
            const listeners = ref.current.listenersMap.get(key);
            listeners?.delete(listener);
        };
    };

    // validation utils
    let workInProgressValidationPromise: Promise<void> | null = null;
    let workInProgressValidationPromiseResolve: (() => void) | null = null;
    let workInProgressValidationPromiseFiber: Promise<void> | null = null;

    const private_pureValidation = async (): Promise<Errors> => {
        const values = ref.current.values;
        const errors = {};
        const validate = ref.current.validate;
        const validateEntries: Array<[string, FieldValidate]> = Array.from(ref.current.validateMap.entries());
        let pendingMutex = validateEntries.length + (validate ? 1 : 0);
        const promise: Promise<Errors> = new Promise(resolve => {
            if (pendingMutex === 0) {
                resolve(errors);
            }
            validateEntries.forEach(async ([key, validate]) => {
                const value = get(values, key);
                const error = await validate?.(value);
                if (error) {
                    set(errors, key, error);
                }
                pendingMutex--;
                if (pendingMutex === 0) {
                    resolve(errors);
                }
            });
            if (validate) {
                (async () => {
                    const nextErrors = await validate(values);
                    if (!isEmpty(nextErrors)) {
                        merge(errors, nextErrors);
                    }
                    pendingMutex--;
                    if (pendingMutex === 0) {
                        resolve(errors);
                    }
                })();
            }
        });
        return promise;
    };

    const private_validationWithSideEffect = () => {
        const promise = private_pureValidation();
        workInProgressValidationPromiseFiber = promise;
        promise.then(errors => {
            if (workInProgressValidationPromiseFiber === promise) {
                ref.current.errors = errors;
                ref.current.isValidating = false;
                workInProgressValidationPromiseResolve?.();
                workInProgressValidationPromise = null;
                workInProgressValidationPromiseResolve = null;
                ref.current.emitAll();
            }
        });
        return promise;
    };

    let timer: any = null;
    const private_debouncedValidation = () => {
        ref.current.isValidating = true;
        if (!workInProgressValidationPromise) {
            workInProgressValidationPromise = new Promise(resolve => {
                workInProgressValidationPromiseResolve = resolve;
            });
        }
        // workInProgressValidationPromiseFiber = null;
        clearTimeout(timer);
        timer = setTimeout(
            () => {
                private_validationWithSideEffect();
            },
            300
        );
    };

    ref.current.waitForValidation = async () => {
        await workInProgressValidationPromise;
        return ref.current.errors;
    };

    // getters and setters
    ref.current.getTouched = () => {
        return ref.current.touched;
    };

    // ref.current.setTouched = (touched: any) => {
    //     ref.current.touched = touched;
    // };

    ref.current.getErrors = () => {
        return ref.current.errors;
    };

    // ref.current.setErrors = (errors: Errors) => {
    //     ref.current.errors = errors;
    // };

    ref.current.getValues = () => {
        return ref.current.values;
    };

    // ref.current.setValues = (values: T) => {
    //     ref.current.values = values;
    //     // 全局 setValues 时，不设置 touched
    //     private_debouncedValidation();
    // };

    ref.current.getFieldTouched = (name: Path | PathSegment) => {
        return get(ref.current.touched, name);
    };

    // ref.current.setFieldTouched = (name: Path | PathSegment, touched: boolean) => {
    //     set(ref.current.touched, name, touched);
    // };

    ref.current.getFieldError = (name: Path | PathSegment) => {
        return get(ref.current.errors, name);
    };

    // ref.current.setFieldError = (name: Path | PathSegment, error: string) => {
    //     set(ref.current.errors, name, error);
    // };

    ref.current.getFieldValue = <V = any>(name: Path | PathSegment): V => {
        return get(ref.current.values, name);
    };

    ref.current.setFieldValue = <V = any>(name: Path | PathSegment, value: ValueParams<V>): void => {
        let nextValue = value;
        if (typeof value === 'function') {
            const prevValue = get(ref.current.values, name);
            // @ts-expect-error
            nextValue = value(prevValue);
        }
        set(ref.current.values, name, nextValue);
        // TODO add enableClearErrorOnValueChange
        set(ref.current.errors, name, undefined);
        set(ref.current.touched, name, true);
        ref.current.emitField(name);
        private_debouncedValidation();
    };

    ref.current.getFieldState = <V = any>(name: Path | PathSegment): FieldState<V> => {
        return {
            value: ref.current.getFieldValue(name),
            error: ref.current.getFieldError(name),
            touched: ref.current.getFieldTouched(name),
        };
    };

    ref.current.setFieldValidate = <V = any>(name: Path | PathSegment, validate: FieldValidate<V> | undefined) => {
        const encodedPath = encodePath(name);
        const currentValidate = ref.current.validateMap.get(encodedPath);
        if (currentValidate !== validate) {
            if (validate) {
                ref.current.validateMap.set(encodedPath, validate);
            }
            else {
                ref.current.validateMap.delete(encodedPath);
            }
            private_debouncedValidation();
        }
    };

    // TODO add enableValidationOnMount
    private_debouncedValidation();

    if (props.onInternalRefCreate) {
        ref.current = props.onInternalRefCreate(ref.current);
    }

    return ref.current;
}
