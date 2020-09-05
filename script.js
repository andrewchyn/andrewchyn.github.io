(function() {
	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	    window.requestAnimationFrame = requestAnimationFrame;
	})();

	var canvas = document.getElementById("canvas"),
	    ctx = canvas.getContext("2d"),
	    cwidth = window.innerWidth-20,
	    cheight = window.innerHeight-320,
	    player = {
		  //Size related params
	      x : cwidth/2,
	      y : cheight - window.innerWidth/17,
	      width : window.innerWidth/33,
		  height : window.innerWidth/17,
		  
		  //Walking related params
	      speed: 6,
	      velX: 0,
		  velY: 0,
		  forward: 1,

		  //Jump related params
	      jumping: false,
		  keepjumping: true,
		  jump: 0,
		  jumpinc: 6,
		  basejump: 20,
		  maxjump: 100,

		  //Dash related params
		  dashState: "red",

		  //Crouching related params
		  holdingduck: false,
	    },
	    keys = [],
	    friction = 0.7,
	    gravity = 5;
	    dash = 3
	    inc = 3
	 
	//canvas.style = "position:absolute; left: 50%; width: 400px; margin-left: -200px;";
	canvas.width = cwidth;
	canvas.height = cheight;
	ctx.font = "30px Arial";
	 
	function update(){
		platformer = true;
		flat = false;
		intro = true;

		if (intro) {
			//fade in and tell controls
		}
		// Celeste movement
		if (platformer) {
			player.dashState = "red"
		
			// Add dash states

			if (player.dashState == "red") {
			//right dashes
				if (keys[82] && keys[39]) { //right                
					player.x += dash
					player.dashState = "cyan"
				}
				if (keys[82] && keys[39] && keys[38]) { //upright             
					player.x += Math.sqrt(dash)
					player.y -= dash
					player.dashState = "cyan"
				}
				if (keys[82] && keys[39] && keys[40]) { //downright                 
					player.x += Math.sqrt(dash)
					player.y += dash
					player.dashState = "cyan"
				}

				//left dashes
				if (keys[82] && keys[37]) { //left              
					player.x -= dash
					player.dashState = "cyan"
				}
				if (keys[82] && keys[37] && keys[38]) { //upleft            
					player.x -= Math.sqrt(dash)
					player.y -= dash
					player.dashState = "cyan"
				}
				if (keys[82] && keys[37] && keys[40]) { //downleft                
					player.x -= Math.sqrt(dash)
					player.y += dash
					player.dashState = "cyan"
				}

				//neutral dash
				if (keys[82]) {
					if(player.forward == 1){
						player.x += dash
					}
					else {
						player.x -= dash
					}
					player.dashState = "cyan"
				}
			}

			// HORIZONTAL MOVEMENT - Adds a set increment to the player's xy velocities up to a cap (constant acceleration)
			if (keys[39] || keys[68]) {
				// right arrow
				if (player.velX < player.speed) {             
					player.velX += inc;         
				}     
				player.forward = 1
			}     

			if (keys[37] || keys[65]) {         
				// left arrow         
				if (player.velX > -player.speed) {
					player.velX -= inc;
				}
				player.forward = 0
			}
		
			player.velX *= friction;
			player.x += player.velX
		
			// VERTICAL MOVEMENT - Holding spacebar increases the maximum jump height up to a cap, once the cap is reached, spacebar does nothing and gravity takes over

			// Check if the player is pressing spacebar. 
			if (keys[38] || keys[32] || keys[87]) {
				// up arrow or space

			    if(!player.jumping){
					player.jumping = true;
				}
			    if(player.velY - player.basejump > -60 && player.keepjumping) {
					player.velY -= player.basejump;
				  }
				else {
					player.keepjumping = false;
				}
			}

			if (player.velY + gravity <= gravity) {
				player.velY += gravity;
			}
			else {
				player.velY = gravity; 
			}
			player.y += player.velY;
			
			// CROUCHING
			player.height = window.innerWidth/17
			player.holdingduck = false
			if (keys[40] || keys[83]) {    
				if (!player.holdingduck) {
					player.y += window.innerWidth/(17*2)
				}     
				player.holdingduck = true
				player.height /= 2
			}
			
	
		
			if (player.x >= cwidth-player.width) {
				player.x = cwidth-player.width;
			} else if (player.x <= 0) {         
				player.x = 0;     
			}    
		
			if(player.y >= cheight-player.height){
				player.y = cheight - player.height;
				player.keepjumping = true;
				player.jumping = false;
			}


			//end of update
		ctx.clearRect(0,0,cwidth,cheight);

		//debugging
		ctx.fillText(player.jump, 300, 500);
		ctx.fillText("y velocity:" + player.velY, 100, 500);
		if(player.jumping) {
			ctx.fillText("jumping", 300, 530); 
		}
		else {
			ctx.fillText("not jumping", 300, 530); 
		} 
		ctx.fillText("y pos:" + player.y, 100, 560);

		ctx.fillStyle = player.dashState;
		ctx.fillRect(player.x, player.y, player.width, player.height);
		
		requestAnimationFrame(update);
		}
	}
		
		document.body.addEventListener("keydown", function(e) {
			keys[e.keyCode] = true;
		});
		
		document.body.addEventListener("keyup", function(e) {
			keys[e.keyCode] = false;
		});
		
		window.addEventListener("load",function(){
			update();
	
	});