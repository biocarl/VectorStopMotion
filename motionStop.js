/**
 *
 * MISC for website
 */
//Set 100% zoom
var scale = 'scale(1)';
document.body.style.webkitTransform =  scale;    // Chrome, Opera, Safari
document.body.style.msTransform =   scale;       // IE 9
document.body.style.transform = scale;     // General
document.body.style.zoom = 1.0

//Disable zoom
$(document).keydown(function(event) {
if (event.ctrlKey==true && (event.which == '61' || event.which == '107' || event.which == '173' || event.which == '109'  || event.which == '187'  || event.which == '189'  ) ) {
        event.preventDefault();
     }
  });

/**
 *
 * Functions for showcasing
 */
//Color function for showcase (special, random color)
function changeColor(id,color){

  if(color == "special"){
    $("#"+id).children().each(function() {
      $(this).css( "stroke", getRandomColor());
    });
}
else {
  $( "#"+id ).children().css( "stroke", color);
}
}
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

//Buttons on group elements for showcase
function makeButton(id){
  //defs
  var  svgns = "http://www.w3.org/2000/svg";

  //Getting dims
  var  group = document.getElementById(id);
  var bbox = group.getBBox();

  //creating clickable rectangle
  var  rect = document.createElementNS(svgns, "rect");
  rect.setAttribute("x",  bbox.x);
  rect.setAttribute("y",  bbox.y);
  rect.setAttribute("width", bbox.width);
  rect.setAttribute("height", bbox.height);
  rect.setAttribute("fill", "#ccc");
  rect.setAttribute("fill-opacity", ".0");
  rect.setAttribute("stroke-opacity", ".0");
  rect.setAttribute("onclick",id+"()");
  rect.setAttribute("style","cursor: pointer;");
  //Append to group
  group.appendChild(rect);
}

/*Draw SVG around bug*/
function makeDead(id){
//defs
var  svgns = "http://www.w3.org/2000/svg";

//Getting dims
var  group = document.getElementById(id);
/*
//making bug bigger
group.setAttribute("transform", "scale(1.11)");
*/
var bbox = group.getBBox();


//creating boarder
var  rect = document.createElementNS(svgns, "rect");
rect.setAttribute("x",  bbox.x);
rect.setAttribute("y",  bbox.y);
rect.setAttribute("width", (bbox.width));
rect.setAttribute("height", (bbox.height));
rect.setAttribute("fill", "#ccc");
rect.setAttribute("fill-opacity", ".8");
rect.setAttribute("stroke-opacity", ".0");
rect.setAttribute("onclick",id+"()");
//draw a rec with the dims of a 20% bigger viewport

rect.setAttribute("style","cursor: pointer;");
//Append to group
group.appendChild(rect);
}


/**
 *
 * Testing lib
 */

//GLOBALS
var button_bool_insert = false;
var button_bool_kill = false;
var button_bool_crazy = false;
//data structure for tracking the current frame of a frame thread
var threadHashMap = []; //a 'hash' where the PID's of all started Interval-Threads are stored and as value the last used frame
//data structure for tracking last started frame thread (or the history of starts)
var threadStack = [];
threadStack.push(0); //bottom marker, nothing started yet


//Classes
/*
//FrameThread: represents the a running thread with it's frames
function FrameThread(pid) {
    this.pid = pid;
}
FrameThread.prototype.toString = function () {
    return "_" + this.pid;
};
*/




/*Scale the bug and make them disappear after a specified time :(*/
function scaleGroup(id,duration) {

}

/*BUTTONS**/
/*Insert a bug*/
function button_insert(){
    animateFrames2("bug",25,"infinite","reverse");
}
/*Making the bugs glowing*/
function button_crazy(){
    if(button_bool_crazy){
        changeColor("bug","transparent");
    }else {
        changeColor("bug","special");
    }
    //toggle bool
    button_bool_crazy = !button_bool_crazy;
}

