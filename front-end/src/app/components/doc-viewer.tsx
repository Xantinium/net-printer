import React, { useState } from 'react';
import { Box, Button, Modal, Typography } from '@mui/material';
import { FileType } from '../router/pages/files';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';

type DocViewerProps = {
    fileInfo: FileType
    onRemove: () => void
};

const DocViewer: React.FC<DocViewerProps> = (props) => {
    const { fileInfo, onRemove } = props;

    const [open, setOpen] = useState(false);

    const deleteFile = async () => {
        await fetch(`/api/remove_print?name=${fileInfo.name}`);
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

    const printFile = () => {
        
    };

    return <>
        <Typography
            variant="body2"
            sx={{cursor: 'pointer'}}
            onClick={() => setOpen(true)}
        >
            {fileInfo.name}
        </Typography>
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
                <iframe src={fileInfo.path} width={1200} height={700} />
                <Box sx={{display: 'flex', justifyContent: 'center', gap: '32px', mt: 4}}>
                    <Button
                        size="large"
                        color="primary"
                        variant="contained"
                        onClick={printFile}
                        startIcon={<PrintIcon />}
                    >
                        Печатать
                    </Button>
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
    </>
};

export default DocViewer;