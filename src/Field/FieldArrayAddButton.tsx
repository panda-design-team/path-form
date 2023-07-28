import {Button, createIcon} from '@panda-design/components';
import {ComponentType, useCallback} from 'react';
import {Add} from '../icons';
import {Path} from '../path';
import {useFormContext} from '../Context';
import {AddButtonProps} from './FieldArrayInterface';

const IconAdd = createIcon(Add);

export const DefaultAddButton = ({onAdd}: AddButtonProps) => {
    return (
        <div>
            <Button
                type="text"
                icon={<IconAdd />}
                onClick={onAdd}
            >
                添加
            </Button>
        </div>
    );
};

interface Props<T = any> {
    keyPath: Path;
    createDefaultValue: () => T;
    array: T[];
    AddButton: ComponentType<AddButtonProps>;
}

export function FieldArrayAddButton<T>({keyPath, AddButton, createDefaultValue}: Props<T>) {
    const {setFieldValue} = useFormContext();
    const handleAdd = useCallback(
        () => {
            setFieldValue(keyPath, (array: any) => [...(array ?? []), createDefaultValue()]);
        },
        [createDefaultValue, keyPath, setFieldValue]
    );
    return <AddButton onAdd={handleAdd} />;
}
