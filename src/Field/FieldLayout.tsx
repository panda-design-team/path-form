import {Form, FormItemProps} from 'antd';
import {css, cx} from '@emotion/css';
import {ReactNode, useMemo} from 'react';

interface Params {
    hasGap: boolean;
    width: number | 'fit-content';
}

const getClassName = ({hasGap, width}: Params) => css`
    ${!hasGap && 'margin-bottom: 0 !important;'}

    ${width === 'fit-content' ? undefined : `
        > .ant5-form-item-row > .ant5-form-item-label {
            min-width: ${width}px;
        }
    `}
`;

export interface FieldLayoutProps extends Omit<FormItemProps, 'rules' | 'shouldUpdate' | 'dependencies' | 'validateDebounce' | 'validateTrigger' | 'validateFirst'> {
    width?: number;
    hasGap?: boolean;
    // 开源版本没有以下的
    extraChildren?: ReactNode;
}

export function FieldLayout({
    className,
    width = 120,
    hasGap = true,
    children,
    extraChildren,
    ...rest
}: FieldLayoutProps) {
    const nextClassName = getClassName({hasGap, width});
    const layoutProps = useMemo(
        () => {
            return {
                labelCol: {flex: `0 0 ${width}px`},
                wrapperCol: {flex: 1},
            };
        },
        [width]
    );

    return (
        <Form.Item
            {...rest}
            {...layoutProps}
            colon={false}
            labelAlign="left"
            className={cx(nextClassName, className)}
        >
            <>
                {children}
                {extraChildren}
            </>
        </Form.Item>
    );
}
