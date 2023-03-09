import mongoose from 'mongoose'

const connectDatabase = () => {
    mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser: true, 
        useUnifiedTopology: true
    }).then(() => console.log("Conexão realizada!"))
    .catch((err) => console.log(err))
}

export default connectDatabase