/*Remove bug*/
function button_kill() {
    /*
     //if killed before -> create ghost
     if(button_bool_kill){
     changeColor("bug1","gray");
     }else {

     }
     //toggle bool
     button_bool_kill = !button_bool_kill;
     */
    //Last started frame thread
    var pid = threadStack.pop();

    //current frame (before stopping thread)
    clearInterval(pid);
    var lastFrame = threadHashMap["_"+pid];
    lastFrame ="bug"+(lastFrame+1);
    //Logs
    console.log("frame stopped: "+lastFrame);
    console.log("lastPid: " + pid);

    //Clone current frame, so we can edit it and don't have to worry about how to revert the colors (also for having multi-threadable ghost :P)
    var element = document.querySelector("#" +lastFrame);
    var ghost = element.cloneNode(true);
    ghost.setAttribute("id","ghost"+pid);
    element.parentNode.appendChild(ghost);
    //Hide actual frame
    //$( "#"+lastFrame).css( "display", "none");
    $( "#"+lastFrame).css( "display", "none");

    //What a wired problem: https://stackoverflow.com/questions/24148403/trigger-css-transition-on-appended-element
    //let the ghost disappear
    //animation time
    var duration = 8.8;
    setTimeout(function() {
        //Blending out
        /*
        $("#"+"ghost"+pid).css("-webkit-transition","opacity 3s ease-in-out");
        $("#"+"ghost"+pid).css("-moz-transition","opacity 3s ease-in-out");
        $("#"+"ghost"+pid).css("-ms-transition","opacity 3s ease-in-out");
        $("#"+"ghost"+pid).css("-o-transition","opacity 3s ease-in-out");
        */
        $("#"+"ghost"+pid).css("stroke-opacity","0");
        $("#"+"ghost"+pid).css("transition","visibility 0s 3s, stroke-opacity 3s linear");
        $("#"+"ghost"+pid).css("opacity","0");
        $("#"+"ghost"+pid).css("transition","visibility 0s 3s, stroke-opacity 3s linear");
        $("#"+"ghost"+pid).css("fill-opacity","0");
        $("#"+"ghost"+pid).css("transition","visibility 0s 3s, fill-opacity 3s linear");
        $("#"+"ghost"+pid).css("transition", "all "+duration+"s ease-in-out");
        $("#"+"ghost"+pid).css("transform","scale(6,6) translateX(0%) translateY(-60%) rotate(-120deg)");
        //making a ghost
        changeColor("ghost"+pid,"rgba(255,255,255,0.1");
        $("#"+"ghost"+pid).children().css("fill","rgba(255,255,255,0.1)");
    }, (10));

    //let the ghost disappear
    setTimeout(function() {
        //delete ghost-frame
        ghost.setAttribute("style","display:none;");//TODO : do it with fade transition
        element.parentNode.removeChild(ghost);
    }, (duration*1000));

}
//This is loaded when webpage is displayed
$(document).ready(function(){
    makeButton("button_crazy");
    makeButton("button_insert");
    makeButton("button_kill");
    prepareFrames("bug"); //only for testing

    // changeColor("sdfg","#FFF");
}); //End document.ready


/**
 *
 * Development of lib
 */

/*id    - Specify an id which is a parent group of the frame-groups which should follow the following naming convention: id[#frame]
* reps  - "indefinite" || ??
* fps   - frames per second
* */
function animateFrames(id,fps,reps) {
    //Get the number of max. frames, count starts at 1
    var max_frame=1;
    while ($("#"+id+max_frame).length > 0){
        max_frame++;
    }
    max_frame--;
    //Calculate duration per frame
    var duration = (60/fps)*1000;
    var frame = 1;

    //not very intuitive: anonymous function and function vars have the same scope -> see frame-var
    var interval = setInterval(function() {
        if(frame > max_frame) {
            //Start with first frame
            if (reps === "infinite") {
                frame = 1;
            }else{
                //Stop with animation after one cycle
                clearInterval(interval);
                return;
            }
        }
        setFrame(id,frame++,max_frame);
        }, duration);
}

/*[only for testing] You should do this before loading the page -> save to svg */
function hideFrames(id) {
    $( "#"+id ).children().css( "display", "none");
}
/*Allows to adress certain frames, although they were not name in order or unique*/
function nameFrames(id) {
    var children = $("#"+id).children();
    //var max_frame = children.length;
    var frame = 1;
    //name every frame with id and increasing cardinal
    children.each(function() {
        $(this).attr("id",""+id+frame);
        //HERE YOU COULD ALSO HIDE THE ELEMENTS, optional, like this too.
        frame++;
    });
}

/*Parent function*/
function prepareFrames(id) {
    hideFrames(id);
    nameFrames(id);
}

