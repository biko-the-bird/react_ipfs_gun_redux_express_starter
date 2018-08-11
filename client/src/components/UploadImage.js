import React from 'react'

import ipfs from '../ipfs';
var Gun = require('gun');

const gun = Gun('http://localhost:5000/gundb');




class UploadImage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentGremlins: [],
            uploadName: '',
            buffer: undefined,
            ipfsHash: '',
            ipD: false
        }
        //testing/INITIALIZAION
        this.getGunUsers = this.getGunUsers.bind(this);

        //file upload
        this.sendReadyChecker = this.sendReadyChecker.bind(this);
        this.getFileName = this.getFileName.bind(this);
        this.getFile = this.getFile.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    //THIS IS WHERE THE MAGIC HAPPENS
    onSubmit = async (name, file) => {
        
  
        //DISABLE BUTTON ON PAGE
        this.setState({
            ipD: true
        })
        

        //ADD BUFFER FILE TO IPFS
        ipfs.files.add(this.state.buffer, (er, res) => {
            if (er) {
              console.error(er);
              return
            }
            //ADD ITEM TO GUN AS 'ipfsHash' you can name it whatever you want.
            //we save the file hash and the name.
            gun.get("gremlins").put({
              ipfsHash: {'name': name, ipfsHash: res[0].hash}});
      
            this.setState({  ipfsHash: res[0].hash});
            alert(this.state.ipfsHash);
          })
            
        //save document to IPFS,return its hash#, and set hash# to state
        //https://github.com/ipfs/interface-ipfs-core/blob/master/SPEC/FILES.md#add 
       
  }; 

  //initialization gets gun files from the network 
    getGunUsers() {
        var thisC = this;

        //SIMPLE EXAMLE ADD OBJ TO GUN
        //gun.get("gremlins").put({
        //'alice': {'name': 'alice', 'color': 'blue'}});

        //names here like gremlins can be changed to whatever you want
        var gremlins = gun.get('gremlins').once(function(e) {
            var grems = gremlins.map(function(gremlin){
                console.log("The person is", gremlin);
                var cGrems = thisC.state.currentGremlins.slice();
                var newGrem = {
                    name: gremlin.name,
                    ipfsHash: gremlin.ipfsHash
                }
                cGrems.push(newGrem);
                thisC.setState({
                    currentGremlins: cGrems
                })
              });
              console.log('grms', grems);
        });
       
        
    }


    componentDidMount() {

        //get existing 'gremlins' from the network
        this.getGunUsers();
       
    }

    //disable button when the upload is sent to ipfs
    sendReadyChecker() {
        if (this.state.ipD) {
        } else {
            return (
                <div>
                <button onClick={() => {this.onSubmit(this.state.uploadName, this.state.uploadFile)}} style={{backgroundColor: '#BADA55'}}>Upload</button>
            
            </div>)
        }
    }

    //name for the file to be saved to gun
    getFileName(e) {
        this.setState({
            uploadName: e.target.value
        })
    }

    //turn our file into a 'buffer' so ipfs can understand it
    getFile(e) {
        var t = this;
        const file = e.target.files[0];
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = () => {
          t.setState({
            buffer: Buffer(reader.result) 
          })
          console.log(this.state.buffer);
        }
    }
    

    render() {
        var thisC = this;
        


            var gremsArr = [];
        
            //iterating over the gremlins we got from the network and showing them on page
            for (var i = 0; i < this.state.currentGremlins.length; i++) {
                gremsArr.push(
                    <div >
                        <img src={`https://ipfs.io/ipfs/${thisC.state.currentGremlins[i].ipfsHash}`} alt=""/>
                        <p>{thisC.state.currentGremlins[i].name} is @{thisC.state.currentGremlins[i].ipfsHash}</p>
                    </div>
                )
            }
            
    
           
            return (
                <div>
                    <h3>upload file to ipfs/gun</h3>
                    <input onChange={this.getFileName}/>
                    <br/>
                    <input type="file" accept="img/png, img/jpeg" onChange={(e) => {this.getFile(e)}}/>
                    {this.sendReadyChecker()}
                    <hr/>
                    Image:
                    
                    {gremsArr}
                </div>
            )
        


       
    }

}
export default UploadImage