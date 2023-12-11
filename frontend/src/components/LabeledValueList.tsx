import React, { RefObject, useEffect, useRef } from 'react';
import { Container, Form } from 'react-bootstrap';

interface LabeledValueListProps {
    label?: string | null;
    values?: string[];
    onChange?: (
        value: any,
        ref: RefObject<HTMLSelectElement>
    ) => void | undefined;
    setState?: React.Dispatch<React.SetStateAction<any>>;
    className?: string;
    onClick?: React.MouseEventHandler<HTMLElement> | undefined;
    inputGroupText?: string;
    setIndex?: (ref: RefObject<HTMLSelectElement>) => void;
}

const LabeledValueList: React.FC<LabeledValueListProps> = React.memo(
    ({
        label,
        values,
        onChange,
        setState,
        className,
        onClick,
        inputGroupText,
        setIndex,
    }) => {
        const selectRef = useRef<HTMLSelectElement>(null);

        useEffect(() => {
            if (selectRef?.current?.value && setState) {
                const selectedValue = selectRef.current.value;
                setState(selectedValue);
            }
        });

        useEffect(() => {
            if (setIndex) setIndex(selectRef);
        });

        return (
            <Container fluid className={`${className}`}>
                <Form.Group>
                    {label && (
                        <Form.Label className='value-list'>{label}</Form.Label>
                    )}
                    <div className='input-group'>
                        {inputGroupText && (
                            <span
                                className='input-group-text'
                                id='basic-addon1'
                            >
                                {inputGroupText}
                            </span>
                        )}
                        <Form.Control
                            as='select'
                            className='form-select'
                            ref={selectRef}
                            onChange={
                                onChange
                                    ? e => onChange(e.target.value, selectRef)
                                    : undefined
                            }
                            disabled={values && values.length === 0}
                            onClick={onClick}
                        >
                            {values &&
                                values.map((value, index) => (
                                    <option key={index} value={value}>
                                        {value}
                                    </option>
                                ))}
                        </Form.Control>
                    </div>
                </Form.Group>
            </Container>
        );
    }
);

LabeledValueList.defaultProps = {
    onChange: () => {},
    setState: () => {},
    setIndex: () => {},
    onClick: () => {},
    label: null,
    values: [],
};

export default LabeledValueList;
