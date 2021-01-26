 
var xLength = window.innerWidth;
var yLength = window.innerHeight;
var mousePos={x:0,y:0};
 
var canvas = document.querySelectorAll('canvas')[0];
var ctx = canvas.getContext('2d');
 
var speed = 1.5;
var camx = 0.0, camy = 0.0, camz = 0.0;
var rotx, roty, rotz=0;
var sin = Math.sin, cos = Math.cos;
var x1,y1,z1,x2,y2,z2,x3,y3,z3,tempx,tempy,tempz;
 
var rate = 400;
var zPlane = 0.1;
 
var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;
var spacebarPressed = false;
var shiftPressed = false;
var zoominPressed = false;
var zoomoutPressed = false;
var fasterPressed = false;
var slowerPressed = false;
 
function keyDownHandler(event) {
    if(event.keyCode == 68) {
        rightPressed = true;
    }
    else if(event.keyCode == 65) {
        leftPressed = true;
    }
    if(event.keyCode == 83) {
    	downPressed = true;
    }
    else if(event.keyCode == 87) {
    	upPressed = true;
    }
    if(event.keyCode == 32) {
    	spacebarPressed = true;
    }
    else if(event.keyCode == 16) {
    	shiftPressed = true;
    }
    if(event.keyCode == 79){
    	zoominPressed = true;
    }
    if(event.keyCode == 80){
    	zoomoutPressed = true;
    }
    if(event.keyCode == 75){
    	fasterPressed = true;
    }
    if(event.keyCode == 76){
    	slowerPressed = true;
    }
    //console.log(event.keyCode);
}
 
function keyUpHandler(event) {
    if(event.keyCode == 68) {
        rightPressed = false;
    }
    else if(event.keyCode == 65) {
        leftPressed = false;
    }
    if(event.keyCode == 83) {
    	downPressed = false;
    }
    else if(event.keyCode == 87) {
    	upPressed = false;
    }
    if(event.keyCode == 32) {
    	spacebarPressed = false;
    }
    else if(event.keyCode == 16) {
    	shiftPressed = false;
    }
    if(event.keyCode == 79){
    	zoominPressed = false;
    }
    if(event.keyCode == 80){
    	zoomoutPressed = false;
    }
    if(event.keyCode == 75){
    	fasterPressed = false;
    }
    if(event.keyCode == 76){
    	slowerPressed = false;
    }
}
 
function handler(){
    if(rightPressed){
    	camx += speed*cos(roty);
    	camz += speed*sin(roty);
    }
    if(leftPressed){
    	camx -= speed*cos(roty);
    	camz -= speed*sin(roty);
    }
    if(upPressed){
    	camx -= speed*sin(roty);
    	camz += speed*cos(roty);
    }
    if(downPressed){
    	camx += speed*sin(roty);
    	camz -= speed*cos(roty);
    }
    if(spacebarPressed){
    	camy += speed;
    }
    if(shiftPressed){
    	camy -= speed;
    }
    if(zoominPressed){
    	rate /= 0.9;
    }
    if(zoomoutPressed){
    	rate *= 0.9;
    }
    if(fasterPressed){
    	speed *= 0.9;
    }
    if(slowerPressed){
    	speed /= 0.9;
    }
}
 
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
 
onmousemove = function (e) {
	let k = document.querySelectorAll(".index")[0];
	k.style.left = e.pageX + "px";
	k.style.top = e.pageY + "px";
	document.querySelectorAll("#mouseX")[0].innerText = e.pageX;
	document.querySelectorAll("#mouseY")[0].innerText = e.pageY;
	mousePos.x = Number(document.querySelectorAll("#mouseX")[0].innerText) - (xLength/2);
	mousePos.y = (yLength/2) - Number(document.querySelectorAll("#mouseY")[0].innerText);
	rotx = mousePos.y/100;
	roty = -mousePos.x/100;
	xLength = window.innerWidth;
	yLength = window.innerHeight;
}
 
function draw2d(x1,y1,x2,y2){
	ctx.moveTo(x1,y1);
	ctx.lineTo(x2,y2);
	ctx.stroke();
}
 
function modifyPos(x,y,z){
	setValue(x - camx, y - camy, z - camz, 0);
	setValue(tempx*cos(roty)+tempz*sin(roty), tempy, tempz*cos(roty)-tempx*sin(roty), 0);
	setValue(tempx, tempy*cos(rotx)-tempz*sin(rotx), tempz*cos(rotx)+tempy*sin(rotx), 0);
	return [tempx, tempy, tempz];
}
 
function setValue(x,y,z,n){
	if(n==0){
		tempx=x; tempy=y; tempz=z;
	} else if(n==1){
		x1=x; y1=y; z1=z;
	} else if(n==2){
		x2=x; y2=y; z2=z;
	} else if(n==3){
		x3=x; y3=y; z3=z;
	}
}
 
function filltriangle(pos1,pos2,pos3){
	ctx.beginPath();
	ctx.moveTo(pos1[0]+xLength/2,yLength/2-pos1[1]);
	ctx.lineTo(pos2[0]+xLength/2,yLength/2-pos2[1]);
	ctx.lineTo(pos3[0]+xLength/2,yLength/2-pos3[1]);
	ctx.closePath();
	ctx.fill();
}
 
function projection(pos){
	return [pos[0]/pos[2]*rate, pos[1]/pos[2]*rate];
}
 
function division(pos1,pos2){
	return [(pos1[0]*(pos2[2]-zPlane)+(zPlane-pos1[2])*pos2[0])/(pos2[2]-pos1[2]),(pos1[1]*(pos2[2]-zPlane)+(zPlane-pos1[2])*pos2[1])/(pos2[2]-pos1[2]), zPlane];
}
 
function polygon(x1,y1,z1,x2,y2,z2,x3,y3,z3){
	var pos1=modifyPos(x1,y1,z1), pos2=modifyPos(x2,y2,z2), pos3=modifyPos(x3,y3,z3);
	if (pos2[2]>pos3[2]){
		var pos0 = pos2;
		pos2=pos3;
		pos3=pos0;
	}
	if (pos1[2]>pos2[2]){
		var pos0 = pos1;
		pos1=pos2;
		pos2=pos0;
	}
	if (pos2[2]>pos3[2]){
		var pos0 = pos2;
		pos2=pos3;
		pos3=pos0;
	}
	if (pos1[2]>zPlane){
		filltriangle(projection(pos1),projection(pos2),projection(pos3));
	} else if (pos2[2]>zPlane){
		var pos4=division(pos1,pos2);
		var pos5=division(pos1,pos3);
		filltriangle(projection(pos2),projection(pos3),projection(pos4));
		filltriangle(projection(pos3),projection(pos4),projection(pos5));
		console.log(pos4,pos5);
	} else if (pos3[2]>zPlane){
		var pos4=division(pos1,pos3);
		var pos5=division(pos2,pos3);
		filltriangle(projection(pos3),projection(pos4),projection(pos5));
	}
}
 
function cube(middleX,middleY,middleZ,length){
	poligon(middleX-length/2,middleY-length/2,middleZ-length/2);
}
 
function randompos(){
	return new Array(9).fill(1).map(function () {return Math.random()*100;});
}
 
var newpos1 = randompos();
var newpos2 = randompos();
var newpos3 = randompos();
 
setInterval(function(){
	handler();
	canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
	polygon.apply(this,newpos1);
	polygon.apply(this,newpos2);
	polygon.apply(this,newpos3);
	polygon.apply(this,[100,100,100,0,100,100,100,100,0]);
}, 20);
