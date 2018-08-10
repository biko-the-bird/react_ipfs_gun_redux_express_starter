import React from 'react'

import ipfs from '../ipfs';
var Gun = require('gun');

const gun = Gun('http://localhost:5000/gundb');




class UploadImage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentGremlins: [],
            uploadFile: '',
            uploadName: '',
            sentFileUp: false,
            buffer: undefined,
            ipfsHash: '',
            ipD: false
        }
        //testing
        this.getGunUsers = this.getGunUsers.bind(this);

        //file upload
        this.sendReadyChecker = this.sendReadyChecker.bind(this);
        this.getFileName = this.getFileName.bind(this);
        this.getFile = this.getFile.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit = async (name, file) => {
        
  
        console.log("submit", name, file);
        this.setState({
            ipD: true
        })

        ipfs.files.add(this.state.buffer, (er, res) => {
            if (er) {
              console.error(er);
              return
            }
            gun.get("gremlins").put({
              ipfsHash: {'name': name, ipfsHash: res[0].hash}});
      
            this.setState({  ipfsHash: res[0].hash});
            alert(this.state.ipfsHash);
          })
            
            //console.log(typeof(b64File));
          


       
  
        //save document to IPFS,return its hash#, and set hash# to state
        //https://github.com/ipfs/interface-ipfs-core/blob/master/SPEC/FILES.md#add 
       
  }; //onSubmit 

    getGunUsers() {
        var thisC = this;
        //gun.get("gremlins").put({
        //'alice': {'name': 'alice', 'color': 'blue'}});

        
        var gremlins = gun.get('gremlins').once(function(e) {
            console.log(e, "jjj");
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

        this.getGunUsers();
       
    }

    sendReadyChecker() {
        if (this.state.ipD) {

        } else {
            return (
                <div>
                <button onClick={() => {this.onSubmit(this.state.uploadName, this.state.uploadFile)}} style={{backgroundColor: '#BADA55'}}>Upload</button>
            
            </div>)
        }
    
          
    
    }

    sendUpload(name, file) {
        this.setState({
            sentFileUp: true
        });
        console.log(name, file);




    }

    getFileName(e) {
        this.setState({
            uploadName: e.target.value
        })
    }
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