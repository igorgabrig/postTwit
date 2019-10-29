if(process.env.NODE_ENV == "production"){
    module.exports = {mongoURI: "mongodb+srv://user:12345@cluster0-51bgn.mongodb.net/test?retryWrites=true&w=majority"}
}else{

}