import { FileType } from '../router/pages/files';

type GroupedData = Array<{
    groupDate: string
    files: FileType[]
}>;

export function getGroups(data: FileType[]): GroupedData {
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