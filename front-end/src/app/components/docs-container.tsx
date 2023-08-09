import React from 'react';
import { FileType } from '../router/pages/files';
import { Box, Typography } from '@mui/material';
import { getGroups } from './utils';
import DocViewer from './doc-viewer';

type Props = {
    data: FileType[]
    onReload: () => void
}

const DocsContainer: React.FC<Props> = (props) => {
    const { data, onReload } = props;

    const groupedData = React.useMemo(() => getGroups(data), [data]);

    return groupedData.map((el) => {
        return <Box key={el.groupDate} marginBottom={2}>
            <Typography variant="h5" marginBottom={1}>
                {el.groupDate}
            </Typography>
            {el.files.map((item) => <DocViewer key={item.name} fileInfo={item} onRemove={onReload} />)}
        </Box>;
    });
};

export default DocsContainer;
