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

// help 作为内部属性
// rules 用 validate 代替
export interface FieldLayoutProps extends Omit<FormItemProps, 'help' | 'rules' | 'shouldUpdate' | 'dependencies' | 'validateDebounce' | 'validateTrigger' | 'validateFirst'> {
    width?: number;
    hasGap?: boolean;
    /** @deprecated help 被用于显示 error 信息，且会影响间距，建议使用 extra 代替。 */
    help?: FormItemProps['help'];
    /** @deprecated rules 作为 antd 的字段无法与表单联动，建议使用 validate 代替。 */
    rules?: FormItemProps['rules'];
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
            {...layoutProps}
            colon={false}
            labelAlign="left"
            className={cx(nextClassName, className)}
            {...rest}
        >
            <>
                {children}
                {extraChildren}
            </>
        </Form.Item>
    );
}
