export interface ActivityRecord {
    id: string;
    title: string;
    description: string;
    date: string;
    category?: string;
    imageUrl?: string;
}

export type RootStackParamList = {
    Home: undefined;
    Details: { recordId: string };
    Settings: undefined;
    News: undefined;
}