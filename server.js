const mongoose=require('mongoose');
const app = require('./app');



const { MONGODB_URI, PORT } = require('./utils/config');

mongoose.connect(MONGODB_URI)
.then(()=>{
    console.log("connected to Database");

    app.listen(PORT, ()=>{
    console.log(`Serving is running on PORT ${PORT}`);
})
}).catch((err)=>{
    console.log('Error connection to Database:',err.message);
});
