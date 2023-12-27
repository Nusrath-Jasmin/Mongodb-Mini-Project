function checkvalidation() {

    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}<>])[A-Za-z\d!@#$%^&*(),.?":{}<>]{8,}$/;
    let inppass = document.getElementById("pass").value;
    let confirm = document.getElementById("confirm").value;
    let show = document.getElementById("show");
    let show1= document.getElementById("show1");
    let values = inppass;
    console.log("hll"+values);
    const correctpass = passwordPattern.test(values);
    if (!correctpass) {
      show.style.display = "block";
      return false;
    }else if(inppass!=confirm){
        show1.style.display = "block";
        return false;
    } 
    else {
      show.style.display = "none";
      return true;
    }
     
  }
  