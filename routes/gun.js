var Gun = require('gun')
module.exports = functi on(app){

    app.put(`/gunDB`, function(req, res) {
        console.log("hit gun");
        if (Gun.serve(req, res)){ return } // filters gun requests!
        require('fs').createReadStream(require('path').join(__dirname, req.url)).on('error',function(){  
        
        res.send({"success": true});
        res.end();
        }).pipe(res); // stream
      
      
    })

  

   
}
