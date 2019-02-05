import React from "react";
import {connect} from "react-redux";

class HKloginPage extends React.Component{

    state={
        modal:true,
        displaySigninOrSignup:true
    }

    componentDidMount(){
        var modal=document.getElementById("loginPage")
        window.onclick = function(event) {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        }
        
        var span= document.getElementsByClassName("close");
        span[0].onclick=function(){
            modal.style.display = "none";
        }
    }

    onLoginFormSubmit(type,event){
        event.preventDefault();
        var formElements=document.getElementById("loginForm").elements;    
        var postData={};
        postData["type"]=type;
        for (var i=0; i<formElements.length; i++)
            if (formElements[i].type!=="submit" && formElements[i].type!=="button"){//we dont want to include the submit-buttom
                postData[formElements[i].name]=formElements[i].value;
            }
        
        console.log(postData);
        if(!postData.username || !postData.password){
            alert("Please enter username and password")
        }else if(postData.confirmpassword !==undefined && postData.password !==postData.confirmpassword){
            alert("password mismatch");
        }else{
            this.props.fetchUserDetails(postData);
            document.getElementById("loginPage").style.display="none"
        }
    }

    onClickSignInLink(){
        this.setState({
            displaySigninOrSignup:!this.state.displaySigninOrSignup
        })
    }

    render(){
        return(
            <div id="loginPage">
                <div id="modal" style={{display:this.state.modal?"grid":"none"}}>
                    <span className="close">&times;</span>
                    {/* <p>HK Login Page !!!!</p> */}
                    
                        <form id="loginForm" /* method="post" action="/loginUser" */ onSubmit={(event)=>{event.preventDefault()}}>
                            <label>username : </label><input type="text" name="username" required={true}></input>
                            <label>password : </label><input type="text" name="password" required={true}></input>
                            {
                            this.state.displaySigninOrSignup?
                            <React.Fragment>
                                <u style={{color:"blue",cursor:"pointer"}} onClick={this.onClickSignInLink.bind(this)}>Sign up</u>
                                <input type="submit" value="Login" key="loginbutton" style={{gridColumn:"2/3"}} onClick={this.onLoginFormSubmit.bind(this,"signin")}></input>
                            </React.Fragment>
                            :
                            <React.Fragment>
                                <label>confirm password : </label><input type="text" key="confirmpassword" name="confirmpassword"></input>
                                <label>passcode : </label><input type="text" key="passcode" name="passcode"></input>
                                <u style={{color:"blue",cursor:"pointer"}} onClick={this.onClickSignInLink.bind(this)}>Sign in</u>
                                <input type="submit" value="signup" key="signupbutton" style={{gridColumn:"2/3"}} onClick={this.onLoginFormSubmit.bind(this,"signup")}></input>
                            </React.Fragment>
                            }
                        </form> 
                </div>
                    {/* <p>HK Login Page !!!!</p> */}
            </div>
        )
    }
}

const mapStateToProps =(state)=>{
    return{
      logInState:state.logInState,
      username:state.username
    }
}

const mapDispatchToProps=(dispatch)=>{
    return {
      fetchUserDetails:(postData)=>{
        fetch("http://localhost:8081/loginUser",{
            method:"POST",
            headers:{
                'Content-Type': 'application/json'
              },
            body:  JSON.stringify(postData)
        }).then(res=>res.json()).then((res)=>{
            console.log(res);
            dispatch({type:"FETCH_USER",value:res})
        });
      }
    }
}


export default connect(mapStateToProps,mapDispatchToProps)(HKloginPage);