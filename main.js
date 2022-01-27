let marvel_data=[];
let url='';
let InputBox='';
let Total_pages='';
let page=1;
let Limit=0;
let topic;
let SearchPageMode=false; //검색화면인걸 표시하기 위한 변수

let SideMenuButton=document.querySelectorAll(".side-menu-button button");

SideMenuButton.forEach((menu)=>menu.addEventListener("click", (event)=>getNewsByTopic(event)));


let GoButton=document.getElementById("go-button");

GoButton.addEventListener("click", (event)=>{
    InputBox= document.getElementById("input-box").value;
    document.querySelector(".center-area").style.display="none";
    Limit=0;
    page=1;
    SearchPageMode=true;
    getSearchData();
    document.getElementById("input-box").value="";
    
})

let menuButton = document.querySelectorAll(".menu-line button");

menuButton.forEach((menu)=>menu.addEventListener("click", (event)=>getNewsByTopic(event)));

//각 url에 맞게 api 호출해주는 함수
const getNews= async()=>{
    try{
        let header = new Headers({'Content-Type' : 'application/json'});
        let response = await fetch(url);
        let data = await response.json();
        console.log("받은 데아터",data);

        if(data.code == 200){
            marvel_data= data.data.results;
            Total_pages=Math.ceil(data.data.total/12);
            page=Math.ceil(Limit/12)+1;
            console.log(marvel_data);
            console.log("total pages", Total_pages);
            document.querySelector(".main-text").style.display="none";
            showPagination();
        }
        else{
            throw new Error(data.status);
        }
        
    }catch(error){
        ErrorPage(error.message);
    }
}


const showCharactersPage= ()=>{
    let resultHTML='';
    resultHTML = marvel_data.map(item=>{
         return `
         <div class="col-md-2 col-sm-12">
         <div class="card">
             <img src="${item.thumbnail.path}.jpg" class="card-img-top">
             <div class="card-body">
               <h5 class="card-title">${item.name}</h5>
               <a href="${item.urls[0].url}" class="btn btn-primary color-detail">More Details</a>
                 </div>
             </div>
         </div>`
    }).join('');
    
   document.querySelector(".row").innerHTML= `<h2 class="page-text">${topic.toUpperCase()}</h2>`+ resultHTML;
}

const showComicSeriesPage= ()=>{
    let resultHTML='';
    resultHTML = marvel_data.map(item=>{
         return `<div class="col-md-2 col-sm-12" style="margin-top:1em;">
         <div class="text-center">
        <img src="${item.thumbnail.path}.jpg" class="rounded" style="width:145px;height:218px;">
        </div>
        <div style="display:flex; justify-content:center;">
        <a href="${item.urls[0].url}" style="color:white; text-decoration:none;">${item.title}</a>
        </div>
    </div>`
    }).join('');
 
    document.querySelector(".row").innerHTML= `<h2 class="page-text">${topic.toUpperCase()}</h2>`+ resultHTML;
 }

const showStoriesPage= ()=>{
    let resultHTML='';
    resultHTML = marvel_data.map(item=>{
         return ` <div class="accordion" id="accordionExample">
         <div class="accordion-item">
           <h2 class="accordion-header" id="headingOne">
             <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
               ${item.title.length>20? item.title.substring(0,20)+"...": item.title}
             </button>
           </h2>
           <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
             <div class="accordion-body" onclick="getStories(${item.id})">
              ${item.title}
             </div>
           </div>
         </div>
       </div>`
    }).join('');
 
    document.querySelector(".row").innerHTML= `<h2 class="page-text">${topic.toUpperCase()}</h2>`+resultHTML;
}

// 검색화면 보여주는 함수
const showSearchPage= ()=>{
    let resultHTML='';
    resultHTML = marvel_data.map(item=>{
         return `<div class="col-md-4 col-sm-12">
         <div class="card">
         <img src="${item.thumbnail.path}.jpg" class="card-img-top">
             <div class="card-body">
               <h5 class="card-title">${item.name}</h5>
               <a href="${item.urls[0].url}" class="btn btn-primary color-detail">Read More</a>
                 </div>
             </div>
         </div>
         `
    }).join('');
 
    document.querySelector(".row").innerHTML=  `<h2 class="page-text">"${InputBox.toUpperCase()}" RESULTS</h2>`+resultHTML;
}

