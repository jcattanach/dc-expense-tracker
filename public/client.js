
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
 
 