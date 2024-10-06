import { useCallback, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
    Modal, Table, TableActionConfig, TableColumnConfig, withTableActions, withTableCopy, withTableSorting,
} from '@gravity-ui/uikit';
import EyeIcon from '@gravity-ui/icons/Eye';
import TrashBinIcon from '@gravity-ui/icons/TrashBin';
import { FileItem, FilesTypes } from '../../http/files';
import { Viewer } from '../viewer';
import styles from './styles.module.css';

type FilesListProps = {
    getFiles(): FileItem[];
    onFileRemove(id: string): void;
};

type TableItem = {
    id: string;
    name: string;
    type: string;
    date: number;
};

const CustomTable = withTableActions(withTableSorting(withTableCopy<TableItem>(Table)));

const ICON_STYLE: React.CSSProperties = {
    marginRight: 4,
};

const COLUMNS: Array<TableColumnConfig<TableItem>> = [
    {
        id: 'name',
        name: 'Имя',
        width: 400,
        meta: {
            copy: true,
            sort: true,
        },
    },
    {
        id: 'type',
        name: 'Тип',
        width: 100,
        meta: {
            sort: true,
        },
    },
    {
        id: 'date',
        name: 'Дата создания',
        width: 150,
        meta: {
            sort: true,
        },
        template(item) {
            return new Date(item.date * 1000).toLocaleString('ru');
        },
    },
];

export const FilesList = observer((props: FilesListProps) => {
    const { getFiles, onFileRemove } = props;

    const files = getFiles();

    const [open, setOpen] = useState(false);
    const [openedFile, setOpenedFile] = useState<FileItem | null>(null);

    const onClose = useCallback(() => {
        setOpen(false);
        setTimeout(() => setOpenedFile(null), 300);
    }, []);

    const tableData = useMemo(() => files.map((file): TableItem => ({
        id: file.id,
        name: file.name,
        type: file.category === FilesTypes.IMAGE ? 'Скан' : 'Документ',
        date: file.created_at,
    })), [files]);

    const getRowActions = useCallback((): Array<TableActionConfig<TableItem>> => [
        {
            text: 'Открыть',
            icon: <EyeIcon style={ICON_STYLE} />,
            handler(item) {
                const file = getFiles().find((el) => el.id === item.id);

                if (file) {
                    setOpen(true);
                    setOpenedFile(file);
                }
            },
        },
        {
            text: 'Удалить',
            icon: <TrashBinIcon style={ICON_STYLE} />,
            handler(item) {
                onFileRemove(item.id);
            },
            theme: 'danger',
        },
    ], [getFiles, onFileRemove]);

    return (
        <>
            <CustomTable
                data={tableData}
                columns={COLUMNS}
                className={styles.table}
                getRowActions={getRowActions}
                emptyMessage="Файликов нет"
                rowActionsSize="l"
            />
            <Modal
                open={open}
                onClose={onClose}
            >
                {openedFile !== null && (
                    <Viewer
                        file={openedFile}
                    />
                )}
            </Modal>
        </>
    );
});
