import React from 'react';
import { FileType } from '../router/pages/files';
import { Box, Typography } from '@mui/material';

type Props = {
    data: FileType[]
}

type GroupedData = Array<{
    groupDate: string
    files: FileType[]
}>;

function getGroups(data: FileType[]): GroupedData {
    const copyOfData: FileType[] = [];
    for (let i = 0; i < data.length; i++) {
        copyOfData[i] = {
            name: data[i].name,
            path: data[i].path,
        };
    }
    copyOfData.sort((a, b) => Number(a.name.slice(0, -4)) - Number(b.name.slice(0, -4)));
    const result: GroupedData = [];
    for (let i = 0; i < copyOfData.length; i++) {
        const item = copyOfData[i];
        const itemDateString = new Date(Number(item.name.slice(0, -4))).toLocaleDateString('ru');
        const group = result.find((el) => el.groupDate === itemDateString);
        if (group) {
            group.files.push(item);
        } else {
            result.push({
                groupDate: itemDateString,
                files: [item],
            });
        }
    }
    return result;
}

const DocsContainer: React.FC<Props> = (props) => {
    const { data } = props;

    const groupedData = React.useMemo(() => getGroups(data), [data]);

    return groupedData.map((el) => {
        return <Box key={el.groupDate}>
            <Typography variant="h5" marginBottom={2}>
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