const StoryOriginalPage=()=>{
    let resultHTML='';
    resultHTML = marvel_data.map(item=>{
         return `<div class="col-md-4 col-sm-12">
         <div class="card">
         <img src="${item.thumbnail.path}.jpg" class="card-img-top">
             <div class="card-body">
               <h5 class="card-title">${item.title}</h5>
               <a href="${item.urls[0].url}" class="btn btn-primary color-detail">Read More</a>
                 </div>
             </div>
         </div>`
    }).join('');
 
    document.querySelector(".row").innerHTML= resultHTML;
}


//api 조건에 맞게 호출
const getdata = async()=>{
    url= new URL(`https://gateway.marvel.com:443/v1/public/${topic}?&limit=12&offset=${Limit}&ts=1&apikey=af061977c0d81e3cf1b9dee6b4b919ad&hash=070a1fb7bd93545a70ce87cc7cccabaf`)
    await getNews();
    if(topic=="characters"){
        await showCharactersPage();
    }else if(topic == "stories"){
        await showStoriesPage();
    }
    else{
        await showComicSeriesPage();
    }
}

//검색으로 api 불러오기
const getSearchData = async(topic)=>{
    url= new URL(`https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${InputBox}&limit=12&offset=${Limit}&ts=1&apikey=af061977c0d81e3cf1b9dee6b4b919ad&hash=070a1fb7bd93545a70ce87cc7cccabaf`)
    await getNews();
    await showSearchPage();
}

const getStories = async(id)=>{
    console.log("전달완료");
    url= new URL(`https://gateway.marvel.com:443/v1/public/stories/${id}/comics?ts=1&apikey=af061977c0d81e3cf1b9dee6b4b919ad&hash=070a1fb7bd93545a70ce87cc7cccabaf`);
    await getNews();
    await StoryOriginalPage();
};

// pagination
const showPagination=()=>{
    let pageHTML =`<li class="page-item" style="display:${page==1?"none":""}">
    <a class="page-link" aria-label="Previous" onclick="movePage(1)">
      <span aria-hidden="true">&laquo;</span>
    </a>
  </li>
    <li class="page-item" onclick="movePage(${page-1})" style="display:${page==1?"none":""}">
    <a class="page-link">&lt;</a>
  </li>`;

    let pageGroup=Math.ceil(page/5);
    let last=pageGroup*5;
    if (last > Total_pages) {
        // 마지막 그룹이 5개 이하이면
        last = Total_pages;
      }
    let first= last-4<=0 ? 1: last-4;
    for(let i=first; i<=last;i++){
        pageHTML +=`<li class="page-item ${page==i?"active":""}"><a class="page-link" onclick="movePage(${i})">${i}</a></li>`
    }


    pageHTML +=`<li class="page-item" onclick="movePage(${page+1})" style="display:${page==Total_pages?"none":""}">
    <a  class="page-link">&gt;</a>
   </li>
   <li class="page-item" style="display:${page==Total_pages?"none":""}">
      <a class="page-link" aria-label="Next" onclick="movePage(${Total_pages})">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>`
    document.querySelector(".pagination").innerHTML=pageHTML;
}


const openInput=()=>{
    let InputArea= document.querySelector(".input-area");
    if(InputArea.style.display=="none"){
        InputArea.style.display ="inline";
    }
    else{
        InputArea.style.display ="none";
    }
}

const openSideMenu=()=>{
    if(document.querySelector(".side-menu").style.width=="0px"){
        document.querySelector(".side-menu").style.width="150px";
    }
    else{
        document.querySelector(".side-menu").style.width="0px";
    }
}

const closeSideMenu=()=>{
    document.querySelector(".side-menu").style.width="0px";
}


//page가 바뀔때마다 화면에 보여줌
const movePage=(pageNum)=>{
    page=pageNum;
    Limit=(page*12)-12;
    if(SearchPageMode==true){
        getSearchData();
    }
    else{
        getdata();
    }
}

//에러가 발생했을 때의 화면
const ErrorPage=(e)=>{
    console.log(e);
    document.querySelector(".show-area").innerHTML= `<h3 class="text-center alert alert-danger mt-1">${e}</h3>`;
};

//주제로 api호출하는 함수
const getNewsByTopic= async(event)=>{
    document.querySelector(".side-menu").style.width="0px";
    document.querySelector(".center-area").style.display="none";
    console.log("클릭됨", event.target.textContent);
    topic= event.target.textContent.toLowerCase();
    console.log(topic);
    page=1;
    Limit=0;
    SearchPageMode=false;
    getdata();
};


