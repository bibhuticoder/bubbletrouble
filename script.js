
$(window).load(function(){
 
    var canvas = $("#canvas")[0];
    var ctx = canvas.getContext('2d');
    ctx.lineWidth = 2;
    
    var Width,
        Height,
        timer,
        bubbles = [],
        fires = [],
        i, j;
    
    var player = {
       
        x: 100,
        y:600,
        speed: 20,
        speedX:0,
        size:10,
        color:"black"
       
    }
    
    setCanvasSize();
    
   
     bubbles.push({x: random(0, Width), y: 100, size: random(20, 30), speedX: random(-2, 2), speedY: 2, aclr: 0.2, color: "black"});
    
    
   timer = setInterval(draw, 30);
        
    function draw(){
  
        ctx.clearRect(0, 0, Width, Height);
        
        //draw player   
         player.x += player.speedX;
        //PLAYER RIGHT
        if(player.x + player.size > Width) {            
            player.x = Width - player.size;            
        } 
        
        // Player  LEFT
         else if(player.x - player.size < 0) {            
            player.x = player.size;            
        } 
        
        ctx.fillStyle = player.color;
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.size, 0, 360);
        ctx.fill();
        
        //draw ground
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.moveTo(0, player.y + player.size);
        ctx.lineTo(Width, player.y + player.size);
        ctx.stroke();
        
        
        //draw bubbles
        for(i=bubbles.length-1; i >= 0; i--){
            
            bubbles[i].x += bubbles[i].speedX;
            bubbles[i].y += bubbles[i].speedY;
          
            //BUBBLE COLLISSION
            if(bubbles[i].y + bubbles[i].size > player.y + player.size){ //Ground
                 
                 bubbles[i].speedY = -bubbles[i].size/2;
                 bubbles[i].speedX = random(-2, 2);
                 
             }
            
            else if(hasCollided(player, bubbles[i])) { // PLAYER
                
                clearInterval(timer);
               
             }
             
             else if(bubbles[i].x + bubbles[i].size > Width) { // RIGHT BORDER
                                  
                 bubbles[i].speedX = random(-2, 0);
                 
             }
            
             else if(bubbles[i].x - bubbles[i].size < 0){ // RIGHT BORDER
                
                 bubbles[i].speedX = random(0, 2);
                
             }// Collission end
                        
            bubbles[i].speedY += bubbles[i].aclr;
                       
            ctx.beginPath();
            ctx.strokeStyle = bubbles[i].color;
            ctx.arc(bubbles[i].x, bubbles[i].y, bubbles[i].size, 0, 360);
            ctx.stroke();
            
        }
        
        // draw fires
        if(fires.length >= 1){
            
             //draw fires
            for(i=fires.length-1; i >= 0; i--){
                
                fires[i].y -= fires[i].speedY;

                ctx.beginPath();
                ctx.fillStyle = fires[i].color;
                ctx.arc(fires[i].x, fires[i].y, fires[i].size, 0, 360);
                ctx.fill();
                
                //TIMEOUT
                if(fires[i].y < 0) { 
                    fires.splice(i, 1);
                    continue;
                }
                
                //COLLISSION
                for(j=bubbles.length-1; j >= 0; j--){
                    
                     if(hasCollided(fires[i], bubbles[j])){
                         
                         // for small sized bubbles
                         if(bubbles[j].size/2 < 5){                             
                             bubbles.splice(j, 1); 
                             fires.splice(i, 1);
                             break;
                         }
                         
                         // for larger sized bubbles
                         else{
                             
                             //split it into two equal bubbles
                             bubbles.push({x: bubbles[j].x, y: bubbles[j].y, size: bubbles[j].size/2, speedX: 2, speedY: 2, aclr: 0.1, color: "black" });

                             bubbles.push({x: bubbles[j].x, y: bubbles[j].y, size: bubbles[j].size/2, speedX: -2, speedY: 2, aclr: 0.1, color: "black" });

                             fires.splice(i, 1);
                             bubbles.splice(j, 1);
                             break;
                             
                         }
                     }            
                }                 
            }  
        }
                
        checkCollission();
        
    }
    
    function checkCollission(){
         
        
     
    }
    
    
    function hasCollided(cir1, cir2){
        
         var x1 = cir1.x;
         var y1 = cir1.y;
         var r1 = cir1.size;

         var x2 = cir2.x;
         var y2 = cir2.y;
         var r2 = cir2.size;

         var r1r2 = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

         if(r1r2 < (r1+r2)){             
             return true;
         }
        
        else return false;
        
    }
    
    
    $(window).keydown(function(e){
      
        console.log(e.keyCode);
        
        //RIGHT
        if(e.keyCode === 39){
            
            player.speedX = player.speed;
            
        }
        
        //LEFT
        else if(e.keyCode === 37){
            
            player.speedX = -player.speed;
            
        }
        
        
        //on SPACEBAR
        else if(e.keyCode === 32){
          
          // bubbles.push({x: random(0, Width), y: 100, size: random(10, 15), speedX: 0, speedY: 2, aclr: random(0.1, 0.5), color: "black" });
             
            timer = setInterval(draw, 30);
            
        }
        
        //on CTRL
        else if(e.keyCode === 17){
          
            if(fires.length === 0){
                fires.push({x: player.x, y: player.y, size: 5, color:"red", speedY: 10});    
            }
            
            
        }
        
    });
    
    $(window).keyup(function(e){
      
        player.speedX = 0;
        
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
	
