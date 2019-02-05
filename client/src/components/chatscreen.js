import React from "react";
import 'font-awesome/css/font-awesome.min.css';
import HKloginPage from "./loginPage";
import {connect} from "react-redux";
import myImg from "../assets/img/myphoto.jpg";
import "../assets/css/stylesheet.css"

class ChatScreen extends React.Component{

    constructor(){
        super();
                // if user is running mozilla then use it's built-in WebSocket
        window.WebSocket = window.WebSocket || window.MozWebSocket;
        this.state={
            selectedUser:"",
            targetUser:null
        }
        this.connection=new WebSocket('ws://127.0.0.1:8081/echo')
    }

    componentDidMount(){
        window.addEventListener("online",this.sendOnlineStatus.bind(this));
        window.addEventListener("offline",this.sendOnlineStatus.bind(this));
        this.props.fetchAllUsers();

        this.connection.onopen =  (msg)=> {
            // this.connection is opened and ready to use;
            setTimeout(()=>{this.connection.send('Here\'s some text that the server is urgently awaiting!')},1000);
            console.log(msg)
        };

        this.connection.onerror = function (error) {
            // an error occurred when sending/receiving data
            console.log(error)
        };

        this.connection.onmessage = function (message) {
            // try to decode json (I assume that each message
            // from server is json)
            try {
                console.log(message.data)
            var json = JSON.parse(message.data);
            } catch (e) {
            console.log('This doesn\'t look like a valid JSON: ',
                message.data);
            return;
            }
            // handle incoming message
            console.log(json)
        };

        //this.connection.send('user Loggedin '); 
    }

    sendOnlineStatus(){
        console.log(navigator.onLine);
        if(this.props.logInState){

        }
    }

    onSubmitChat(event){
        var x= event.which || event.keyCode;
        if(x===13){
            if(this.props.username!=="unauthorized user" && this.props.username && this.state.selectedUser){
                    //document.getElementById("chatInput").value="";
                    fetch("http://localhost:8081/getChat",{
                        method:"PUT",
                        headers:{
                            'Content-Type': 'application/json'
                          },
                        body:JSON.stringify({
                            chatstatement:document.getElementById("chatInput").value,
                            sourceUser:this.props.id,
                            targetUser:this.state.targetUser
                        })
                    }).then(res=>res.json()).then(res=>{
                        //document.getElementById("chatArea").innerHTML=res.chatstatement;
                        console.log(res)
                    });
                    
                    /* this.connection.send(JSON.stringify({
                        chatmessage:'HK',
                        chatstatement:"<p>"+document.getElementById("chatInput").value+"</p>",
                        sourceUser:this.props.id,
                        targetUser:this.state.targetUser
                    }));  */
                    document.getElementById("chatInput").value="";
                    //console.log(msg)
            }else{
                alert("User is "+this.props.username +` and chatting with ${this.state.selectedUser}`)
            }
        }
    }

    onLoginIconClick(){
        document.getElementById("loginPage").style.display="block"
    }

    onUserClick(event){
        this.setState({
            selectedUser:event.target.innerHTML,
            targetUser:event.target.id
        },
        ()=>{
        setInterval(()=>{if(this.props.username){
            fetch("http://localhost:8081/fetchChat",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    reqchat:this.state.targetUser+this.props.id
                })
            }).then(res=>res.json()).then(res=>{
                //console.log(res)
                document.getElementById("chatArea").innerHTML=res.chatstatement;
            })
        }},10000)})
        //console.log(event.target.id)
    }
    
    render(){
        //console.log(this.props.id,this.state.targetUser)
        /* if (!!window.EventSource) {
            var source = new EventSource('http://localhost:8081/countdown')
        
            source.addEventListener('message', function(e) {
              document.getElementById('data').innerHTML = e.data
            }, false)
        
            source.addEventListener('open', function(e) {
              document.getElementById('state').innerHTML = "Connected"
            }, false)
        
            source.addEventListener('error', function(e) {
              const id_state = document.getElementById('state')
              if (e.eventPhase === EventSource.CLOSED)
                source.close()
              if (e.target.readyState === EventSource.CLOSED) {
                id_state.innerHTML = "Disconnected"
              }
              else if (e.target.readyState === EventSource.CONNECTING) {
                id_state.innerHTML = "Connecting..."
              }
            }, false)
          } else {
            console.log("Your browser doesn't support SSE")
          } */
        return(
            <React.Fragment>
                <header>
                    <div style={{gridRow:"1/4",gridColumn:"1/2"}} ><img src={myImg} alt="Vivek_pic" style={{width:"100%",height:"100%"}}></img></div>
                    <span style={{alignSelf:"center",justifySelf:"center",gridRow:"1/3",gridColumn:"2/3"}}>Simple ChatBot<br/> <span>By</span><br/> Vivek Kumar Singh</span>
                    
                    <span style={{gridRow:"1/2",gridColumn:"3/4"}}>
                        <span style={{alignSelf:"flex-end",justifySelf:"flex-end",fontSize:"24px",color:"blue",marginRight:"16px"}} className ="fa fa-user" aria-hidden="true" onClick={this.onLoginIconClick.bind(this)}>

                        </span>
                    {
                        this.props.username!=="unauthorized user" && this.props.username ?
                        <span>{this.props.username}</span>:
                        <span onClick={this.onLoginIconClick.bind(this)}>Login</span>
                    }
                    </span>
                    <input style={{gridRow:"2/3",gridColumn:"3/4"}}></input>
                    <span style={{gridRow:"3/4",gridColumn:"2/3",border:"1px solid blue"}}>{this.state.selectedUser}</span>
                    <button style={{gridRow:"3/4",gridColumn:"3/4",border:"1px solid blue"}} onClick={()=>{
                        this.connection.send("HK")
                    }}>Search</button>
                </header>
                <div id="userList" onClick={this.onUserClick.bind(this)}>
                    {
                        this.props.allUsers?this.props.allUsers.map((user)=>{
                            return <p key={user._id} id={user._id} style={{cursor:"pointer",textDecoration:"underline",color:"blue"}}>{user._username}</p>
                        }):""
                    }
                </div>
                <HKloginPage></HKloginPage>
                <div id="chatArea">
                    
                </div>
                {/* <div id="data"></div> */}
                <input id="chatInput" onKeyUp={this.onSubmitChat.bind(this)}>

                </input>
                
                <div id="state"></div>
            </React.Fragment>
        )
    }
}

const mapStateToProps =(state)=>{
    return{
      logInState:state.logInState,
      username:state.username,
      allUsers:state.allUsers,
      id:state.id
    }
}

const mapDispatchToProps=(dispatch)=>{
    return {
        fetchAllUsers:()=>{
            fetch("http://localhost:8081/fetchAllUsers").then((res)=>res.json()).then((res)=>{
                console.log(res)
                dispatch({type:"FETCH_ALLUSERS",value:res})
            })
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(ChatScreen);