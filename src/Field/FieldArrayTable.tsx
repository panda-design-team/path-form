import {ComponentType, useMemo} from 'react';
import {TableColumnsType, TableProps} from 'antd';
import styled from '@emotion/styled';
import {Path} from '../path';
import {useFieldValue} from '../storeHooks';
import {AddButtonProps, DeleteButtonProps} from './FieldArrayInterface';
import {DefaultAddButton, FieldArrayAddButton} from './FieldArrayAddButton';
import {DefaultTableDeleteButton} from './FieldArrayDeleteButton';
import FieldArrayInnerTable from './FieldArrayInnerTable';

const Gap = styled.div`
    height: 8px
`;

const defaultCreateDefaultValue = (): any => ({});

export type FieldArrayTableCreateColumns<T = any> = (params: { keyPath: Path }) => TableColumnsType<T>;

export interface FieldArrayTableProps<T = any> extends TableProps<T> {
    keyPath: Path;
    createDefaultValue?: () => T;
    createColumns: FieldArrayTableCreateColumns<T>;
    DeleteButton?: ComponentType<DeleteButtonProps>;
    AddButton?: ComponentType<AddButtonProps>;
    atLeastOne?: boolean;
    disableActionColumn?: boolean;
}

export function FieldArrayTable<T>({
    keyPath,
    createDefaultValue = defaultCreateDefaultValue,
    createColumns,
    DeleteButton = DefaultTableDeleteButton,
    AddButton = DefaultAddButton,
    atLeastOne,
    disableActionColumn,
    ...rest
}: FieldArrayTableProps<T>) {
    const fieldValue = useFieldValue<T[]>(keyPath);
    const dataSource = useMemo(
        () => {
            return (fieldValue ?? []).map((value, index) => {
                return typeof value === 'object' ? {...value, key: index} : {key: index, value};
            }) as T[];
        },
        [fieldValue]
    );

    return (
        <>
            <FieldArrayInnerTable
                {...rest}
                dataSource={dataSource}
                createColumns={createColumns}
                keyPath={keyPath}
                DeleteButton={DeleteButton}
                atLeastOne={atLeastOne}
                disableActionColumn={disableActionColumn}
            />
            <Gap />
            <FieldArrayAddButton
                keyPath={keyPath}
                createDefaultValue={createDefaultValue}
                array={dataSource}
                AddButton={AddButton}
            />
        </>
    );
}
