import React, { useState } from 'react';
import Wrapper from '../wrapper';
import { LoadingButton } from '@mui/lab';
import ScanIcon from '@mui/icons-material/Scanner';
import { Alert, Box, FormControl, InputLabel, MenuItem, Select, Snackbar } from '@mui/material';

export type Resolution = 75 | 150 | 300 | 600;

const HomePage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [resolution, setResolution] = useState<Resolution>(600);
    const [alertMessage, setAlertMessage] = useState<null | string>('');

    const onClick = async () => {
        setLoading(true);
        const result: { errorMsg: string | null } = await (await fetch(`/api/scan?resolution=${resolution}`)).json();
        setLoading(false);
        setAlertMessage(result.errorMsg);
        setIsAlertOpen(true);
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
                            onChange={(event) => setResolution(event.target.value as Resolution)}
                        >
                            <MenuItem value={75}>75 DPI</MenuItem>
                            <MenuItem value={150}>150 DPI</MenuItem>
                            <MenuItem value={300}>300 DPI</MenuItem>
                            <MenuItem value={600}>600 DPI</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Wrapper>
            <Snackbar
                open={isAlertOpen}
                autoHideDuration={5e3}
                onClose={() => setIsAlertOpen(false)}
            >
                <Alert
                    sx={{ width: '100%' }}
                    onClose={() => setIsAlertOpen(false)}
                    severity={alertMessage === null ? 'success' : 'error'}
                >
                    {alertMessage === null ? 'Сканирование завершено!' : `Ошибка при сканировании: ${alertMessage}`}
                </Alert>
            </Snackbar>
        </>
    );
};

export default HomePage;
