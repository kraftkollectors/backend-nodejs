// Helper function to get the start of the current date
const getStartOfDay = (date: any) => {
    return new Date(date.setHours(0, 0, 0));
}


export default getStartOfDay;