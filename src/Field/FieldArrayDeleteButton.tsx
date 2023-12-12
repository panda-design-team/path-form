import {Button, createIcon} from '@panda-design/components';
import {ComponentType, useCallback} from 'react';
import {css} from '@emotion/css';
import {Delete} from '../icons';
import {Path} from '../path';
import {useFormContext} from '../Context';
import {DeleteButtonProps} from './FieldArrayInterface';

const buttonContainerCss = css`
    display: flex;
    align-items: center;
    margin-left: -8px;
`;

const IconDelete = createIcon(Delete);

export function DefaultDeleteButton({disabled, disabledReason, onDelete}: DeleteButtonProps) {
    return (
        <Button
            type="text"
            icon={<IconDelete />}
            onClick={onDelete}
            disabled={disabled}
            disabledReason={disabledReason}
        >
            删除
        </Button>
    );
}

export function DefaultTableDeleteButton({disabled, disabledReason, onDelete}: DeleteButtonProps) {
    return (
        <div className={buttonContainerCss}>
            <Button
                type="text"
                icon={<IconDelete />}
                onClick={onDelete}
                disabled={disabled}
                disabledReason={disabledReason}
            >
                删除
            </Button>
        </div>
    );
}

interface Props<T = any> {
    keyPath: Path;
    index: number;
    record: T;
    array: T[];
    DeleteButton: ComponentType<DeleteButtonProps<T>>;
    atLeastOne?: boolean;
}

export function FieldArrayDeleteButton<T>({keyPath, index, record, array, atLeastOne, DeleteButton}: Props<T>) {
    const {setFieldValue} = useFormContext();
    const handleDelete = useCallback(
        () => {
            setFieldValue(keyPath, (array: any[]) => array.filter((_, i) => i !== index));
        },
        [index, keyPath, setFieldValue]
    );

    return (
        <DeleteButton
            index={index}
            onDelete={handleDelete}
            record={record}
            array={array}
            disabled={array.length <= 1 && atLeastOne}
            disabledReason="至少需要填一项"
        />
    );
}
