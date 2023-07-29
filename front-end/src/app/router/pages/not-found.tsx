import React from 'react';
import Wrapper from '../wrapper';
import { Box, Typography } from '@mui/material';

const NotFoundPage: React.FC = () => {
    return (
        <Wrapper>
            <Box height="100%" display="flex" justifyContent="center" alignItems="center">
                <Typography variant="h2">404 | Страница не найдена</Typography>
            </Box>
        </Wrapper>
    );
};

export default NotFoundPage;
