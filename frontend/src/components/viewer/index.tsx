import React, { useCallback, useMemo, useState } from 'react';
import {
    Button, Loader, RadioGroup, Text, TextInput, useToaster,
} from '@gravity-ui/uikit';
import { FileItem } from '../../http/files';
import { httpClient } from '../../http';
import styles from './styles.module.css';

type ViewerProps = {
    file: FileItem;
    onFilePrinted(): void;
};

enum PagesModes {
    ALL = 'all',
    ODD = 'odd',
    EVEN = 'even',
    CUSTOM = 'custom',
}

function getPages(mode: PagesModes, customValue: string) {
    switch (mode) {
    case PagesModes.ODD:
        return 'odd';
    case PagesModes.EVEN:
        return 'even';
    case PagesModes.CUSTOM:
        return customValue;
    default:
        return '';
    }
}

export const Viewer = React.memo((props: ViewerProps) => {
    const { file, onFilePrinted } = props;

    const { add } = useToaster();
    const [loading, setLoading] = useState(true);
    const [copiesNum, setCopiesNum] = useState('1');
    const [pagesMode, setPagesMode] = useState(PagesModes.ALL);
    const [customPagesMode, setCustomPagesMode] = useState('');

    const onLoad = useCallback(() => setLoading(false), []);

    const iframeStyle = useMemo((): React.CSSProperties => ({
        display: loading ? 'none' : 'block',
    }), [loading]);

    const copiesNumHandler = useCallback((value: string) => {
        const n = Number(value.split('').filter((char) => /\d/.test(char)).join(''));

        if (Number.isNaN(n)) {
            setCopiesNum('1');
            return;
        }

        setCopiesNum(String(Math.max(1, n)));
    }, []);

    const pagesModeHandler = useCallback((value: string) => {
        setPagesMode(value as PagesModes);
    }, []);

    const onClick = useCallback(async () => {
        const response = await httpClient.print(file.id, Number(copiesNum), getPages(pagesMode, customPagesMode));
        if (response instanceof Error) {
            add({
                name: 'print',
                theme: 'danger',
                isClosable: true,
                title: response.name,
                content: response.message,
            });
            return;
        }

        onFilePrinted();
    }, [add, copiesNum, customPagesMode, file.id, onFilePrinted, pagesMode]);

    return (
        <div className={styles.viewer}>
            {loading && <Loader size="l" className={styles.loader} />}
            <iframe
                title={file.name}
                style={iframeStyle}
                src={`/api/file?id=${file.id}`}
                onLoad={onLoad}
            />
            <div className={styles.settings}>
                <Text variant="header-1">
                    {file.name}
                </Text>
                <div className={styles.settingsForm}>
                    <TextInput
                        size="xl"
                        placeholder="1"
                        label="Количество копий"
                        value={copiesNum}
                        onUpdate={copiesNumHandler}
                    />
                    <Text className={styles.pagesModeTitle}>Странички</Text>
                    <RadioGroup
                        size="l"
                        direction="vertical"
                        value={pagesMode}
                        onUpdate={pagesModeHandler}
                    >
                        <RadioGroup.Option
                            value="all"
                            content="Все"
                        />
                        <RadioGroup.Option
                            value="even"
                            content="Чётные"
                        />
                        <RadioGroup.Option
                            value="odd"
                            content="Нечётные"
                        />
                        <RadioGroup.Option
                            value="custom"
                            content={(
                                <>
                                    <Text variant="body-2">Другое</Text>
                                    <TextInput
                                        size="xl"
                                        placeholder="1, 3-6, 8"
                                        className={styles.customPagesMode}
                                        disabled={pagesMode !== PagesModes.CUSTOM}
                                        value={customPagesMode}
                                        onUpdate={setCustomPagesMode}
                                    />
                                </>
                            )}
                        />
                    </RadioGroup>
                </div>
                <Button
                    size="xl"
                    view="action"
                    onClick={onClick}
                >
                    На печать
                </Button>
            </div>
        </div>
    );
});
