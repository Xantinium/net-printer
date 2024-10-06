import React, { useCallback, useMemo, useState } from 'react';
import { Button, Loader, Text } from '@gravity-ui/uikit';
import { FileItem } from '../../http/files';
import styles from './styles.module.css';

type ViewerProps = {
    file: FileItem;
};

export const Viewer = React.memo((props: ViewerProps) => {
    const { file } = props;

    const [loading, setLoading] = useState(true);

    const onLoad = useCallback(() => setLoading(false), []);

    const iframeStyle = useMemo((): React.CSSProperties => ({
        display: loading ? 'none' : 'block',
    }), [loading]);

    return (
        <div className={styles.viewer}>
            {loading && <Loader size="l" className={styles.loader} />}
            <iframe
                title={file.name}
                style={iframeStyle}
                src={`data:application/pdf;base64,${file.content}`}
                onLoad={onLoad}
            />
            <div className={styles.settings}>
                <Text variant="header-1">
                    {file.name}
                </Text>
                <Button>На печать</Button>
            </div>
        </div>
    );
});
