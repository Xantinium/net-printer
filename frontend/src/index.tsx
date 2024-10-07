import React, { useCallback, useRef, useState } from 'react';
import {
    Button, Icon, Text, ThemeProvider,
    ToasterComponent,
    ToasterProvider,
} from '@gravity-ui/uikit';
import PrinterIcon from '@gravity-ui/icons/Printer';
import favicon from '../public/favicon.svg';
import { AppStore } from './store';
import { FileInput } from './components/file-input';
import { FilesList } from './components/files-list';
import { PrinterStatus } from './components/printer-status';
import './styles.css';

type ScanButtonProps = {
    scan(): Promise<void>;
};

const ScanButton = React.memo((props: ScanButtonProps) => {
    const { scan } = props;

    const [loading, setLoading] = useState(false);

    const onClick = useCallback(async () => {
        setLoading(true);

        await scan();

        setLoading(false);
    }, [scan]);

    return (
        <Button
            size="xl"
            view="action"
            loading={loading}
            onClick={onClick}
        >
            <Icon data={PrinterIcon} size={18} />
            Сканировать
        </Button>
    );
});

export function App() {
    const store = useRef(new AppStore()).current;

    return (
        <ThemeProvider theme="dark">
            <ToasterProvider>
                <div className="sidebar">
                    <div>
                        <img
                            alt="logo"
                            src={favicon}
                            width={48}
                            className="favicon"
                        />
                        <Text variant="header-2">Принтер коськи</Text>
                    </div>
                    <FileInput
                        loading={store.hasSelectedFile}
                        onChange={store.onFileChange}
                    />
                    <ScanButton
                        scan={store.scan}
                    />
                    <PrinterStatus />
                </div>
                <div>
                    <FilesList
                        getFiles={store.getFiles}
                        onFileRemove={store.removeFile}
                    />
                </div>
                <ToasterComponent />
            </ToasterProvider>
        </ThemeProvider>
    );
}
