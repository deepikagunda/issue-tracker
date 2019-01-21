/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var mongo = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

//const CONNECTION_STRING = MongoClient.connect(process.env.DB, function(err, db) {


//});

let db;
//let collection;

mongo
  .connect(process.env.MLAB_URI, { poolSize: 10 })
  .then(client => {
    db = client.db('fcc');
    //collection = db.collection('my-collection');
  })
  .catch(error => console.error(error));

  
    module.exports = function (app) {
   
       //console.log('loading database from api routes'+db);
      app.route('/api/issues/:project')

        .get(function (req, res){
        console.log('in get ');
          var project = req.params.project;
        
        
          let query={project:project};
       console.log('req body '+typeof req.query.open);
         if(req.query.issue_title){
          query.issue_title=req.query.issue_title;}
          if(req.query.issue_text){query.issue_text=req.query.issue_text;}
          if(req.query.created_by){query.created_by=req.query.created_by;}
          if(req.query.assigned_to){
          query.assigned_to=req.query.assigned_to;
          }
          if(req.query.status_text){
           query.assigned_to=req.query.status_text;
          }
        
         if(req.query.open=="false"){
           //console.log('here');
         query.open=false;
         }
        else if (req.query.open=="true")
        {
          query.open=true;
        }
        
         db.collection('issues').find(query).toArray(function(err,result){
         if(err)
         {
           console.log('error in get'+ err);
         }
           else{
         console.log('in get method '+JSON.stringify(result[0])+ 'query '+JSON.stringify(query));
         
         res.json(result);
           }
         
         });

        })

        .post(function (req, res){
          var project = req.params.project;
        console.log('in post'+project);
          // issue_title, issue_text, created_by, and optional assigned_to and status_text.
          var query={ };
        query.project=project;
        if(req.body.issue_title && req.body.issue_text && req.body.created_by ){
          query.issue_title=req.body.issue_title;
          
          query.issue_text=req.body.issue_text;
          query.created_by=req.body.created_by;
        }
        else
        {
          res.json({'error':'required fields missing'});
        }
          if(req.body.assigned_to){
          query.assigned_to=req.body.assigned_to;
          }
        else
        {
          query.assigned_to='';
          
        }
          if(req.body.status_text){
           query.status_text=req.body.status_text;
          }
        else
        {
          query.status_text='';
        
        }
         query.open=true;
         query.created_on=new Date();
         query.updated_on=new Date();
         db.collection('issues').insertOne(query,function(err,result){
         if(err)
         {
           console.log(' in create error'+err);
           res.json({'error':'issue while inserting issue'
                    });
         }
         else
         {
           console.log('in post ' +JSON.stringify(result.insertedId ));
           db.collection('issues').findOne({_id:result.insertedId },function(err,doc){
             console.log('doc from the function ' +JSON.stringify(doc));
           res.json(doc);
         });
         }
         
         });
        })//end of post 

        .put(function (req, res){
          var project = req.params.project;
        
        // issue_title, issue_text, created_by, and optional assigned_to and status_text.
        //Returned will be 'successfully updated' or 'could not update '+_id
        //
//*_id(opt)Title(opt)Text(opt)Created by(opt)Assigned to(opt)Status textCheck to close issue
        
          
          var query={};
        if(!req.body._id)
        {
          res.json({'error':'_id was missing'});
        }
        if(!(req.body.issue_title || req.body.issue_text || req.body.created_by || req.body.assigned_to || req.body.status_text))
        {
          res.json({'error':'nothing to update'});
         }
          query._id=ObjectId(req.body._id) ;
          //var document={};
        
          var document = {};
           if(req.body.issue_title){
             
          document.issue_title=req.body.issue_title;}
          if(req.body.issue_text){document.issue_text=req.body.issue_text;}
          if(req.body.created_by){document.created_by=req.body.created_by;}
          if(req.body.assigned_to){
          document.assigned_to=req.body.assigned_to;
          }
          if(req.body.status_text){
           document.assigned_to=req.body.status.text;
          }
         if(req.body.open=="false"){
         document.open=false;}
        else
        {
          document.open=true;
        }
         
         //update the updated_date.
         document.updated_on=new Date();
        
        
         db.collection('issues').findOneAndUpdate(query,{$set:document},{returnNewDocument:true},function(err,result){
         if(err)
         {
           res.json({'error':'could not find '+req._id});
         }
        
         else
         {
          console.log('in post ' +JSON.stringify(result));
         res.json({'status':'successfully updated'});
         }
        });
      })//end of put
        .delete(function (req, res){
          var project = req.params.project;
        if(req.query._id)
           {
             console.log(' id was sent');
             
           }
        else
        {
          res.json({'error':'id was not sent'});
            
            
        }
        db.collection('issues').find({_id:ObjectId(req.query._id)}).toArray(function(err,result){
         if(err)
         {
           res.json({'failed':'could not find '+req.query._id});
         }
         else
         {
           console.log('result'+result);
           if(result[0]) {
             console.log(result[0]);
            db.collection('issues').deleteOne({_id:ObjectId(req.query._id)},function(err,deleteResult){  
             if(err)
             {
               res.json({'failed':'could not delete '+req.query._id});
             }
             else{
               //onsole.log('delete result ' + deleteResult[0]);
               
               if(deleteResult.result.n==1)
               {
               console.log('in post ' +JSON.stringify(deleteResult));
               res.json({'success':'deleted '+req.query._id});
               }
               else
               {
               }

             }
           });
         }
           else
           {
             res.json({'error':'the document with _id '+req.query._id + ' doesnt exist'});
           }
         }
        
         

        });

        });//end of app.routes

   

       };//end of export.
  //  });//end of mongo connection
