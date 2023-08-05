import React from 'react';
import { FileType } from '../router/pages/files';
import { Box, Typography } from '@mui/material';
import { getGroups } from './utils';
import ScanViewer from './scan-viewer';

type Props = {
    data: FileType[]
}

const ScansContainer: React.FC<Props> = (props) => {
    const { data } = props;

    const groupedData = React.useMemo(() => getGroups(data), [data]);

    return groupedData.map((el) => {
        return <Box key={el.groupDate} marginBottom={2}>
            <Typography variant="h5" marginBottom={1}>
                {el.groupDate}
            </Typography>
                <Box sx={{display: 'flex', gap: '18px', flexWrap: 'wrap'}}>
                {el.files.map((item) => <ScanViewer key={item.name} fileInfo={item} />)}
            </Box>
        </Box>;
    });
};

export default ScansContainer;
