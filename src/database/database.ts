import mongoose from "mongoose"

const databaseConnection = async (dbURI: string) => {
    
    mongoose.connect(dbURI)
    .then((result) => {
        console.log('connected to db')
    })
    .catch((err) => {
        console.log(err)
    })  
}


export default databaseConnection