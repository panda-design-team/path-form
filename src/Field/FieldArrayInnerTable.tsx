import {ComponentType, useMemo} from 'react';
import {ConfigProvider, Table, TableColumnsType, TableProps, ThemeConfig} from 'antd';
import {Path} from '../path';
import {DeleteButtonProps} from './FieldArrayInterface';
import {FieldArrayDeleteButton} from './FieldArrayDeleteButton';

const transparentTheme: ThemeConfig = {
    components: {
        Table: {
            colorBgContainer: 'transparent',
            // @ts-ignore
            colorFillAlterSolid: 'transparent',
        },
    },
    inherit: true,
};

interface InnerTableProps<T> extends TableProps<T> {
    dataSource: T[];
    keyPath: Path;
    createColumns: (params: {keyPath: Path}) => TableColumnsType<T>;
    DeleteButton: ComponentType<DeleteButtonProps>;
    atLeastOne?: boolean;
    disableActionColumn?: boolean;
}

function InnerTable({
    dataSource,
    keyPath,
    createColumns,
    DeleteButton,
    atLeastOne,
    disableActionColumn,
    ...rest
}: InnerTableProps<any>) {
    const columns = useMemo(
        (): TableColumnsType<any> => [
            ...createColumns({keyPath}),
            ...disableActionColumn
                ? []
                : [{
                        title: '操作',
                        dataIndex: 'action',
                        width: 100,
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        render(name: string, record: any, index: number) {
                            return (
                                <FieldArrayDeleteButton
                                    keyPath={keyPath}
                                    index={index}
                                    record={record}
                                    array={dataSource}
                                    atLeastOne={atLeastOne}
                                    DeleteButton={DeleteButton}
                                />
                            );
                        },
                    }],
        ],
        // keyPath should not change
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [DeleteButton, atLeastOne, createColumns, dataSource],
    );

    return (
        <ConfigProvider theme={transparentTheme}>
            <Table<any>
                {...rest}
                dataSource={dataSource}
                columns={columns}
                pagination={false}
                rowKey="key"
            />
        </ConfigProvider>
    );
}

export default InnerTable;
