# 速查手册

### FormProvider

表单上下文，没有实际的 dom，用于初始化表单内容

可传 `initialValues` 和 `validate`（全局校验）

### useFormContext

获取表单的所有上下文，此 hook 不会触发更新

返回值参见类型

### useFormSubmit

定义表单的提交函数，处理表单的 validate、submitting 等信息。一个表单可以有多个提交函数。

可传 `onSuccess` 和 `onFail`，支持异步

### useFormSubmitCount

订阅表单提交次数

### useFormSubmitting

订阅表单提交状态

### useField

订阅表单项的信息，包括 value、error、touched

### useFieldValue

订阅表单项的 value，更精准

### encodePath

将 path 数组处理为字符串，一般不会用到

### decodePath

将 path 字符串处理为数组，一般不会用到

### Field

定义表单项

可传 `name` 支持字符串和数组形式，`validate`（单项校验），其他参数参见类型

### FieldLayout

定义表单项，仅布局

可传 `label` 等，与 `antd` 的 `Form.Item` 一致

### FieldArray

表单列表

### FieldArrayTable

表单列表，以表格形式展示

### FieldDefaultPropsProvider

集中控制表单项的默认属性，如 disabled

### useFieldDefaultProps

订阅表单项的默认属性

### createValidate

创建表单项的校验函数，但校验函数是一个普通函数也是可以的，这个函数只是一个可选的工具

### createRequiredFieldValidate

快速创建表单项的校验函数，仅校验必填
