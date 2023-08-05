import React, { useState } from 'react';
import { FileType } from '../router/pages/files';
import { Box, Button, Modal } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';

type Props = {
    fileInfo: FileType
};

const ScanViewer: React.FC<Props> = (props) => {
    const { fileInfo } = props;

    const [open, setOpen] = useState(false);

    return <>
        <Box
            onClick={() => setOpen(true)}
            sx={{width: '160px', height: '160px', borderRadius: '12px', overflow: 'hidden'}}
        >
            <img src={fileInfo.path} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center'}} />
        </Box>
        <Modal
            open={open}
            onClose={() => setOpen(false)}
        >
            <Box p={4}>
                <img src={fileInfo.path} style={{width: '350px'}} />
                <Box sx={{display: 'flex', justifyContent: 'center', gap: '32px', mt: 4}}>
                    <Button
                        size="large"
                        color="success"
                        variant="contained"
                        startIcon={<DownloadIcon />}
                    >
                        Скачать
                    </Button>
                    <Button
                        size="large"
                        color="error"
                        variant="contained"
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
