$(document).ready(function () {
	
	//initialize global variables
	var cubeSize,
		cubeSideZ,
		voxelSize,
		voxelSideZ,
		voxelRange,
		rangeZmax,
		rangeZmin,
		rangeXmax,
		rangeXmin,
		rangeYmax,
		rangeYmin,
		cubeState = 0,
		voxelCount = 0,
		cursor,
		cursorData;

	//caching cube selector
	var cube = $('.cube');

	//creating data storage object
	var cubeData = new Object();
		cubeData.widthByHeight = cubeSize;
  		cubeData.axisLength = voxelRange;
  		cubeData.map = [];

  	//voxel constructor object
  	var Voxel = function (posX, posY, posZ, fill) {
  			this.posX = posX;
  			this.posY = posY;
  			this.posZ = posZ;
  			this.fill = fill;
  			this.alias = voxelCount;

  			//draw method
  			function draw (x, y, z, alias, fill) {

				//html template
				var voxelHTML = "<div class='voxel' id='voxel" + alias + "' style='-webkit-transform: rotateX(0deg) rotateY(0deg) translate3d(" + x +"px," + y + "px," + z + "px);'><figure class='front'></figure><figure class='back'></figure><figure class='right'></figure><figure class='left'></figure><figure class='top'></figure><figure class='bottom'></figure></div>";
		
				cube.append(voxelHTML);

				var thisVoxel = $('#voxel' + alias);

				//set voxel container's width/height
				thisVoxel.css({
					"width" : (1 / voxelRange) + "%",
					"height" : (1 / voxelRange) + "%"
				});

				//set width and height of each voxel's figure element
				thisVoxel.find('figure').css({
					"width" : voxelSize + "px",
					"height" : voxelSize + "px"
				});

				//fill if provided
				if (!(fill == null)) {
					thisVoxel.find('figure').css({
						"background-color" : fill
					});
				}

				//push figure elements out to create cube's structure
				thisVoxel.find('.front').css({
					"-webkit-transform" : "rotateY(0deg) translateZ(" + voxelSideZ + "px)"
				});

				thisVoxel.find('.back').css({
					"-webkit-transform" : "rotateX(180deg) translateZ(" + voxelSideZ + "px)"
				});

				thisVoxel.find('.right').css({
					"-webkit-transform" : "rotateY(90deg) translateZ(" + voxelSideZ + "px)"
				});

				thisVoxel.find('.left').css({
					"-webkit-transform" : "rotateY(-90deg) translateZ(" + voxelSideZ + "px)"
				});

				thisVoxel.find('.top').css({
					"-webkit-transform" : "rotateX(90deg) translateZ(" + voxelSideZ + "px)"
				});

				thisVoxel.find('.bottom').css({
					"-webkit-transform" : "rotateX(-90deg) translateZ(" + voxelSideZ + "px)"
				});

  			}

  			//exemption for inital cursor creation
  			if (!(this.fill == null)) {
  				//standard procedure for voxel creation
  				draw(this.posX, this.posY, this.posZ, this.alias, this.fill);
  				cubeData.map.push(this);
  			} else {
  				//cursor creation
  				draw(this.posX, this.posY, this.posZ, this.alias);
  			}

  			voxelCount++;

  			console.log(cubeData);

  		}

	//set cube properties
	function setCube (sideLength) {

		//set width and height of figure elements
		$('.cube figure').css({
			"width": sideLength + 'px',
			"height": sideLength + 'px'
		});

		//store variable for translateZ css
		var cubeSideZ = sideLength / 2;

		//push figure elements out to create cube's structure
		$('.cube .front').css({
			"-webkit-transform" : "rotateY(0deg) translateZ(" + cubeSideZ + "px)"
		});

		$('.cube .back').css({
			"-webkit-transform" : "rotateX(180deg) translateZ(" + cubeSideZ + "px)"
		});

		$('.cube .right').css({
			"-webkit-transform" : "rotateY(90deg) translateZ(" + cubeSideZ + "px)"
		});

		$('.cube .left').css({
			"-webkit-transform" : "rotateY(-90deg) translateZ(" + cubeSideZ + "px)"
		});

		$('.cube .top').css({
			"-webkit-transform" : "rotateX(90deg) translateZ(" + cubeSideZ + "px)"
		});

		$('.cube .bottom').css({
			"-webkit-transform" : "rotateX(-90deg) translateZ(" + cubeSideZ + "px)"
		});

	}

	function createEnvironment () {

		setCube(cubeSize);

		//store variable for voxel size
		voxelSize = cubeSize / voxelRange;

		//store variable for translateZ css
		voxelSideZ = voxelSize / 2;

		//setting axis ranges for population
		//x
		rangeXmin = 0;
		rangeXmax = cubeSize - voxelSize;

		//y
		rangeYmin = 0;
		rangeYmax = cubeSize - voxelSize;

		//z
		rangeZmin = -((cubeSize / 2) - (voxelSize / 2));
		rangeZmax = (cubeSize / 2) - (voxelSize / 2);

		//create cursor
		cursorData = new Voxel(rangeXmin, rangeYmin, rangeZmin);
		//setting default fill for voxel creation
		cursorData.fill = 'rgb(255,255,255)';
		//assign class cursor for easy identification
		$('#voxel0').addClass('cursor');
		//cache cursor class selector
		cursor = $('.voxel.cursor');


		$('.palette').show();

	}

	//pass specs from user input and initialize environment
	$('.pop').click(function () {

		cubeSize = $('.cube-size').val();
		voxelRange = $('.voxel-range').val();

		//update data storage object
		cubeData.widthByHeight = cubeSize;
  		cubeData.axisLength = voxelRange;

  		if (!(cubeSize % voxelRange == 0)) {
  			alert('WARNING: the cube size you specified is not evenly divisible by the axis length you picked. Please increase the cube size, or decrease/increase your axis length to be evenly divisible, and try again.')
  		} else {
  			createEnvironment();
  			$('.controlPanel').addClass('initializeHidden');
  		}

		

	});

	//assign selected color
	$('.btnPalette').click(function () {
		var currentColor = $(this).css('background-color');

		//update currentColor div
		$('.currentColor').css({
			'background-color' : currentColor
		});

		cursorData.fill = currentColor;

	});

	//render movement
	function renderMovement () {
		cursor.css({
			'-webkit-transform' : 'rotateX(0deg) rotateY(0deg) translate3d(' + cursorData.posX + 'px,' + cursorData.posY + 'px,' + cursorData.posZ + 'px)'
		});
	}

	//rotate environment based off cubeState
	function rotateCube (cubeState, keyCode) {
		
		switch (cubeState){
			case 0:
				if (keyCode == 69) {
					cube.removeClass('animate3').addClass('animateDefault');
				} else {
					cube.removeClass('animate1').addClass('animateDefault');
				};

				break;
			case 1:
				if (keyCode == 69) {
					cube.removeClass('animateDefault').addClass('animate1');
				} else {
					cube.removeClass('animate2').addClass('animate1');
				};
				
				break;

			case 2:
				if (keyCode == 69) {
					cube.removeClass('animate1').addClass('animate2');
				} else {
					cube.removeClass('animate3').addClass('animate2');
				};

				break;

			case 3:
				if (keyCode == 69) {
					cube.removeClass('animate2').addClass('animate3');
				} else {
					cube.removeClass('animateDefault').addClass('animate3');
				};

				break;
		}

	}

	function deleteVoxel () {
		for (var i = cubeData.map.length; i--;) {
			if ((cubeData.map[i].posX == cursorData.posX) && (cubeData.map[i].posY == cursorData.posY) && (cubeData.map[i].posZ == cursorData.posZ)) {
				console.log($('#voxel' + cubeData.map[i].alias));
				$('#voxel' + cubeData.map[i].alias).remove();
				cubeData.map.splice(i, 1);
				
			}
		}
	}

	function createVoxel () {
		if (!(cubeData.map.length == 0)){
			var voxelExists = false;
			for (var i = cubeData.map.length; i--;) {
				if (checkVoxel(cubeData, i)) {
					voxelExists = true;
				}
			}
			if (voxelExists) {
				alert('fuck you');
			} else {
				new Voxel(cursorData.posX, cursorData.posY, cursorData.posZ, cursorData.fill);
			}
		} else {
			new Voxel(cursorData.posX, cursorData.posY, cursorData.posZ, cursorData.fill);
		}
		
	}

	function checkVoxel (cubeData, i) {
		var voxelExists = false;
		if ((cubeData.map[i].posX == cursorData.posX) && (cubeData.map[i].posY == cursorData.posY) && (cubeData.map[i].posZ == cursorData.posZ)) {
			voxelExists = true;
		}
		return voxelExists;
	}


	//controls
	$(document).keydown(function (e) {

		switch (e.keyCode) {
			//w
			//forward
			case 87:
				switch (cubeState) {
					case 0:
						cursorData.posZ -= voxelSize;
						renderMovement();
						break;
					case 1:
						cursorData.posX -= voxelSize;
						renderMovement();
						break;

					case 2:
						cursorData.posZ += voxelSize;
						renderMovement();
						break;

					case 3:
						cursorData.posX += voxelSize;
						renderMovement();
						break;
				}

				break;

			//s
			//back
			case 83:
				switch (cubeState) {
					case 0:
						cursorData.posZ += voxelSize;
						renderMovement();
						break;
					case 1:
						cursorData.posX += voxelSize;
						renderMovement();
						break;

					case 2:
						cursorData.posZ -= voxelSize;
						renderMovement();
						break;

					case 3:
						cursorData.posX -= voxelSize;
						renderMovement();
						break;
				}

				break;

			//a
			//left
			case 65:
				switch (cubeState) {
					case 0:
						cursorData.posX -= voxelSize;
						renderMovement();
						break;
					case 1:
						cursorData.posZ += voxelSize;
						renderMovement();
						break;

					case 2:
						cursorData.posX += voxelSize;
						renderMovement();
						break;

					case 3:
						cursorData.posZ -= voxelSize;
						renderMovement();
						break;
				}

				break;

			//d
			//right
			case 68:
				switch (cubeState) {
					case 0:
						cursorData.posX += voxelSize;
						renderMovement();
						break;
					case 1:
						cursorData.posZ -= voxelSize;
						renderMovement();
						break;

					case 2:
						cursorData.posX -= voxelSize;
						renderMovement();
						break;

					case 3:
						cursorData.posZ += voxelSize;
						renderMovement();
						break;
				}

				break;

			//space
			//up
			case 32:
				cursorData.posY -= voxelSize;
				renderMovement();
				break;

			//v
			//down
			case 86:
				cursorData.posY += voxelSize;
				renderMovement();
				break;

			//e
			//rotate clockwise
			case 69:
				if (cubeState == 3) {
					cubeState = 0;
				} else {
					cubeState++;
				}

				rotateCube(cubeState, e.keyCode);

				break;

			//q
			//rotate counterclockwise
			case 81:
				if (cubeState == 0) {
					cubeState = 3;
				} else {
					cubeState--;
				}
				
				rotateCube(cubeState, e.keyCode);

				break;

			//f
			//place block
			case 70:
				createVoxel();
				break;

			//r
			//delete block
			case 82:
				deleteVoxel();
				break;

		}
		
	});

});