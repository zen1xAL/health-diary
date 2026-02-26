export interface ActivityRecord {
    id: string;
    title: string;
    description: string;
    date: string;
}

export type RootStackParamList = {
    Home: undefined;
    Details: { recordId: string };
    Settings: undefined;
}