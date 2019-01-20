const uuidv4 = require('uuid/v4');
const mongoose = require('mongoose');
const config = require('./config.js');


mongoose.connect(config.urlDB,{
    useFindAndModify: false,
    useNewUrlParser: true,
    useCreateIndex: true,
}, function(err) {
    if (err) { throw err; } else {
        console.log('Mongo: Database connected');
    }
});

const playlistSchema = new mongoose.Schema({
    _playlistID: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    userID: {
        type: String,
        required: true,
        trim: true
    },
    videos: {
        type: [],
    },
    isActive: {
        type: Boolean,
        default: true,
        required: true,
    }
});

playlistSchema.pre('remove', function () {
    var playlist = this;
    playlistModel.updateOne(playlist,
        {
            isActive: false 
        }, function(err){

        }
    );
});

playlistSchema.pre('find', function (next) {
    var query = this;
    query.where({isActive: true});
    next();
});



const playlistModel = mongoose.model('Playlists', playlistSchema);

module.exports = {
    add: function(data, cb){
        const playlistData = new playlistModel({
            _playlistID: uuidv4(),
            name: data.name,
            userID: data.user.id,
        });
        playlistData.save(function(err){
            if(err) cb(err);
            else cb();
        });
    },

    get: function(id, cb){
        playlistModel.findOne({_playlistID: id}, function(err, playlist) {
            if(err) cb(err);
            else cb(null, playlist)
        });
    },

    getByUserId: function(id, cb){
        playlistModel.find({userID: id}, function(err, playlists) {
            if(err) cb(err);
            else cb(null, playlists)
        });
    },

    updatePlaylist: function(data, cb){
        playlistModel.findOneAndUpdate(
            { _playlistID: data.playlist._playlistID },
            { videos: data.playlist.videos },
            { upsert: true }, 
            function(err){
                cb(err);
            }
        );
    },
    deletePlaylist: function(id, cb){
        playlistModel.find(
            { _playlistID: id }, 
            function(err, playlists){
                playlists.forEach(function(playlist){
                    playlist.remove(function(err){
                        if(err){
                            cb(err);
                        }
                    });
                });
                if(err) cb(err);
                else cb(null, playlists);
            }
        );
    }

}