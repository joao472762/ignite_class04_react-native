export interface HistoryDTO{
    title: string,
    data: {
        id: number,
        group: string,
        name: string,
        hour: string ,  
    }[]
}