/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          //console.log('in test 1 ' +JSON.stringify(res));
          assert.include(res.text,'issue_title','includes issue_title in text');
          assert.include(res.text,'status_text','includes status_text in text');
          //assert.include(res
         //res.should.have.status(200);
       //  res.body.should.be.a('object');
          //res.body.should.have.property('message').eql('Book updated!');
         //res.body.should.have.property('year').eql(1950);
         
         
         //assert.equal(res.text.issue_text,'Title');
          //fill me in too!
          
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
        chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in'})
             .end(function(err, res){
          assert.equal(res.status, 200);
          //console.log('in test 1 ' +JSON.stringify(res));
          assert.include(res.text,'issue_title','includes issue_title in text');
           assert.include(res.text,'issue_text','includes issue_text in text');
          assert.include(res.text,'created_by','includes created_by in text');
          done();
        });
      });
      
      test('Missing required fields', function(done) {
        chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          
          created_by: 'Functional Test - Every field filled in'})
             .end(function(err, res){
          assert.equal(res.status, 200);
          console.log('in missin fields ' +JSON.stringify(res));
          assert.include(res.text,'required fields','includes  error text');
           ////assert.include(res.text,'issue_text','includes issue_text in text');
          //assert.include(res.text,'created_by','includes created_by in text');
          done();
        });
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({
        _id:'5c444cc55497181f7b804773'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          console.log('nothing to update' +JSON.stringify(res));
          assert.include(res.text,'nothing to update','includes  nothing to update text');
           ////assert.include(res.text,'issue_text','includes issue_text in text');
          //assert.include(res.text,'created_by','includes created_by in text');
          done();
        });
      });
      
      test('One field to update', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({
        _id:'5c444cc55497181f7b804773',
        issue_title: 'Title-changed'+(new Date()),
          created_by: 'Functional Test - Every field filled in'
         })
        .end(function(err, res){
          assert.equal(res.status, 200);
          console.log('nothing to update' +JSON.stringify(res));
          assert.include(res.text,'successfully updated','includes title changed');
           ////assert.include(res.text,'issue_text','includes issue_text in text');
          //assert.include(res.text,'created_by','includes created_by in text');
          done();
          
        });
        
        
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({
        _id:'5c444cc55497181f7b804773',
        issue_title: 'Title-changed'+(new Date())
         })
        .end(function(err, res){
          assert.equal(res.status, 200);
          console.log('nothing to update' +JSON.stringify(res.body));
          assert.include(res.text,'successfully updated','includes title changed');
           ////assert.include(res.text,'issue_text','includes issue_text in text');
          //assert.include(res.text,'created_by','includes created_by in text');
          done();
        });
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({
          open:false
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          console.log('open-false test'+JSON.stringify(res.body[0]));
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return )', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({
          open:false
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          console.log('open-false test'+JSON.stringify(res.body[0]));
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .query({
          //'issue_title':'Title',
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          //assert.isArray(res.body);
          console.log('delete no id '+JSON.stringify(res.body));
          
          done();
        });
      
        
      });
      
      test('Valid _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .query({
          
          _id:'5c4451403e274a24cb1b7e7d'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          //assert.isArray(res.body);
          console.log('in delete valid id'+JSON.stringify(res.body));
          assert.property(res.body, 'success');
          done();
        });
      
        
      });
      
    });

});
