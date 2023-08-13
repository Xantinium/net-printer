import React, { useState } from 'react';
import Wrapper from '../wrapper';
import { LoadingButton } from '@mui/lab';
import ScanIcon from '@mui/icons-material/Scanner';
import UploadFile from '@mui/icons-material/UploadFile';
import { Alert, Box, Divider, FormControl, InputLabel, MenuItem, Select, Snackbar } from '@mui/material';

export type Resolution = 75 | 150 | 300 | 600;

const FILE_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

function getInitialResolution(): Resolution {
    const resolution = localStorage.getItem('resolution');
    return resolution === null ? 600 : JSON.parse(resolution) as Resolution;
}

const HomePage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState<null | string>(null);
    const [resolution, setResolution] = useState<Resolution>(getInitialResolution());
    const [uploadState, setUploadState] = useState(0);

    const onClick = async () => {
        setLoading(true);
        const result: { errorMsg: string | null } = await (await fetch(`/api/scan?resolution=${resolution}`)).json();
        setLoading(false);
        setAlertMessage(result.errorMsg);
        setIsAlertOpen(true);
    };

    const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files === null) {
            return;
        }
        const file = event.target.files[0];
        if (!file || !FILE_TYPES.includes(file.type)) {
            return;
        }
        setUploadState(1);
        const payload = new FormData();
        payload.append('file', file);
        await fetch('/api/upload', {
            method: 'POST',
            body: payload,
        });
        setUploadState(2);
    };

    return (
        <>
            <Wrapper>
                <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <LoadingButton
                        size="large"
                        variant="contained"
                        startIcon={<ScanIcon />}
                        loading={loading}
                        loadingPosition="start"
                        onClick={onClick}
                    >
                        Сканировать
                    </LoadingButton>
                    <FormControl sx={{width: '120px'}}>
                        <InputLabel id="resolution">Качество</InputLabel>
                        <Select
                            value={resolution}
                            label="Качество"
                            labelId="resolution"
                            onChange={(event) => {
                                const value = event.target.value as Resolution;
                                setResolution(value);
                                localStorage.setItem('resolution', JSON.stringify(value));
                            }}
                        >
                            <MenuItem value={75}>75 DPI</MenuItem>
                            <MenuItem value={150}>150 DPI</MenuItem>
                            <MenuItem value={300}>300 DPI</MenuItem>
                            <MenuItem value={600}>600 DPI</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Divider sx={{my: 4}} />
                <Box>
                    <LoadingButton
                        variant="contained"
                        component="label"
                        size="large"
                        startIcon={<UploadFile />}
                        loading={uploadState === 1}
                    >
                        Upload File
                        <input
                            type="file"
                            hidden
                            onChange={onFileChange}
                            accept=".pdf,.docx"
                        />
                    </LoadingButton>
                </Box>
            </Wrapper>
            <Snackbar open={isAlertOpen}>
                <Alert
                    elevation={6}
                    variant="filled"
                    sx={{ width: '100%' }}
                    onClose={() => setIsAlertOpen(false)}
                    severity={alertMessage === null ? 'success' : 'error'}
                >
                    {alertMessage === null ? 'Сканирование завершено!' : `Сканирование не удалось: ${alertMessage}`}
                </Alert>
            </Snackbar>
            <Snackbar open={uploadState === 2}>
                <Alert
                    elevation={6}
                    variant="filled"
                    sx={{ width: '100%' }}
                    onClose={() => setUploadState(0)}
                    severity="success"
                >
                    Файл загружен!
                </Alert>
            </Snackbar>
        </>
    );
};

export default HomePage;
