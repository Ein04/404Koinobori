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
	link1, link2, link2,
	linkframe1, linkframe2, linkframe3;

var speed;
var disturbance;


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
    	shading:THREE.FlatShading
});
	var mesh = new THREE.Mesh( poleGeo, poleMat );
	mesh.position.x = 0;
	mesh.position.y = 0;
	mesh.position.z = -30;
	mesh.receiveShadow = true;
	mesh.castShadow = true;
	scene.add( mesh );
}

function update(){
  render();
  var xTarget = (mousePos.x-windowHalfX);
  var yTarget= (mousePos.y-windowHalfY);
//todo
  requestAnimationFrame(update);
}

function render(){
  renderer.render(scene, camera);
}

init();
initLights();
initFloor();
initPole();
update();
