import React, { useCallback, useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Icon } from '@gravity-ui/uikit';
import CloudArrowUpInIcon from '@gravity-ui/icons/CloudArrowUpIn';

type FileInputProps = {
    loading(): boolean;
    onChange(filename: string, content: ArrayBuffer): void;
};

export const FileInput = observer((props: FileInputProps) => {
    const { loading, onChange } = props;

    const isLoading = loading();
    const inputRef = useRef<HTMLInputElement>(null);

    const onClick = useCallback(() => {
        inputRef.current?.click();
    }, []);

    const onChangeHanlder = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.item(0);

        if (file) {
            file.arrayBuffer().then((buffer) => {
                onChange(file.name, buffer);
            });
        }
    }, [onChange]);

    useEffect(() => {
        if (!isLoading && inputRef.current) {
            inputRef.current.value = '';
        }
    }, [isLoading]);

    return (
        <>
            <Button
                size="xl"
                view="action"
                loading={isLoading}
                onClick={onClick}
            >
                <Icon data={CloudArrowUpInIcon} size={18} />
                Загрузить файлик
            </Button>
            <input
                hidden
                type="file"
                ref={inputRef}
                accept=".pdf,.docx"
                onChange={onChangeHanlder}
            />
        </>
    );
});
