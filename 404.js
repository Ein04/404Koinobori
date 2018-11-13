console.log('hello stranger');

// SETUP RENDERER & SCENE
var HEIGHT,
  	WIDTH,
    windowHalfX,
  	windowHalfY,
    mousePos = {x:0,y:0};
    dist = 0;

var scene, 
    camera,
    controls,
    fieldOfView,
  	aspectRatio,
  	nearPlane,
  	farPlane,
    shadowLight, 
    backLight,
    light, 
    renderer,
	container;

var pole, poleframe,
	link1, link2, link3,
	linkframe1, linkframe2, linkframe3;

var speed=0;
var MAX_SPEED = 10;
var disturbanceX,disturbanceY;
var xPos,yPos,zPos;



function init() {
  scene = new THREE.Scene();
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 60;
  nearPlane = 1;
  farPlane = 2000; 
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane);
  camera.position.z = 800;  
  camera.position.y = 0;
  camera.lookAt(new THREE.Vector3(0,0,0)); 

  controls = new THREE.OrbitControls(camera);
  controls.damping = 0.2;
  controls.autoRotate = false;

  renderer = new THREE.WebGLRenderer({alpha: true, antialias: true });
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize(WIDTH, HEIGHT);
  renderer.shadowMap.enabled;
  container = document.getElementById('canvas');
  container.appendChild(renderer.domElement);
  windowHalfX = WIDTH / 2;
  windowHalfY = HEIGHT / 2;
  window.addEventListener('resize', onWindowResize, false);
  document.addEventListener('mousemove', handleMouseMove, false);
};

function onWindowResize() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  windowHalfX = WIDTH / 2;
  windowHalfY = HEIGHT / 2;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
}

function handleMouseMove(event) {
  mousePos = {x:event.clientX, y:event.clientY};
}

function initLights() {
  light = new THREE.HemisphereLight(0xffffff, 0xffffff, .5)
  
  shadowLight = new THREE.DirectionalLight(0xffffff, .8);
  shadowLight.position.set(200, 200, 200);
  shadowLight.castShadow = true;
 	
  backLight = new THREE.DirectionalLight(0xffffff, .4);
  backLight.position.set(-100, 200, 50);
  backLight.castShadow = true;
 	
  scene.add(backLight);
  scene.add(light);
  scene.add(shadowLight);
}

function initFloor(){ 
  floor = new THREE.Mesh(new THREE.PlaneBufferGeometry(1000,500), new THREE.MeshBasicMaterial({color:0x2b595a}));
  floor.rotation.x = -Math.PI/2;
  floor.position.y = -100;
  floor.receiveShadow = true;
  scene.add(floor);
}

function initPole(){
	var poleGeo = new THREE.CylinderGeometry(5,5,300,5);
	var poleMat = new THREE.MeshLambertMaterial({
	    color: 0xe55d2b, 
    	flatShading: true
});
	var mesh = new THREE.Mesh( poleGeo, poleMat );
	mesh.position.x = 0;
	mesh.position.y = 0;
	mesh.position.z = -30;
	mesh.receiveShadow = true;
	mesh.castShadow = true;
	scene.add( mesh );
}

function initFlags(){
	flagMaterialRed = new THREE.MeshLambertMaterial( {color: 0xc83d32} );
	flagMaterialGreen = new THREE.MeshLambertMaterial( {color: 0x99af5d} );
	flagMaterialYellow = new THREE.MeshLambertMaterial( {color: 0xe6b740} );
    boxGeometry = new THREE.BoxGeometry( 30, 30, 40 );    // width, height, depth

    link1 = new THREE.Mesh( boxGeometry, flagMaterialRed );  
    scene.add(link1);
    linkFrame1   = new THREE.AxesHelper(1) ;   
    scene.add(linkFrame1);
    link2 = new THREE.Mesh( boxGeometry, flagMaterialGreen );  
    scene.add(link2);
    linkFrame2   = new THREE.AxesHelper(1) ;   
    scene.add(linkFrame2);
    link3 = new THREE.Mesh( boxGeometry, flagMaterialYellow );  
    scene.add(link3);
    linkFrame3   = new THREE.AxesHelper(1) ;   
    scene.add(linkFrame3);

    link1.matrixAutoUpdate = false;  
    link2.matrixAutoUpdate = false;  
    link3.matrixAutoUpdate = false;  

    linkFrame1.matrixAutoUpdate = false;  
    linkFrame2.matrixAutoUpdate = false;  
    linkFrame3.matrixAutoUpdate = false;  
}

