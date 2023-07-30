import React, { useEffect, useState } from 'react';
import Wrapper from '../wrapper';
import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';

type FileType = {
    name: string
    path: string
};

const FilesPage: React.FC = () => {
    const [files, setFiles] = useState<FileType[]>([]);
    const [category, setCategory] = useState('prints');

    async function loadFiles(category: string) {
        const files = await fetch(`/api/files?category=${category}`) as unknown as FileType[];
        setFiles(files);
    }

    useEffect(() => {
        loadFiles(category);
    }, [category]);

    return (
        <Wrapper>
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                <ToggleButtonGroup
                    exclusive
                    value={category}
                    onChange={(_, value) => setCategory(value)}
                >
                    <ToggleButton value="prints" sx={{paddingX: 2}}>
                        <Typography fontWeight={category === 'prints' ? 700 : 400}>
                            Доки
                        </Typography>
                    </ToggleButton>
                    <ToggleButton value="scans" sx={{paddingX: 2}}>
                        <Typography fontWeight={category === 'scans' ? 700 : 400}>
                            Сканы
                        </Typography> 
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>
            {JSON.stringify(files, null, 4)}
        </Wrapper>
    );
};

export default FilesPage;
