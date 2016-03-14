/*Bubble trouble

    used keywords:
        
        bubbles
        fires
        player     

*/

$(window).load(function(){
 
    var canvas = $("#canvas")[0];
    var ctx = canvas.getContext('2d');
        
    var Width,
        Height,
        timer,
        bubbles = [],
        fires = [],
        colors = [
            {in: "azure", out: "green"},
            {in: "white", out: "brown"},
            {in: "white", out: "red"},
            {in: "white", out: "orange"},
            {in: "white", out: "purple"},
            {in: "white", out: "limegreen"},
        ],
        
        i,
        gameStarted = false;
        
    var player = {
       
        x: 100,
        y:600,        
        speed: 10,
        speedX:0,
        size:30,
        h: 40,
        w: 20,
        background : new Image(),
        shieldColor: "black",
        shieldPadding: 5,
        
        loadImage: function(){
             this.background.src = 'player2.png';
        }
       
    }    
       
    var bubble = {
        
        speed:2,
        acclr: 0.2,
        maxSize: 30,
        minSize: 5,
        borderColor : "black",
        borderWidth : 1
        
    }
    
    var fire = {
        
        size: 5,
        color: "red",
        speed: 15,
        x: 0,
        y: 0,
        count: 0
        
    }
    
    var ground = {
        
        y: player.y + player.size,
        color: "black",
        backColor: "gray"
        
    };
    
    var ceiling = {
        
        y: 60,
        color: "black"
        
    };
    
    var score = {        
        
        font: "bolder 30px Sans-serif",
        color :"black",
        x : 10,
        y : ceiling.y - 10,
        data : 0
       
    }
    
    var time = {
        
        startedTime:0,
        total : 60, // in seconds
        elapsed : 0,
        value : 0,
        color:"red",
        borderColor: "black",
        fontSize: 20,
        font: "bolder 20px Sans-serif",
        fontColor: "black",
        height: 20,
        y: 0,
        
        setPos: function(){
            this.y = ground.y + this.height;
        },
        
        checkTimeOut: function(){
            
            if(Math.floor(this.elapsed) === this.total) clearInterval(timer);
            
        },
        
        updateTime: function(){
            this.elapsed = (Date.now() - this.startedTime)/1000;
            this.value = (Width/this.total)*this.elapsed;
        }
                
    }
    
    start();
    
    function start(){
        
        setCanvasSize();
    
        bubbles.push({x: random(10, Width-10), y: 100, size: random(3, 6)*bubble.minSize, speedX: bubble.speed, speedY: bubble.speed, aclr: bubble.acclr, color: colors[random(0, colors.length-1)]});

        bubbles.push({x: random(10, Width-10), y: 100, size: random(3, 6)*bubble.minSize, speedX: -bubble.speed, speedY: bubble.speed, aclr: bubble.acclr, color: colors[random(0, colors.length-1)]});

        time.setPos();
        player.loadImage();
        
        draw();
        
    }
        
    function draw(){
  
        ctx.clearRect(0, 0, Width, Height);
        
        drawCeiling();        
                        
        drawGround();
        
        drawBubbles();
        
        drawFires();
       
        drawScore();
        
        drawTimer();
        
        drawPlayer();
        
        time.updateTime();
       
    }
     
    function drawPlayer(){
                  
         player.x += player.speedX;
        
        //PLAYER RIGHT
        if(player.x + player.size > Width) player.x = Width - player.size;  
        
        // Player  LEFT
         else if(player.x  < 0) player.x = 0;     
 
        
        //draw Shield
        ctx.beginPath();
        ctx.strokeStyle = player.shieldColor;
        ctx.setLineDash([3,3]);
        ctx.arc(player.x, player.y, player.size, 0 , 360);  
        ctx.fillStyle = "lightskyblue";
        ctx.fill();
                
        // draw player
       
        ctx.drawImage(player.background, player.x - player.size + player.shieldPadding, player.y - player.size + player.shieldPadding*2, player.size*2 - player.shieldPadding*2, player.size*2 - player.shieldPadding * 2);
        
        ctx.setLineDash([0,0]); // restore line dash
        
        
       // ctx.fillRect(player.x, player.y, player.w, player.h);
        
        
    }
    
    function drawGround(){
        
        //draw ground
        ctx.beginPath();
        ctx.strokeStyle = ground.color;
        ctx.moveTo(0, ground.y);
        ctx.lineTo(Width, ground.y);
        ctx.stroke();
        
        ctx.fillStyle = ground.backColor;
        ctx.fillRect(0, ground.y, Width, Height - ground.y);
        
    }
    
    function drawBubbles(){
        
         for(i = bubbles.length-1; i >= 0; i--){
            
            bubbles[i].x += bubbles[i].speedX;
            bubbles[i].y += bubbles[i].speedY;
            bubbles[i].speedY += bubble.acclr;
          
            //BUBBLE COLLISSION
            if(bubbles[i].y + bubbles[i].size > ground.y){ //Ground
                 
                if(bubbles[i].size > 20)  bubbles[i].speedY = -13;
                
                else if(bubbles[i].size < 10) bubbles[i].speedY = -8;
                
                else bubbles[i].speedY = -bubbles[i].size/2;
                
            }
             
            else if(hasCollidedCir(bubbles[i], player)){ //PLAYER
                 
                 clearInterval(timer);
            }
             
            else if(bubbles[i].x + bubbles[i].size > Width) { // RIGHT BORDER
                                  
                 bubbles[i].speedX = random(-2, 0);
                 
             }
            
            else if(bubbles[i].x - bubbles[i].size < 0){ // LEFT BORDER
                
                 bubbles[i].speedX = random(0, 2);
                
             }
             
            else if(hasCollidedCir(fire, bubbles[i]) && fire.count){
                 
                 // for small sized bubbles
                     if(bubbles[i].size/2 < bubble.minSize){                             
                         bubbles.splice(i, 1); 
                         fire.count = 0;
                         score.data += 10;
                         break;
                     }

                     // for large sized bubbles
                     else {

                         //split it into two equal bubbles
                         bubbles.push({
                             x: bubbles[i].x,
                             y: bubbles[i].y, 
                             size: bubbles[i].size/2,
                             speedX: bubble.speed, 
                             speedY: bubble.speed,                                 
                             color: bubbles[i].color
                         });

                         bubbles.push({
                             x: bubbles[i].x, 
                             y: bubbles[i].y,
                             size: bubbles[i].size/2,
                             speedX: -bubble.speed,
                             speedY: bubble.speed,                                 
                             color: bubbles[i].color
                         });

                         fire.count = 0; // destroy the fire
                         bubbles.splice(i, 1); // destroy the bigger bubble
                         score.data++; // increase the score
                         break;

                     }  
                 
             }
             // Collission end
                        
            
                       
            ctx.beginPath();
            var fillColor = ctx.createRadialGradient(bubbles[i].x, bubbles[i].y, 0,  bubbles[i].x, bubbles[i].y, bubbles[i].size );
            fillColor.addColorStop(0, bubbles[i].color.in);
            fillColor.addColorStop(1, bubbles[i].color.out);             
            ctx.fillStyle = fillColor;
            ctx.arc(bubbles[i].x, bubbles[i].y, bubbles[i].size, 0, 360);
            ctx.fill();    
             
            ctx.beginPath();
            ctx.strokeStyle = bubble.borderColor;
            ctx.lineWidth = bubble.borderWidth;
            ctx.arc(bubbles[i].x, bubbles[i].y, bubbles[i].size + 1, 0, 360);
            ctx.stroke();
             
//            ctx.fillStyle = "red";
//            ctx.fillText(bubbles[i].size, bubbles[i].x, bubbles[i].y);
            
        }
        
    }
    
    function drawFires(){
        
         if(fire.count === 1){
            
            fire.y -= fire.speed;

             // line
            ctx.beginPath();            
            ctx.moveTo(fire.x, fire.y);
            //ctx.lineTo(fire.x, fire.y + 10);
              ctx.lineTo(player.x, player.y);
            ctx.strokeStyle = "black";
            ctx.setLineDash([3,3]);
            ctx.stroke();
              ctx.setLineDash([0,0]);
             
             //pointer
            ctx.beginPath();
            ctx.fillStyle = fire.color;
            ctx.moveTo(fire.x - fire.size, fire.y);
            ctx.lineTo(fire.x + fire.size, fire.y);
            ctx.lineTo(fire.x, fire.y - fire.size*2);
            ctx.lineTo(fire.x - fire.size, fire.y);             
            ctx.fill();
                                           
            //TIMEOUT
            if(fire.y < ceiling.y) { 
                fire.count = 0;

            }
                   
        }  
    }
            
    function drawScore(){
        
        //draw score
        ctx.font = score.font;
        ctx.fillStyle = score.color;
        var msg = "Score : " + score.data;
        ctx.fillText(msg, 10, ceiling.y - 10);
        
    }
    
    function drawCeiling(){
       
        //draw top bar
        ctx.beginPath();
        ctx.strokeStyle = ceiling.color;
        ctx.moveTo(0, ceiling.y);
        ctx.lineTo(Width, ceiling.y);
        ctx.stroke();
        
        ctx.fillStyle = ceiling.color;
        ctx.fillRect(0, ceiling.y, Width, 10);
        
    }
    
    function drawTimer(){
                       
        ctx.fillStyle = time.color;
        ctx.fillRect(0, time.y, time.value, time.height);
        ctx.strokeStyle = time.borderColor;
        ctx.strokeRect(0, time.y, Width, time.height);        
        ctx.stroke();
        
        ctx.fillStyle = time.fontColor;
        ctx.font = time.font;
        ctx.fillText(Math.floor(time.elapsed), time.value - time.fontSize , time.y);
        
        time.checkTimeOut();
        
    }
    
    function hasCollidedCir(cir1, cir2){
        
         var x1 = cir1.x;
         var y1 = cir1.y;
         var r1 = cir1.size;

         var x2 = cir2.x;
         var y2 = cir2.y;
         var r2 = cir2.size;

         var dist = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
               
         return (dist < (r1+r2));
        
    }
       
    function hasCollidedRect(circle,rect){
        var distX = Math.abs(circle.x - rect.x-rect.w/2);
        var distY = Math.abs(circle.y - rect.y-rect.h/2);

        if (distX > (rect.w/2 + circle.r)) { 
            return false; 
        }
        if (distY > (rect.h/2 + circle.r)) {
            return false;
        }

        if (distX <= (rect.w/2)) {
            return true;
        } 
        if (distY <= (rect.h/2)) { 
            return true;
        }

        var dx=distX-rect.w/2;
        var dy=distY-rect.h/2;
        return (dx*dx+dy*dy<=(circle.r*circle.r));
}
    
    $(window).keydown(function(e){
      
        //RIGHT
        if(e.keyCode === 39){
            
            player.speedX = player.speed;
            player.background.src = 'player2_right.png';
            
        }
        
        //LEFT
        else if(e.keyCode === 37){
            
            player.speedX = -player.speed;
            player.background.src = 'player2_left.png';
            
        }
        
        
        //on SPACEBAR
        else if(e.keyCode === 32){
               
            if(!gameStarted){
                timer = setInterval(draw, 30);
                gameStarted = true;  
                time.startedTime = Date.now();
            } 
            
            else{
                
                clearInterval(timer);
                gameStarted = false;  
                
            }
        }
        
        //on CTRL
        else if(e.keyCode === 17){          
           
            if(fire.count === 0){
                
                fire.count = 1;
                fire.x = player.x;
                fire.y = player.y;
            }
            
        }
        
    });
    
    $(window).keyup(function(e){
      
        player.speedX = 0;
        player.background.src = 'player2.png';
        
    });
    
    function random(min, max){
        
         return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    function setCanvasSize(){
        
        Width = $("body").width();
        Height = $("body").height();
                  
        $("#canvas").attr("width", Width);
        $("#canvas").attr("height", Height);
     
    }
    
});
	