function flagSetMartices(xTarget,yTarget){
	var deg2rad = Math.PI/180;
	var xPos = 0;
	var yPos = 110;
	var zPos = -50;
	// if (disturbanceX < xTarget && disturbanceY < yTarget) {
	// 		disturbanceX+=speed;
	// 		disturbanceY+=speed;
	// } else {
	// 	disturbanceX = 0;
	// 	disturbanceY = 0;
	// }
	speed = (speed+Math.floor((Math.random() * 10) + 1)) % MAX_SPEED;
	var rotationM = new THREE.Matrix4();
	rotationM.identity();
	rotationM.lookAt(
		new THREE.Vector3(xPos,yPos,zPos),
		new THREE.Vector3(xTarget-speed/3,-(yTarget-speed/3),-100),
		new THREE.Vector3(0,1,0));


	//todo: degree calculated from mousePos

	      ////////////// link1
    linkFrame1.matrix.identity(); 
    linkFrame1.matrix.multiply(new THREE.Matrix4().makeTranslation(xPos,yPos,zPos)); 
    linkFrame1.matrix.multiply(new THREE.Matrix4().makeScale(2,2,-2)); 
    linkFrame1.matrix.multiply(rotationM); 
      // Frame 1 has been established
    link1.matrix.copy(linkFrame1.matrix);
    link1.matrix.multiply(new THREE.Matrix4().makeTranslation(0,0,0)); 
    link1.matrix.multiply(new THREE.Matrix4().makeScale(1,1,1));    

      ////////////// link2
    linkFrame2.matrix.copy(linkFrame1.matrix);      // start with parent frame
    linkFrame2.matrix.multiply(new THREE.Matrix4().makeTranslation(0,0,35));
    linkFrame2.matrix.multiply(new THREE.Matrix4().makeScale(0.75,0.75,0.75)); 
    // linkFrame2.matrix.multiply(new THREE.Matrix4().makeRotationZ(theta2));    
      // Frame 2 has been established
    link2.matrix.copy(linkFrame2.matrix);
    link2.matrix.multiply(new THREE.Matrix4().makeTranslation(0,0,0));   
    link2.matrix.multiply(new THREE.Matrix4().makeScale(1,1,1));    

      ///////////////  link3
    linkFrame3.matrix.copy(linkFrame2.matrix);
    linkFrame3.matrix.multiply(new THREE.Matrix4().makeTranslation(0,0,35));
    linkFrame3.matrix.multiply(new THREE.Matrix4().makeScale(0.75,0.75,0.75)); 
    // linkFrame3.matrix.multiply(new THREE.Matrix4().makeRotationZ(theta3));    
      // Frame 3 has been established
    link3.matrix.copy(linkFrame3.matrix);
    link3.matrix.multiply(new THREE.Matrix4().makeTranslation(0,0,0));   
    link3.matrix.multiply(new THREE.Matrix4().makeScale(1,1,1));   

    link1.updateMatrixWorld();
    link2.updateMatrixWorld();
    link3.updateMatrixWorld();

    linkFrame1.updateMatrixWorld();
    linkFrame2.updateMatrixWorld();
    linkFrame3.updateMatrixWorld();
}



function update(){
  render();
  var xTarget = (mousePos.x-windowHalfX);
  var yTarget= (mousePos.y-windowHalfY);
  flagSetMartices(xTarget,yTarget);
  requestAnimationFrame(update);
}

function render(){
  renderer.render(scene, camera);
}

function RotateYaxis(){

}

init();
initLights();
initFloor();
initPole();
initFlags();
update();
