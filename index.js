window.addEventListener('load',initialExecution);

var data=[];
var url="https://todo-mock.herokuapp.com/items";
function initialExecution(){
    
    let xhr=new XMLHttpRequest();
    xhr.open('GET',url);
    xhr.send();
    xhr.onload=function(){
        if(xhr.status==200){
            data=JSON.parse(xhr.response);
            console.log(data)
            let count1=0;count2=0;
            let output1="<h1>Tasks to be completed</h1>";
            let output2="<h1>Completed Tasks</h1>";
            
                for(i in data){
                    if(data[i].status===false){
                        count1++;
                        output1+=`
                        <div class="cards">
                            <input onclick=completedTask(${data[i].id},event) type="checkbox" />
                            <div>${data[i].task}</div>
                            <div id="${data[i].id}"  class="edit">Edit</div>
                            <div onclick=deleteTask(${data[i].id},event) class="x">x</div>
                        </div>
                    `
                    }
                    if(data[i].status===true){
                        count2++;
                        output2+=`
                        <div class="trueCards">
                            <input checked===true type="checkbox"/>
                            <div class="cancel"> ${data[i].task}</div>
                            <div onclick=deleteTask(${data[i].id}) class="x">Delete</div>
                        </div>
                        `
                    }
                }
            
            if(data.length===0||count1===0){
                output1+="<div>You seem to be a hard working guy....</div>";
            }
            
            if(data.length===0||count2===0){
                output2+="<div>Its never late, get set go....</div>";
            }
            let output=output1+output2;
            document.getElementById("tasksDisplayer").innerHTML=output;
            document.querySelectorAll(".edit").forEach(el => {
                el.addEventListener('click',editTask);
            });
            

        }
        return data;
    }
    
}

document.getElementById("taskInput").addEventListener('keypress',displayAddedTask);

function displayAddedTask(event){
    if(event.keyCode==13){
        let input=event.target.value;
        let xhr=new XMLHttpRequest();
        xhr.open('GET',url);
        xhr.send();
        xhr.onload=function(){
            if(xhr.status==200){
                let data=JSON.parse(xhr.response);
                let lastId=data.length;
                let obj={
                    // "id":+lastId+1,
                    "task":input,
                    "status":false
                }
                let json=JSON.stringify(obj);
                let xml=new XMLHttpRequest();
                xml.open('POST',url);
                xml.setRequestHeader("Content-type","application/json;charset=utf-8");
                xml.send(json);
                xml.onload=function(){
                    if(xml.status>=200 && xml.status<400){
                        document.getElementById("taskInput").value="";
                        initialExecution();
                        
                    }
                    
                }
            }
        }
    }
}

function completedTask(id){
    
    let url=`https://todo-mock.herokuapp.com/items/${id}`;
    let obj={
        "status":true
    };
    let json=JSON.stringify(obj);
    let xhr=new XMLHttpRequest();
    xhr.open('PATCH',url);
    xhr.setRequestHeader("Content-type","application/json;charset=utf-8");
    xhr.send(json);
    xhr.onload=function(){
        
       initialExecution();
    }
}

function editTask(event){
    let item=data.find(el=>{
        return event.target.id===el.id.toString();
    })
    console.log(item)
    let updateBtn=document.getElementById("updateBtn");
    document.getElementById("updateCover").style.opacity="1";
    let updatedTask=document.getElementById("updatedTask");
    
    updateBtn.addEventListener("click",function(){
        
        let input=updatedTask.value;
        let obj={
            "task":input
        }
        let json=JSON.stringify(obj);
        
        let url=`https://todo-mock.herokuapp.com/items/${item.id}`;
        console.log(url)
        let xhr=new XMLHttpRequest();
        xhr.open('PATCH',url);
        xhr.setRequestHeader("Content-type","application/json;charset=utf-8");
        xhr.send(json);
        xhr.onload=function(){
            if(xhr.status>=200 && xhr.status<400){
                updatedTask.value="";
                location.assign("index.html");
            }
        }
    })
}

function deleteTask(id){
    let temp=data.find(el=>{
        return el.id==id.toString();
    })

    let xhr=new XMLHttpRequest();
    xhr.open("DELETE",`${url}/${temp.id}`);
    xhr.send();
    xhr.onload=function(){
        if(xhr.status>=200 && xhr.status<400){
            initialExecution();
        }
        else{
            alert("ERROR:"+xhr.status);
        }
        
    }
}