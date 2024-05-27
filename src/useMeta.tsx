import {useMemo} from 'react';
import {useSyncExternalStore} from 'use-sync-external-store/shim';
import {useFormContext} from './Context';

export function useFormSubmitCount(): number {
    const refCurrent = useFormContext();

    const {subscribe, getSnapshot} = useMemo(
        () => {
            const subscribe = (listener: () => void) => refCurrent.subscribeMeta(listener);
            const getSnapshot = () => refCurrent.submitCount;
            return {subscribe, getSnapshot};
        },
        [refCurrent]
    );

    return useSyncExternalStore(subscribe, getSnapshot);
}

export function useFormSubmitting(): boolean {
    const refCurrent = useFormContext();

    const {subscribe, getSnapshot} = useMemo(
        () => {
            const subscribe = (listener: () => void) => refCurrent.subscribeMeta(listener);
            const getSnapshot = () => refCurrent.isSubmitting;
            return {subscribe, getSnapshot};
        },
        [refCurrent]
    );

    return useSyncExternalStore(subscribe, getSnapshot);
}

export function useFormValidating(): boolean {
    const refCurrent = useFormContext();

    const {subscribe, getSnapshot} = useMemo(
        () => {
            const subscribe = (listener: () => void) => refCurrent.subscribeMeta(listener);
            const getSnapshot = () => refCurrent.isValidating;
            return {subscribe, getSnapshot};
        },
        [refCurrent]
    );

    return useSyncExternalStore(subscribe, getSnapshot);
}

export function useFormChangeCount(): number {
    const refCurrent = useFormContext();

    const {subscribe, getSnapshot} = useMemo(
        () => {
            const subscribe = (listener: () => void) => refCurrent.subscribeMeta(listener);
            const getSnapshot = () => refCurrent.changeCount;
            return {subscribe, getSnapshot};
        },
        [refCurrent]
    );

    return useSyncExternalStore(subscribe, getSnapshot);
}
