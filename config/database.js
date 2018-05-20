if(process.env.NODE_ENV === 'production'){

    module.exports = {

        mongoURI : 'mongodb://stylos:stylos@ds123258.mlab.com:23258/unote-prod'

    }
}
else{

    module.exports = {

        mongoURI : 'mongodb://localhost/unotes'
    }

}