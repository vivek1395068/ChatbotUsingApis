const initialState={
        logInState:false,
        username:null,
        allUsers:[],
        id:null
}

const reducer=(state=initialState,action)=>{
    if(action.type==="FETCH_USER"){
        return {
            ...state,
            logInState:action.value.logInState,
            username:action.value.username,
            id:action.value.id
        }
    }
    if(action.type==="FETCH_ALLUSERS"){
        return{
            ...state,
            allUsers:action.value
        }
    }
    return{...state}
}
export default reducer;