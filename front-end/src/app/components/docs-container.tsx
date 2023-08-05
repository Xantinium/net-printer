import React from 'react';
import { FileType } from '../router/pages/files';
import { Box, Typography } from '@mui/material';
import { getGroups } from './utils';

type Props = {
    data: FileType[]
    onReload: () => void
}

const DocsContainer: React.FC<Props> = (props) => {
    const { data } = props;

    const groupedData = React.useMemo(() => getGroups(data), [data]);

    return groupedData.map((el) => {
        return <Box key={el.groupDate} marginBottom={2}>
            <Typography variant="h5" marginBottom={1}>
                {el.groupDate}
            </Typography>
            {el.files.map((item) => <Box key={item.name}>
                <Typography variant="body2">
                    <a href={item.path} target="_blank">
                        {item.name}
                    </a>
                </Typography>
            </Box>)}
        </Box>;
    });
};

export default DocsContainer;
