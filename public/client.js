
function evalForm(event){
     
 
     let category = document.getElementById("cat");
     
     let categoryValue = category.options[category.selectedIndex].value
     console.log("category value",categoryValue)
     
     if (categoryValue == "0"){
         let trans_form = document.getElementById("new-transaction-form")
            event.preventDefault() 
            popupS.alert({
                content:'Please select category'
            })
     }else {
         console.log("submitting form")
         document.getElementById("new-transaction-form").submit()
     };
 }
 

 function usernameEmailTaken(errorMessage){
        let x = document.getElementById('snackbar');
        x.className = "show";
        setTimeout(function(){x.className = x.className.replace("show","");},
        8000);
     
 }

/* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
function openNav() {
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
}

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
}