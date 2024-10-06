import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { TEXT_COLORS, Text } from '@gravity-ui/uikit';
import { httpClient } from '../../http';
import { Statuses } from '../../http/status';
import styles from './styles.module.css';

const INTERVAL_SECONDS = 10;

type StatusInfo = {
    text: string;
    color: (typeof TEXT_COLORS)[number];
};

function getStatusInfo(status: Statuses): StatusInfo {
    switch (status) {
    case Statuses.READY:
        return {
            text: 'готов',
            color: 'positive',
        };
    case Statuses.ERROR:
        return {
            text: 'не подключён',
            color: 'danger',
        };
    default:
        return {
            text: 'неизвестно',
            color: 'utility',
        };
    }
}

async function updateStatus(setter: (status: Statuses) => void) {
    const response = await httpClient.getPrinterStatus();
    if (response instanceof Error) {
        setter(Statuses.ERROR);
        return;
    }

    setter(response.status);
}

export const PrinterStatus = observer(() => {
    const [status, setStatus] = useState(Statuses.UNKNOWN);

    const statusInfo = getStatusInfo(status);

    useEffect(() => {
        updateStatus(setStatus);

        const intervalId = setInterval(async () => {
            updateStatus(setStatus);
        }, INTERVAL_SECONDS * 1000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className={styles.status}>
            <span>
                <Text variant="body-2">
                    Статус принтера:
                </Text>
                {' '}
                <Text variant="body-2" color={statusInfo.color}>
                    {statusInfo.text}
                </Text>
            </span>
        </div>
    );
});
