const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {ensureAuthenticated} = require('./helpers/auth');

//Load Note model
require('../models/Note');
const Note = mongoose.model('notes');

router.get('/add',ensureAuthenticated,(req,res)=>{
    
    res.render('notes/add');
});

router.get('/',ensureAuthenticated,(req,res)=>{

    Note.find({user: req.user.id})
    .sort({date:'desc'})
    .then(notes =>{

        res.render('notes/index', {

            notes : notes
        });
    });
});

router.post('/',ensureAuthenticated,(req,res)=>{

    let errors = [];
    if(!req.body.title){

        errors.push({text:"Please add title."});
    }
    if(!req.body.details){

        errors.push({text:"Please add details."});
    }
    if(errors.length > 0){

        res.render('notes/add',{

            errors : errors,
            title : req.body.title,
            details : req.body.details
        });
    }
    else{

        const newNote = {

            title : req.body.title,
            details : req.body.details,
            user : req.user.id
            
        }
        new Note(newNote)
        .save()
        .then(note => {
            req.flash('success_msg','Note Added!');
            res.redirect('/notes');
        });
        
    }

});

router.get('/edit/:id',ensureAuthenticated,(req,res)=>{
    
    Note.findOne({
        _id : req.params.id
    })
    .then(note =>{

        if(note.user != req.user.id){

            req.flash('error_msg','Not Authorized');
            res.redirect('/notes');
        }
        else{

            res.render('notes/edit', {
                
                note : note
    
            });
        }
    });   
});

router.put('/:id',ensureAuthenticated,(req,res)=>{
    Note.findOne({
        _id : req.params.id
    })
    .then(note =>{
        //new values
        note.title = req.body.title;
        note.details = req.body.details;

        note.save()
        .then(note => {
            req.flash('success_msg','Note Updated!');
            res.redirect('/notes');
        });
    });
});


router.delete('/:id',ensureAuthenticated,(req,res) =>{

    Note.remove({ _id : req.params.id})
    .then(()=>{

        req.flash('success_msg','Note Removed!');
        res.redirect('/notes');
    });
    
});

module.exports = router;