var Gun = require('gun')
module.exports = function(app){

    app.put(`/gunDB`, function(req, res) {
        console.log("hit gun");
        if (Gun.serve(req, res)){ return } // filters gun requests!
        require('fs').createReadStream(require('path').join(__dirname, req.url)).on('error',function(){ // static files!
        
        res.send({"success": true});
        res.end();
        }).pipe(res); // stream
      
      
    }),

    app.put(`/uploadImageIPFS`, function(req, res) {
        console.log("hit ipfs img");
      console.log(req.body);
      res.send('200');
      
      
    })
  

   
}
