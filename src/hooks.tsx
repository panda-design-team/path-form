import {useCallback, useRef} from 'react';
import {isEmpty} from 'lodash';
import {useFormContext} from './Context';
import {useSubmitCount} from './storeHooks';

type OnSuccess<T> = (value: T) => void;
type OnFail = (errors: any) => void;

interface Ref<T> {
    onSuccess?: OnSuccess<T>;
    onFail?: OnFail;
}

export function useFormSubmit<T extends object = any>(onSuccess?: OnSuccess<T>, onFail?: OnFail) {
    // 订阅更新
    useSubmitCount();
    const refCurrent = useFormContext<T>();
    const handlerRef = useRef<Ref<T>>({});
    handlerRef.current.onSuccess = onSuccess;
    handlerRef.current.onFail = onFail;

    const handleSubmit = useCallback(
        async () => {
            refCurrent.submitCount++;
            refCurrent.submitMutex++;
            refCurrent.isSubmitting = Boolean(refCurrent.submitMutex);
            refCurrent.emitAll();
            const errors = await refCurrent.waitForValidation();
            if (isEmpty(errors)) {
                await handlerRef.current.onSuccess?.(refCurrent.values);
            }
            else {
                await handlerRef.current.onFail?.(errors);
            }
            refCurrent.submitMutex--;
            refCurrent.isSubmitting = Boolean(refCurrent.submitMutex);
            refCurrent.emitAll();
        },
        // only ref
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );
    return handleSubmit;
}
