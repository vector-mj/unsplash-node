const register = async (username,passwordd)=>{
    console.log(username+":"+passwordd)
    try{
        const res = await axios({
            method:'POST',
            url:'http://localhost:5000/user/login',
            data:{
                email:username,
                password:passwordd
            }
        });
        console.log(res.data.message)
        if(res.data.message=='success'){
            setTimeout(()=>{
                window.location.assign('/dashboard');
            },1500);
        }
    }catch(err){
        console.log(err.response.data)
    }
}
document.querySelector('.formlogin').addEventListener('submit',e=>{
    e.preventDefault();
    const email = document.querySelector('.email').value
    const password = document.querySelector('.passwordd').value
    register(email,password);
})