function setFrame(id,frame,max_frame) {
    console.log("id: "+id );
    console.log("frame: "+frame );
    //hide last used frame
    if(frame > 1) {
        document.getElementById(id + (frame - 1)).style.display = "none";
    }else {
        //in case of a anterior cycle the last frame has to be hidden (no effect if first cycle)
        document.getElementById(id +max_frame).style.display = "none";
    }
    //show current frame
    document.getElementById(id+frame).style.display = "block";
}


/*Another approach (works when all childs of id are frames in order, no need for naming convention and probably faster)
* For now, at not-reverse : the first frame is pulled! Since everything is starting at 1 and not 0!
*
* */
function animateFrames2(id,fps,reps,direction) {

    //Get all children of the frame-container
    var children = $("#"+id).children();

    //Get the number of max. frames, count starts at 0!
    var max_frame = children.length;
    console.log("max frames: "+max_frame);

    //Calculate duration per frame
    var duration = 1000/fps;

    //Just iterating the child array downwards
    if(direction==="reverse"){
        //Counter
        var frame = max_frame -1;
        //Set interval with defined fps
        var pid = setInterval(function () {
            //decrement frame
            frame--;
            //check if last frame was reached
            if (frame === -1) {
                //Start again at first frame
                if (reps === "infinite") {
                    frame = max_frame -1; //already decremented!
                } else {
                    //for now: Stop animation after one cycle
                    clearInterval(pid);
                    //save last shown frame in hash map
                    threadHashMap["_"+pid] = max_frame;
                    return;
                }
            }

            //Hide last frame
            if (frame < max_frame -1 ) {
                children.eq(frame + 1).css("display", "none");
            } else {
                //in case of a anterior cycle the first frame has to be hidden (no effect if first cycle)
                children.eq(0).css("display", "none");
            }
            //Show current frame
            children.eq(frame).css("display", "block");
            //save last shown frame in hash
            threadHashMap["_"+pid] = frame;
        }, duration);
    }else {

        /* TODO WATCH OUT: HERE THE first frame is still pulled! fix ;)*/
        //Counter
        var frame = 0;

        //Set interval with defined fps
        var pid = setInterval(function () {

            //increment frame
            frame++;

            //check if last frame is reached
            if (frame >= max_frame) {
                //Start again at first frame
                if (reps === "infinite") {
                    frame = 1; //already incremented!
                } else {
                    //save last shown frame in hash
                    threadHashMap["_"+pid] = 1; // TODO should be 0 ...
                    //for now: Stop animation after one cycle
                    clearInterval(pid);
                    return;
                }
            }

            //Hide last frame
            if (frame > 1) {
                children.eq(frame - 1).css("display", "none");
            } else {
                //in case of a anterior cycle the last frame has to be hidden (no effect if first cycle)
                children.eq(max_frame - 1).css("display", "none");
            }
            //Show current frame
            children.eq(frame).css("display", "block");
            //save last shown frame in hash
            threadHashMap["_"+pid] = frame;

        }, duration);
    }
    //Storing the pid of the last started frame thread thread under 'special' key '_0' in hash <_0,pid>, all other entries _n are <pid,frame>
    threadStack.push(pid);
    console.log("hash: "+threadHashMap._0);
    console.log("hash-length-control: "+ Object.keys(threadHashMap).length);
}
//Recursive approach
/*
function animateFrames(id,fps){
    //Get the number of max. frames, count starts at 1
    var max_frame=1;
    while ($("#"+id+max_frame).length > 0){
        max_frame++;
    }
    max_frame--;
    //Calculate duration per frame
    var duration = (60/fps)*1000;
    console.log("duration: "+duration );
    console.log("max_frame: "+max_frame );
    console.log("id: "+id );

    //Infinite recursive call
    setFrame(id,1,max_frame,duration);
}
//Recursive function to set the next frame and hide the current frame
function setFrame(id,frame, max_frame,duration) {
    if(frame > max_frame){
        setFrame(id,1,max_frame,duration); //start from the beginning
    }
    //hide last frame
    if(frame > 1) {
        console.log("id Searched: "+id + (frame - 1) );
        document.getElementById(id + (frame - 1)).style.display = "none";
    }
    //show current frame
    document.getElementById(id+frame).style.display = "block";
   setInterval(setFrame(id,frame+1,max_frame),duration);
}

*/





