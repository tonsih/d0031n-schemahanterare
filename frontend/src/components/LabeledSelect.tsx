import { Ref } from 'react';
import Select, {
    ActionMeta,
    GetOptionLabel,
    GetOptionValue,
    SingleValue,
    StylesConfig,
} from 'react-select';

interface LabeledSelectProps<T> {
    options: T[];
    onChange: (newValue: SingleValue<T>, actionMeta: ActionMeta<T>) => void;
    value: T;
    optionLabel: GetOptionLabel<T>;
    optionValue: GetOptionValue<T> | undefined;
    placeholder: string;
    autoFocus: boolean;
    className?: string;
    innerRef?: Ref<any> | undefined;
}

const customStyles: StylesConfig<any, false> = {
    menu: provided => ({ ...provided, zIndex: 1000 }),
    control: provided => ({
        ...provided,
        height: '50px',
        minHeight: '50px',
    }),
    valueContainer: provided => ({
        ...provided,
        height: '50px',
        padding: '0 6px',
    }),
    input: provided => ({
        ...provided,
        margin: '0px',
    }),
    indicatorsContainer: provided => ({
        ...provided,
        height: '50px',
    }),
};

const LabeledSelect = <T,>({
    options,
    onChange,
    value,
    optionLabel,
    optionValue,
    placeholder,
    autoFocus,
    className,
    innerRef,
}: LabeledSelectProps<T>) => {
    return (
        <Select
            styles={customStyles}
            options={options}
            getOptionLabel={optionLabel}
            onChange={onChange}
            getOptionValue={optionValue}
            value={value}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className={className}
            ref={innerRef}
        />
    );
};

export default LabeledSelect;
