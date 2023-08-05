import React, { useState } from 'react';
import { FileType } from '../router/pages/files';
import { Box, Button, Modal } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';

type Props = {
    fileInfo: FileType
    onRemove: () => void
};

const ScanViewer: React.FC<Props> = (props) => {
    const { fileInfo, onRemove } = props;

    const [open, setOpen] = useState(false);

    const deleteFile = async () => {
        await fetch(`/api/remove_scan?name=${fileInfo.name}`);
        setOpen(false);
        onRemove();
    };

    const downloadFile = () => {
        const link = document.createElement('a');
        link.download = fileInfo.name;
        link.href = fileInfo.path;
        link.click();
        link.remove();
    };

    return <>
        <Box
            onClick={() => setOpen(true)}
            sx={{width: '160px', height: '160px', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer'}}
        >
            <img src={fileInfo.path} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center'}} />
        </Box>
        <Modal
            open={open}
            onClose={() => setOpen(false)}
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 'fit-content',
                bgcolor: '#ffffff',
                boxShadow: 24,
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                outline: 'none',
                borderRadius: '12px',
            }}>
                <img src={fileInfo.path} style={{width: '550px'}} />
                <Box sx={{display: 'flex', justifyContent: 'center', gap: '32px', mt: 4}}>
                    <Button
                        size="large"
                        color="success"
                        variant="contained"
                        onClick={downloadFile}
                        startIcon={<DownloadIcon />}
                    >
                        Скачать
                    </Button>
                    <Button
                        size="large"
                        color="error"
                        variant="contained"
                        onClick={deleteFile}
                        startIcon={<DeleteIcon />}
                    >
                        Удалить
                    </Button>
                </Box>
            </Box>
        </Modal>
    </>;
};

export default ScanViewer;
