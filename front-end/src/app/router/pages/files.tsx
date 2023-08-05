import React, { useEffect, useState } from 'react';
import Wrapper from '../wrapper';
import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { SentimentDissatisfied } from '@mui/icons-material';
import DocsContainer from '../../components/docs-container';
import ScansContainer from '../../components/scans-container';

export type FileType = {
    name: string
    path: string
};

function getInitialCategory() {
    const category = localStorage.getItem('category');
    return category === null ? 'prints' : JSON.parse(category);
}

const FilesPage: React.FC = () => {
    const [files, setFiles] = useState<FileType[] | null>(null);
    const [category, setCategory] = useState(getInitialCategory());

    async function loadFiles(category: string) {
        const files: FileType[] = await (await fetch(`/api/files?category=${category}`)).json();
        setFiles(files);
    }

    useEffect(() => {
        loadFiles(category);
        localStorage.setItem('category', JSON.stringify(category));
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
                    category === 'prints' ? <DocsContainer data={files} /> : <ScansContainer data={files} />
                )}
            </>}
        </Wrapper>
    );
};

export default FilesPage;
