import History from '../models/history'


// history create
const saveRide = async (data: any) => {
    try{
        let info: object = {
            userID: data.userID,
            driverID: data.driverID,
            pickup: data.pickup,
            destination: data.destination,
            price: data.price,
            carName: data.carName,
            carColor: data.carColor,
            carNumber: data.carNumber
        }

        const history: any = await new History(info).save()
        if(history !== null){
            return history           
        }else{
            return false
        }

    }catch (error) {
        console.log(error)
    }
}


// history create
const endRide = async (id: any) => {
    try{
        const check:any  = await History.updateOne({ id: id }, 
            {
                $set:{
                    status: 'finished'
                }
            }
        )
        if(history !== null){
            return true            
        }else{
            return false
        }

    }catch (error) {
        console.log(error)
    }
}

export { saveRide, endRide }