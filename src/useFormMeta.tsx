import {useMemo} from 'react';
import {useSyncExternalStore} from 'use-sync-external-store/shim';
import {useFormContext} from './Context';
import {FormRefObject} from './core';

export function useFormMeta<K extends keyof FormRefObject>(refKey: K): FormRefObject[K] {
    const refCurrent = useFormContext();

    const {subscribe, getSnapshot} = useMemo(
        () => {
            const subscribe = (listener: () => void) => refCurrent.subscribeMeta(listener);
            const getSnapshot = () => refCurrent[refKey];
            return {subscribe, getSnapshot};
        },
        [refCurrent, refKey],
    );

    return useSyncExternalStore(subscribe, getSnapshot);
}

export function useFormSubmitCount(): number {
    return useFormMeta('submitCount');
}

export function useFormSubmitting(): boolean {
    return useFormMeta('isSubmitting');
}

export function useFormValidating(): boolean {
    return useFormMeta('isValidating');
}

export function useFormChangeCount(): number {
    return useFormMeta('changeCount');
}

export function useFormErrors(): any {
    return useFormMeta('errors');
}
