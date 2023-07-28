import {ComponentType, ReactNode} from 'react';
import styled from '@emotion/styled';
import {decodePath, Path, PathSegment} from '../path';
import {useFieldValue} from '../storeHooks';
import {DefaultAddButton, FieldArrayAddButton} from './FieldArrayAddButton';
import {AddButtonProps, DeleteButtonProps} from './FieldArrayInterface';
import {DefaultDeleteButton, FieldArrayDeleteButton} from './FieldArrayDeleteButton';

interface ContainerProps {
    children: ReactNode;
}

const DefaultContainer = styled.div`
    display: flex;
    gap: 8px;
`;

const defaultCreateDefaultValue = (): any => '';

export interface FieldArrayProps<T = any> {
    name: Path | PathSegment;
    Container?: ComponentType<ContainerProps>;
    AddButton?: ComponentType<AddButtonProps>;
    DeleteButton?: ComponentType<DeleteButtonProps<T>>;
    atLeastOne?: boolean;
    createDefaultValue?: () => T;
    children: (index: number) => ReactNode;
}

export function FieldArray<T>({
    name,
    Container = DefaultContainer,
    AddButton = DefaultAddButton,
    DeleteButton = DefaultDeleteButton,
    atLeastOne,
    createDefaultValue = defaultCreateDefaultValue,
    children,
}: FieldArrayProps<T>) {
    const value = useFieldValue<T[]>(name);
    const keyPath = decodePath(name);

    return (
        <>
            {value?.map((record, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <Container key={index}>
                    {children(index)}
                    <FieldArrayDeleteButton
                        keyPath={keyPath}
                        index={index}
                        record={record}
                        array={value}
                        DeleteButton={DeleteButton}
                        atLeastOne={atLeastOne}
                    />
                </Container>
            ))}
            <FieldArrayAddButton
                keyPath={keyPath}
                createDefaultValue={createDefaultValue}
                array={value}
                AddButton={AddButton}
            />
        </>
    );
}
