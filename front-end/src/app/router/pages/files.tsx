import React, { useEffect, useState } from 'react';
import Wrapper from '../wrapper';
import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { SentimentDissatisfied } from '@mui/icons-material';
import DocsContainer from '../../components/docs-container';

export type FileType = {
    name: string
    path: string
};

const FilesPage: React.FC = () => {
    const [files, setFiles] = useState<FileType[] | null>(null);
    const [category, setCategory] = useState('prints');

    async function loadFiles(category: string) {
        const files = await (await fetch(`/api/files?category=${category}`)).json() as FileType[];
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
                    <ToggleButton value="prints" sx={{paddingX: 3}}>
                        <Typography fontWeight={category === 'prints' ? 700 : 400}>
                            Доки
                        </Typography>
                    </ToggleButton>
                    <ToggleButton value="scans" sx={{paddingX: 3}}>
                        <Typography fontWeight={category === 'scans' ? 700 : 400}>
                            Сканы
                        </Typography> 
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>
            {files !== null && <>
                {files.length === 0 ? <Box sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 24,
                }}>
                    <SentimentDissatisfied sx={{fontSize: '108px'}} />
                    <Typography variant="h3">
                        Пусто
                    </Typography>
                </Box> : (
                    category === 'prints' ? <DocsContainer data={files} /> : <DocsContainer data={files} />
                )}
            </>}
        </Wrapper>
    );
};

export default FilesPage;
