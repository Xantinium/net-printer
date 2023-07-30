import React, { useState } from 'react';
import Wrapper from '../wrapper';
import { LoadingButton } from '@mui/lab';
import ScanIcon from '@mui/icons-material/Scanner';

const HomePage: React.FC = () => {
    const [loading, setLoading] = useState(false);

    const onClick = async () => {
        setLoading(true);
        await fetch('/api/scan');
        setLoading(false);
    };

    return (
        <Wrapper>
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
        </Wrapper>
    );
};

export default HomePage;
