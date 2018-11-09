/////////////////////////////////////////////////////////////////////////////////////////
//  UBC CPSC 314,  Vsep2018
//  Assignment 3 Template
/////////////////////////////////////////////////////////////////////////////////////////

// console.log('hello world');

// a=5;  
// b=2.6;
// console.log('a=',a,'b=',b);
// myvector = new THREE.Vector3(0,1,2);
// console.log('myvector =',myvector);

var animation = true;

var myboxMotion = new Motion(myboxSetMatrices);     
var handMotion = new Motion(handSetMatrices);     
var link1, link2, link3, link4, link5;
var linkFrame1, linkFrame2, linkFrame3, linkFrame4, linkFrame5;
var meshes = {};  
var RESOURCES_LOADED = false;

// ALIEN: 
var alienMotion = new Motion(alienSetMatrices);
var alienMotion1 = new Motion(alienSetMatrices);
var alienMotion2 = new Motion(alienSetMatrices);
var linka1, linka2, linka3, linka4, linka5, linka6, linka7, linka8, linka9, linka10, linka11, linka12, linka13;
var linkFramea1, linkFramea2, linkFramea3, linkFramea4, linkFramea5, linkFramea6, linkFramea7, linkFramea8, linkFramea9, linkFramea10, linkFramea11, linkFramea12, linkFramea13;
var planetLink;
var SPEED = 0.01;


// SETUP RENDERER & SCENE

var canvas = document.getElementById('canvas');
var camera;
var light;
var ambientLight;
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer({
	Alpha: true });
renderer.setClearColor(0x111111, 1);     // set background colour
canvas.appendChild(renderer.domElement);

//////////////////////////////////////////////////////////
//  initCamera():   SETUP CAMERA
//////////////////////////////////////////////////////////

function initCamera() {
    var cameraFov = 30;     // initial camera vertical field of view, in degrees

    // set up M_proj    (internally:  camera.projectionMatrix )
    camera = new THREE.PerspectiveCamera(cameraFov,1,0.1,1000); 
      // view angle, aspect ratio, near, far

    // set up M_view:   (internally:  camera.matrixWorldInverse )
    camera.position.set(0,60,100);
    camera.up = new THREE.Vector3(0,20,0);
    camera.lookAt(0,1,0);
    scene.add(camera);

      // SETUP ORBIT CONTROLS OF THE CAMERA
    var controls = new THREE.OrbitControls(camera);
    controls.damping = 0.2;
    controls.autoRotate = false;
};

// ADAPT TO WINDOW RESIZE
function resize() {
  renderer.setSize(window.innerWidth,window.innerHeight);
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
}

//SCROLLBAR FUNCTION DISABLE
window.onscroll = function () {
     window.scrollTo(0,0);
}

////////////////////////////////////////////////////////////////////////	
// init():  setup up scene
////////////////////////////////////////////////////////////////////////	

function init() {
    console.log('init called');

    initCamera();
    initMotions();
    initLights();
    initObjects();
    initHand();
    // init alien:
    initAlien();
    initFileObjects();
    initCustomObjects();
    initGalaxy();
    initSounds();

    window.addEventListener('resize',resize);
    resize();
};

////////////////////////////////////////////////////////////////////////
// initMotions():  setup Motion instances for each object that we wish to animate
////////////////////////////////////////////////////////////////////////

function initMotions() {

      // keyframes for the mybox animated motion:   name, time, [x, y, z]
    myboxMotion.addKeyFrame(new Keyframe('rest pose',0.0, [0,1.9,0]));
    myboxMotion.addKeyFrame(new Keyframe('rest pose',1.0, [1,1.9,0]));
    myboxMotion.addKeyFrame(new Keyframe('rest pose',2.0, [1,20,0]));
    myboxMotion.addKeyFrame(new Keyframe('rest pose',3.0, [0,20,0]));
    myboxMotion.addKeyFrame(new Keyframe('rest pose',4.0, [0,1.9,0]));

      // basic interpolation test
    myboxMotion.currTime = 0.1;
    console.log('kf',myboxMotion.currTime,'=',myboxMotion.getAvars());    // interpolate for t=0.1
    myboxMotion.currTime = 2.9;
    console.log('kf',myboxMotion.currTime,'=',myboxMotion.getAvars());    // interpolate for t=2.9

      // keyframes for hand:    name, time, [x, y, theta1, theta2, theta3, theta4, theta5]
    handMotion.addKeyFrame(new Keyframe('straight',         0.0, [2, 3,    0, 0, 0, 0, 0]));
    handMotion.addKeyFrame(new Keyframe('right finger curl',1.0, [2, 3,   30, -90, -90, 0,0]));
    handMotion.addKeyFrame(new Keyframe('straight',         2.0, [2, 3,    0, 0, 0, 0, 0]));
    handMotion.addKeyFrame(new Keyframe('left finger curl', 3.0, [2, 3,   -30, 0, 0, -90, -140]));
    handMotion.addKeyFrame(new Keyframe('straight',         4.0, [2, 3,    0, 0, 0, 0, 0]));
    handMotion.addKeyFrame(new Keyframe('both fingers curl', 5.0, [2, 3,   30, -90, -90, -90,-140]));
    handMotion.addKeyFrame(new Keyframe('straight',         6.0, [2, 3,    0, 0, 0, 0, 0]));


    // // keyframes still for alien:    name, time, [x, y, z, theta1, theta2, theta3, theta4, 
    // //                                                    theta5, theta6, theta7, theta8, theta9, theta10, theta11, theta12, theta13]
    alienMotion.addKeyFrame(new Keyframe('0',    0.0, [-2, 10, -5,      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]))
    alienMotion.addKeyFrame(new Keyframe('1',    1.0, [-2, 10, -5,      0, 0, 0 , 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]))

    
    // // keyframes 1 for alien:    name, time, [x, y, z, theta1, theta2, theta3, theta4, 
    // //                                                    theta5, theta6, theta7, theta8, theta9, theta10, theta11, theta12, theta13]
    alienMotion1.addKeyFrame(new Keyframe('0',    0.0, [-2, 10, -5,      0, 0, 0, 150, -150, 0, 0, 0, 0, 0, 0, 0, 0]))
    alienMotion1.addKeyFrame(new Keyframe('1',    1.0, [-2, 20, -5,     10, 0, 0 , 130, -130, 20, 20, 20, -20, 0, 0, 0, 0]))
    alienMotion1.addKeyFrame(new Keyframe('2',    3.0, [-2, 30, -5,      20, 0, 0, 100, -100, 40, 40, 40, -40, 40, -40, 0, 0]))
    alienMotion1.addKeyFrame(new Keyframe('3',    4.0, [-2, 20, -5,     10, 0,0 , 60, -45, 60, 60, 60, -60, 60, -60, 0, 0]))
    alienMotion1.addKeyFrame(new Keyframe('4',    5.0, [-2, 10, -5,      0, 0, 0, 30, -60, 80, 80, 40, -40, 40, -40, 0, 0]))
    alienMotion1.addKeyFrame(new Keyframe('5',    6.0, [-2, 5, -5,     -10, 0,0 , 70, -70, 100, 100, 20, -20, 20, -20, 0, -45]))
    alienMotion1.addKeyFrame(new Keyframe('6',    7.0, [-2, 0, -5,      -20, 0, 0, 100, -100, 80, 80, 0, 0, 0, 0, 0, -90]))
    alienMotion1.addKeyFrame(new Keyframe('7',    8.0, [-2, 0, -5,     -10, 0,0 , 120, -120, 60, 60, 20, 20, -20, 20, 0, -90]))
    alienMotion1.addKeyFrame(new Keyframe('8',    9.0, [-2, 5, -5,      0, 0, 0, 120, -120, 40, 40, 40, 40, -40, 40, 0, -45]))
    alienMotion1.addKeyFrame(new Keyframe('9',   10.0, [-2, 10, -5,     0, 0,0 , 120, -120, 20, 20, 20, 20, -20, 20, 0, 0]))
    alienMotion1.addKeyFrame(new Keyframe('0',    11.0, [-2, 10, -5,      0, 0, 0, 120, -120, 0, 0, 0, 0, 0, 0, 0, 0]))


        // // keyframes2 for alien:    name, time, [x, y, z, theta1, theta2, theta3, theta4, 
    // //                                                    theta5, theta6, theta7, theta8, theta9, theta10, theta11, theta12, theta13]
    alienMotion2.addKeyFrame(new Keyframe('0',    0.0, [-2, 10, -5,      0, 0, 0, 120, -120, 0, 0, 0, 0, 0, 0, 0, 0]))
    alienMotion2.addKeyFrame(new Keyframe('1',    1.0, [0, 10, -5,     10, 0, 0 , 120, -120, 20, 20, 20, -20, 0, 0, 0, 0]))
    alienMotion2.addKeyFrame(new Keyframe('2',    3.0, [5, 10, -5,      20, 0, 0, 100, -100, 40, 40, 40, -40, 40, -40, 0, 0]))
    alienMotion2.addKeyFrame(new Keyframe('3',    4.0, [10, 10, -5,     10, 0,0 , 70, -70, 60, 60, 60, -60, 60, -60, 0, 0]))
    alienMotion2.addKeyFrame(new Keyframe('4',    5.0, [5, 10, -5,      0, 0, 0, 50, -50, 80, 80, 40, -40, 40, -40, 0, 0]))
    alienMotion2.addKeyFrame(new Keyframe('5',    6.0, [0, 10, -5,     -10, 0,0 , 70, -70, 100, 100, 20, -20, 20, -20, 0, 0]))
    alienMotion2.addKeyFrame(new Keyframe('6',    7.0, [-2, 10, -5,      -20, 0, 0, 100, -100, 80, 80, 0, 0, 0, 0, 0, 0]))
    alienMotion2.addKeyFrame(new Keyframe('7',    8.0, [-2, 10, 0,     -10, 0,0 , 120, -120, 60, 60, -20, 20, -20, 20, 0, 0]))
    alienMotion2.addKeyFrame(new Keyframe('8',    9.0, [-2, 10, 10,      0, 0, 0, 120, -120, 40, 40, -40, 40, -40, 40, 0, 0]))
    alienMotion2.addKeyFrame(new Keyframe('9',   10.0, [-2, 10, 0,     0, 0,0 , 120, -120, 20, 20, -20, 20, -20, 20, 0, 0]))
    alienMotion2.addKeyFrame(new Keyframe('0',    11.0, [-2, 10, -5,      0, 0, 0, 120, -120, 0, 0, 0, 0, 0, 0, 0, 0]))

}

///////////////////////////////////////////////////////////////////////////////////////
// myboxSetMatrices(avars)
///////////////////////////////////////////////////////////////////////////////////////

function myboxSetMatrices(avars) {
    mybox.matrixAutoUpdate = false;     // tell three.js not to over-write our updates
    mybox.matrix.identity();              
    mybox.matrix.multiply(new THREE.Matrix4().makeTranslation(avars[0], avars[1], avars[2]));  
    mybox.matrix.multiply(new THREE.Matrix4().makeRotationY(-Math.PI/2));
    mybox.matrix.multiply(new THREE.Matrix4().makeScale(1.5,1.5,1.5));
    mybox.updateMatrixWorld();  
}

///////////////////////////////////////////////////////////////////////////////////////
// handSetMatrices(avars)
///////////////////////////////////////////////////////////////////////////////////////

function handSetMatrices(avars) {
    var deg2rad = Math.PI/180;

    var xPosition = avars[0];
    var yPosition = avars[1];
    var theta1 = avars[2]*deg2rad;
    var theta2 = avars[3]*deg2rad;
    var theta3 = avars[4]*deg2rad;
    var theta4 = avars[5]*deg2rad;
    var theta5 = avars[6]*deg2rad;

      ////////////// link1
    linkFrame1.matrix.identity(); 
    linkFrame1.matrix.multiply(new THREE.Matrix4().makeTranslation(xPosition,yPosition,0));   
    linkFrame1.matrix.multiply(new THREE.Matrix4().makeRotationZ(theta1)); 
      // Frame 1 has been established
    link1.matrix.copy(linkFrame1.matrix);
    link1.matrix.multiply(new THREE.Matrix4().makeTranslation(3,0,0)); 
    link1.matrix.multiply(new THREE.Matrix4().makeScale(6,1,4));    

      ////////////// link2
    linkFrame2.matrix.copy(linkFrame1.matrix);      // start with parent frame
    linkFrame2.matrix.multiply(new THREE.Matrix4().makeTranslation(6,0,1));
    linkFrame2.matrix.multiply(new THREE.Matrix4().makeRotationZ(theta2));    
      // Frame 2 has been established
    link2.matrix.copy(linkFrame2.matrix);
    link2.matrix.multiply(new THREE.Matrix4().makeTranslation(2,0,0));   
    link2.matrix.multiply(new THREE.Matrix4().makeScale(4,1,1));    

      ///////////////  link3
    linkFrame3.matrix.copy(linkFrame2.matrix);
    linkFrame3.matrix.multiply(new THREE.Matrix4().makeTranslation(4,0,0));
    linkFrame3.matrix.multiply(new THREE.Matrix4().makeRotationZ(theta3));    
      // Frame 3 has been established
    link3.matrix.copy(linkFrame3.matrix);
    link3.matrix.multiply(new THREE.Matrix4().makeTranslation(2,0,0));   
    link3.matrix.multiply(new THREE.Matrix4().makeScale(4,1,1));    

      /////////////// link4
    linkFrame4.matrix.copy(linkFrame1.matrix);
    linkFrame4.matrix.multiply(new THREE.Matrix4().makeTranslation(6,0,-1));
    linkFrame4.matrix.multiply(new THREE.Matrix4().makeRotationZ(theta4));    
      // Frame 4 has been established
    link4.matrix.copy(linkFrame4.matrix);
    link4.matrix.multiply(new THREE.Matrix4().makeTranslation(2,0,0));   
    link4.matrix.multiply(new THREE.Matrix4().makeScale(4,1,1));    

      // link5
    linkFrame5.matrix.copy(linkFrame4.matrix);
    linkFrame5.matrix.multiply(new THREE.Matrix4().makeTranslation(4,0,0));
    linkFrame5.matrix.multiply(new THREE.Matrix4().makeRotationZ(theta5));    
      // Frame 5 has been established
    link5.matrix.copy(linkFrame5.matrix);
    link5.matrix.multiply(new THREE.Matrix4().makeTranslation(2,0,0));   
    link5.matrix.multiply(new THREE.Matrix4().makeScale(4,1,1));    

    link1.updateMatrixWorld();
    link2.updateMatrixWorld();
    link3.updateMatrixWorld();
    link4.updateMatrixWorld();
    link5.updateMatrixWorld();

    linkFrame1.updateMatrixWorld();
    linkFrame2.updateMatrixWorld();
    linkFrame3.updateMatrixWorld();
    linkFrame4.updateMatrixWorld();
    linkFrame5.updateMatrixWorld();
}

///////////////////////////////////////////////////////////////////////////////////////
// alienSetMatrices(avars)
///////////////////////////////////////////////////////////////////////////////////////

function alienSetMatrices(avars) {
    var deg2rad = Math.PI/180;

    var xPosition = avars[0];
    var yPosition = avars[1];
    var zPosition = avars[2];
    var theta1 = avars[3]*deg2rad;
    var theta2 = avars[4]*deg2rad;
    var theta3 = avars[5]*deg2rad;
    var theta4 = avars[6]*deg2rad;
    var theta5 = avars[7]*deg2rad;
    var theta6 = avars[8]*deg2rad;
    var theta7 = avars[9]*deg2rad;
    var theta8 = avars[10]*deg2rad;
    var theta9 = avars[11]*deg2rad;
    var theta10 = avars[12]*deg2rad;
    var theta11 = avars[13]*deg2rad;
    var theta12 = avars[14]*deg2rad;
    var theta13 = avars[15]*deg2rad;


    ////////////// linka1
    linkFramea1.matrix.identity(); 
    linkFramea1.matrix.multiply(new THREE.Matrix4().makeTranslation(xPosition,yPosition,zPosition));   
    linkFramea1.matrix.multiply(new THREE.Matrix4().makeRotationX(theta13)); 
      // Frame a1 has been established
    linka1.matrix.copy(linkFramea1.matrix);  
    linka1.matrix.multiply(new THREE.Matrix4().makeRotationX(theta1));

    ///////////// linka2
    linkFramea2.matrix.copy(linkFramea1.matrix);      // start with parent frame
    linkFramea2.matrix.multiply(new THREE.Matrix4().makeTranslation(0,-1.5,0));
    linkFramea2.matrix.multiply(new THREE.Matrix4().makeRotationZ(theta2));    
      // Frame a2 has been established
    linka2.matrix.copy(linkFramea2.matrix);

    ///////////// linka3
    linkFramea3.matrix.copy(linkFramea1.matrix);      // start with parent frame
    linkFramea3.matrix.multiply(new THREE.Matrix4().makeRotationX(theta1));
    linkFramea3.matrix.multiply(new THREE.Matrix4().makeRotationY(theta1));
    linkFramea3.matrix.multiply(new THREE.Matrix4().makeTranslation(0,0.9,2.5));
    linkFramea3.matrix.multiply(new THREE.Matrix4().makeRotationZ(theta3));    
      // Frame a3 has been established
    linka3.matrix.copy(linkFramea3.matrix);


    ///////////// linka4
    linkFramea4.matrix.copy(linkFramea2.matrix);      // start with parent frame
    linkFramea4.matrix.multiply(new THREE.Matrix4().makeTranslation(-3,1.7,0));
    linkFramea4.matrix.multiply(new THREE.Matrix4().makeRotationZ(theta4));    
      // Frame a2 has been established
    linka4.matrix.copy(linkFramea4.matrix);
    // linka2.matrix.multiply(new THREE.Matrix4().makeTranslation(2,0,0));   

    ///////////// linka5
    linkFramea5.matrix.copy(linkFramea2.matrix);      // start with parent frame
    linkFramea5.matrix.multiply(new THREE.Matrix4().makeTranslation(3,1.7,0));
    linkFramea5.matrix.multiply(new THREE.Matrix4().makeRotationZ(theta5));    
    // Frame a2 has been established
    linka5.matrix.copy(linkFramea5.matrix);
    // linka2.matrix.multiply(new THREE.Matrix4().makeTranslation(2,0,0));   


    ///////////// linka PALM
    linkFramea6.matrix.copy(linkFramea4.matrix);      // start with parent frame
    linkFramea6.matrix.multiply(new THREE.Matrix4().makeTranslation(0,2,0));
    linkFramea6.matrix.multiply(new THREE.Matrix4().makeRotationY(theta6));    
      // Frame a2 has been established
    linka6.matrix.copy(linkFramea6.matrix);
    // linka2.matrix.multiply(new THREE.Matrix4().makeTranslation(2,0,0));   

    ///////////// linka7 PALM
    linkFramea7.matrix.copy(linkFramea5.matrix);      // start with parent frame
    linkFramea7.matrix.multiply(new THREE.Matrix4().makeTranslation(0,2,0));
    linkFramea7.matrix.multiply(new THREE.Matrix4().makeRotationY(theta7));    
    // Frame a2 has been established
    linka7.matrix.copy(linkFramea7.matrix);
    // linka2.matrix.multiply(new THREE.Matrix4().makeTranslation(2,0,0));   
    // linka2.matrix.multiply(new THREE.Matrix4().makeScale(4,1,1));  

    ///////////// linka8 LEG
    linkFramea8.matrix.copy(linkFramea2.matrix);      // start with parent frame
    linkFramea8.matrix.multiply(new THREE.Matrix4().makeRotationX(theta8)); 
    linkFramea8.matrix.multiply(new THREE.Matrix4().makeTranslation(-1.8,-2,0));
      // Frame a2 has been established
    linka8.matrix.copy(linkFramea8.matrix);
    // linka2.matrix.multiply(new THREE.Matrix4().makeTranslation(2,0,0));   

    ///////////// linka9 LEG
    linkFramea9.matrix.copy(linkFramea2.matrix);      // start with parent frame
    linkFramea9.matrix.multiply(new THREE.Matrix4().makeRotationX(theta9)); 
    linkFramea9.matrix.multiply(new THREE.Matrix4().makeTranslation(1.8,-2,0));  
    // Frame a2 has been established
    linka9.matrix.copy(linkFramea9.matrix);
    // linka2.matrix.multiply(new THREE.Matrix4().makeTranslation(2,0,0)); 

    ///////////// linka10 Finger for 6
    linkFramea10.matrix.copy(linkFramea6.matrix);      // start with parent frame
    linkFramea10.matrix.multiply(new THREE.Matrix4().makeTranslation(-1,1.5,0));
    linkFramea10.matrix.multiply(new THREE.Matrix4().makeRotationZ(20*deg2rad));    
    // Frame a2 has been established
    linka10.matrix.copy(linkFramea10.matrix);
    // linka2.matrix.multiply(new THREE.Matrix4().makeTranslation(2,0,0));   

    ///////////// linka11 Finger for 6
    linkFramea11.matrix.copy(linkFramea6.matrix);      // start with parent frame
    linkFramea11.matrix.multiply(new THREE.Matrix4().makeTranslation(1,1.5,0));
    linkFramea11.matrix.multiply(new THREE.Matrix4().makeRotationZ(-20*deg2rad));    
    // Frame a2 has been established
    linka11.matrix.copy(linkFramea11.matrix);
    // linka2.matrix.multiply(new THREE.Matrix4().makeTranslation(2,0,0));   

    ///////////// linka12 Finger for 7
    linkFramea12.matrix.copy(linkFramea7.matrix);      // start with parent frame
    linkFramea12.matrix.multiply(new THREE.Matrix4().makeTranslation(-1,1.5,0));
    linkFramea12.matrix.multiply(new THREE.Matrix4().makeRotationZ(20*deg2rad));    
    // Frame a2 has been established
    linka12.matrix.copy(linkFramea12.matrix);
    // linka2.matrix.multiply(new THREE.Matrix4().makeTranslation(2,0,0));   

    ///////////// linka13 Finger for 7
    linkFramea13.matrix.copy(linkFramea7.matrix);      // start with parent frame
    linkFramea13.matrix.multiply(new THREE.Matrix4().makeTranslation(1,1.5,0));
    linkFramea13.matrix.multiply(new THREE.Matrix4().makeRotationZ(-20*deg2rad));    
    // Frame a2 has been established
    linka13.matrix.copy(linkFramea13.matrix);
    // linka2.matrix.multiply(new THREE.Matrix4().makeTranslation(2,0,0));   




    linka1.updateMatrixWorld();
    linka2.updateMatrixWorld();
    linka3.updateMatrixWorld();
    linka4.updateMatrixWorld();
    linka5.updateMatrixWorld();
    linka6.updateMatrixWorld();
    linka7.updateMatrixWorld();
    linka8.updateMatrixWorld();
    linka9.updateMatrixWorld();
    linka10.updateMatrixWorld();
    linka11.updateMatrixWorld();
    linka12.updateMatrixWorld();
    linka13.updateMatrixWorld();


    linkFramea1.updateMatrixWorld();
    linkFramea2.updateMatrixWorld();
    linkFramea3.updateMatrixWorld();
    linkFramea4.updateMatrixWorld();
    linkFramea5.updateMatrixWorld();
    linkFramea6.updateMatrixWorld();
    linkFramea7.updateMatrixWorld();
    linkFramea8.updateMatrixWorld();
    linkFramea9.updateMatrixWorld();
    linkFramea10.updateMatrixWorld();
    linkFramea11.updateMatrixWorld();
    linkFramea12.updateMatrixWorld();
    linkFramea13.updateMatrixWorld();

}

/////////////////////////////////////	
// initLights():  SETUP LIGHTS
/////////////////////////////////////	

function initLights() {
    light = new THREE.PointLight(0xffffff);
    light.position.set(0,4,2);
    scene.add(light);
    ambientLight = new THREE.AmbientLight(0x606060);
    scene.add(ambientLight);
}

/////////////////////////////////////	
// MATERIALS
/////////////////////////////////////	

var diffuseMaterial = new THREE.MeshLambertMaterial( {color: 0xffffff} );
var diffuseMaterial2 = new THREE.MeshLambertMaterial( {color: 0xffffff, side: THREE.DoubleSide } );
var basicMaterial = new THREE.MeshBasicMaterial( {color: 0xff0000} );
var armadilloMaterial = new THREE.MeshBasicMaterial( {color: 0x7fff7f} );

/////////////////////////////////////	
// initObjects():  setup objects in the scene
/////////////////////////////////////	

function initObjects() {
    worldFrame = new THREE.AxesHelper(5) ;
    scene.add(worldFrame);

    // mybox 
    myboxGeometry = new THREE.BoxGeometry( 1, 1, 1 );    // width, height, depth
    mybox = new THREE.Mesh( myboxGeometry, diffuseMaterial );
    scene.add( mybox );

    // textured floor
    floorTexture = new THREE.TextureLoader().load('images/floor.jpg');
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(1, 1);
    floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide });
    floorGeometry = new THREE.PlaneBufferGeometry(15, 15);
    floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -1.1;
    floor.rotation.x = Math.PI / 2;
    scene.add(floor);

    // sphere, located at light position
    sphereGeometry = new THREE.SphereGeometry(0.3, 32, 32);    // radius, segments, segments
    sphere = new THREE.Mesh(sphereGeometry, basicMaterial);
    sphere.position.set(0,4,2);
    sphere.position.set(light.position.x, light.position.y, light.position.z);
    scene.add(sphere);

    // box
    boxGeometry = new THREE.BoxGeometry( 1, 1, 1 );    // width, height, depth
    box = new THREE.Mesh( boxGeometry, diffuseMaterial );
    box.position.set(-4, 0, 0);
    scene.add( box );

    // multi-colored cube      [https://stemkoski.github.io/Three.js/HelloWorld.html] 
    var cubeMaterialArray = [];    // order to add materials: x+,x-,y+,y-,z+,z-
    cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0xff3333 } ) );
    cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0xff8800 } ) );
    cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0xffff33 } ) );
    cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0x33ff33 } ) );
    cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0x3333ff } ) );
    cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0x8833ff } ) );
      // Cube parameters: width (x), height (y), depth (z), 
      //        (optional) segments along x, segments along y, segments along z
    var mccGeometry = new THREE.BoxGeometry( 1.5, 1.5, 1.5, 1, 1, 1 );
    mcc = new THREE.Mesh( mccGeometry, cubeMaterialArray );
    mcc.position.set(-2,0,0);
    scene.add( mcc );	

    // cylinder
    // parameters:  radiusAtTop, radiusAtBottom, height, radialSegments, heightSegments
    cylinderGeometry = new THREE.CylinderGeometry( 0.30, 0.30, 0.80, 20, 4 );
    cylinder = new THREE.Mesh( cylinderGeometry, diffuseMaterial);
    cylinder.position.set(2, 0, 0);
    scene.add( cylinder );

    // cone:   parameters --  radiusTop, radiusBot, height, radialSegments, heightSegments
    coneGeometry = new THREE.CylinderGeometry( 0.0, 0.30, 0.80, 20, 4 );
    cone = new THREE.Mesh( coneGeometry, diffuseMaterial);
    cone.position.set(4, 0, 0);
    scene.add( cone);

    // torus:   parameters -- radius, diameter, radialSegments, torusSegments
    torusGeometry = new THREE.TorusGeometry( 1.2, 0.4, 10, 20 );
    torus = new THREE.Mesh( torusGeometry, diffuseMaterial);
    torus.position.set(6, 0, 0);   // translation
    torus.rotation.set(0,0,0);     // rotation about x,y,z axes
    scene.add( torus );

    // custom object
    var geom = new THREE.Geometry(); 
    var v0 = new THREE.Vector3(0,0,0);
    var v1 = new THREE.Vector3(3,0,0);
    var v2 = new THREE.Vector3(0,3,0);
    var v3 = new THREE.Vector3(3,3,0);
    geom.vertices.push(v0);
    geom.vertices.push(v1);
    geom.vertices.push(v2);
    geom.vertices.push(v3);
    geom.faces.push( new THREE.Face3( 0, 1, 2 ) );
    geom.faces.push( new THREE.Face3( 1, 3, 2 ) );
    geom.computeFaceNormals();
    customObject = new THREE.Mesh( geom, diffuseMaterial2 );
    customObject.position.set(0, 0, -2);
    scene.add(customObject);
}

/////////////////////////////////////////////////////////////////////////////////////
//  initHand():  define all geometry associated with the hand
/////////////////////////////////////////////////////////////////////////////////////

function initHand() {
    handMaterial = new THREE.MeshLambertMaterial( {color: 0xffffff} );
    boxGeometry = new THREE.BoxGeometry( 1, 1, 1 );    // width, height, depth

    link1 = new THREE.Mesh( boxGeometry, handMaterial );  scene.add( link1 );
    linkFrame1   = new THREE.AxesHelper(1) ;   scene.add(linkFrame1);
    link2 = new THREE.Mesh( boxGeometry, handMaterial );  scene.add( link2 );
    linkFrame2   = new THREE.AxesHelper(1) ;   scene.add(linkFrame2);
    link3 = new THREE.Mesh( boxGeometry, handMaterial );  scene.add( link3 );
    linkFrame3   = new THREE.AxesHelper(1) ;   scene.add(linkFrame3);
    link4 = new THREE.Mesh( boxGeometry, handMaterial );  scene.add( link4 );
    linkFrame4   = new THREE.AxesHelper(1) ;   scene.add(linkFrame4);
    link5 = new THREE.Mesh( boxGeometry, handMaterial );  scene.add( link5 );
    linkFrame5   = new THREE.AxesHelper(1) ;   scene.add(linkFrame5);

    link1.matrixAutoUpdate = false;  
    link2.matrixAutoUpdate = false;  
    link3.matrixAutoUpdate = false;  
    link4.matrixAutoUpdate = false;  
    link5.matrixAutoUpdate = false;
    linkFrame1.matrixAutoUpdate = false;  
    linkFrame2.matrixAutoUpdate = false;  
    linkFrame3.matrixAutoUpdate = false;  
    linkFrame4.matrixAutoUpdate = false;  
    linkFrame5.matrixAutoUpdate = false;
}

/////////////////////////////////////////////////////////////////////////////////////
//  initAlien():  define all geometry associated with the alien
//  1 - head
//  2 - body
//  3 - eye
//  4-6-10/11 - right arm
//  5-7-12/13 - left arm
//  8/9 - feet
/////////////////////////////////////////////////////////////////////////////////////

function initAlien() {
    alienFurTexture = new THREE.TextureLoader().load('images/armor.jpg');
    alienMaterial = new THREE.MeshPhongMaterial({
                    map: alienFurTexture,
    }); // from original model);
    eyeTexture = new THREE.TextureLoader().load('images/eye.png');
    eyeMaterial = new THREE.MeshPhongMaterial({
                    color: 0xff0000,
                    specular: 0xffff00,
                    lightMap:eyeTexture,
                    map: eyeTexture,
    });
    alienLimbTexture = new THREE.TextureLoader().load('images/steel.jpg');
    alienLimbMaterial = new THREE.MeshPhongMaterial({
                    map: alienLimbTexture,
    }); // from original model);
    alienHeadTexture = new THREE.TextureLoader().load('images/steel.jpg');
    alienHeadMaterial = new THREE.MeshPhongMaterial({
                    map: alienHeadTexture,
    }); // from original model);

    sphereGeometry = new THREE.SphereGeometry( 3, 32, 32, 0, Math.PI*2, 0, Math.PI/2 );    // radius, widthSegments, heightSegments, phiStart, phiLength,thetaStart,thetaLength
    linka1 = new THREE.Mesh( sphereGeometry, alienHeadMaterial );  
    scene.add( linka1 );
    linkFramea1   = new THREE.AxesHelper(1) ;   
    scene.add(linkFramea1);

    sphereGeometry = new THREE.SphereGeometry( 3.5, 32, 32, 0, 6.3, 0, Math.PI );    // radius, widthSegments, heightSegments, phiStart, phiLength,thetaStart,thetaLength
    linka2 = new THREE.Mesh( sphereGeometry, alienMaterial );  
    scene.add( linka2 );
    linkFramea2   = new THREE.AxesHelper(1) ;   
    scene.add(linkFramea2);

    eyeGeometry = new THREE.SphereGeometry( 1, 16, 16, 0, Math.PI*2, 0, Math.PI );    // radius, widthSegments, heightSegments, phiStart, phiLength,thetaStart,thetaLength
    linka3 = new THREE.Mesh( eyeGeometry, eyeMaterial );  
    scene.add( linka3 );
    linkFramea3   = new THREE.AxesHelper(1) ;   
    scene.add(linkFramea3);

    cylinderGeometry = new THREE.CylinderGeometry( 1, 0.7, 3, 32 );
    //CylinderGeometry(radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded, thetaStart, thetaLength)
    linka4 = new THREE.Mesh( cylinderGeometry, alienMaterial );  
    scene.add( linka4 );
    linkFramea4   = new THREE.AxesHelper(1) ;   
    scene.add(linkFramea4);


    linka5 = new THREE.Mesh( cylinderGeometry, alienMaterial );  
    scene.add( linka5 );
    linkFramea5   = new THREE.AxesHelper(1) ;   
    scene.add(linkFramea5);
    // link5 = new THREE.Mesh( boxGeometry, handMaterial );  scene.add( link5 );
    // linkFrame5   = new THREE.AxesHelper(1) ;   scene.add(linkFrame5);

    palmGeometry = new THREE.SphereGeometry( 1.6, 8, 16, 0, Math.PI*2, 0, Math.PI );    // radius, widthSegments, heightSegments, phiStart, phiLength,thetaStart,thetaLength
    linka6 = new THREE.Mesh( palmGeometry, alienLimbMaterial );
    scene.add( linka6);
    linkFramea6 = new THREE.AxesHelper(1);
    scene.add(linkFramea6);

    linka7 = new THREE.Mesh( palmGeometry, alienLimbMaterial );
    scene.add( linka7);
    linkFramea7 = new THREE.AxesHelper(1);
    scene.add(linkFramea7);

    legGeometry = new THREE.SphereGeometry( 2, 8, 16, 0, Math.PI*2, 0, Math.PI );    // radius, widthSegments, heightSegments, phiStart, phiLength,thetaStart,thetaLength
    linka8 = new THREE.Mesh( legGeometry, alienLimbMaterial );
    scene.add(linka8);
    linkFramea8 = new THREE.AxesHelper(1);
    scene.add(linkFramea8);

    linka9 = new THREE.Mesh( legGeometry, alienLimbMaterial );
    scene.add(linka9);
    linkFramea9 = new THREE.AxesHelper(1);
    scene.add(linkFramea9);

    fingerGeometry = new THREE.BoxGeometry( 1, 1.2, 1 );    // width, height, depth
    linka10 = new THREE.Mesh( fingerGeometry, alienMaterial);
    scene.add(linka10);
    linkFramea10 = new THREE.AxesHelper(1);
    scene.add(linkFramea10);

    linka11 = new THREE.Mesh( fingerGeometry, alienMaterial);
    scene.add(linka11);
    linkFramea11 = new THREE.AxesHelper(1);
    scene.add(linkFramea11);

    linka12 = new THREE.Mesh( fingerGeometry, alienMaterial);
    scene.add(linka12);
    linkFramea12 = new THREE.AxesHelper(1);
    scene.add(linkFramea12);

    linka13 = new THREE.Mesh( fingerGeometry, alienMaterial);
    scene.add(linka13);
    linkFramea13 = new THREE.AxesHelper(1);
    scene.add(linkFramea13);

    linka1.matrixAutoUpdate = false;  
    linka2.matrixAutoUpdate = false;  
    linka3.matrixAutoUpdate = false;  
    linka4.matrixAutoUpdate = false;  
    linka5.matrixAutoUpdate = false;
    linka6.matrixAutoUpdate = false;
    linka7.matrixAutoUpdate = false;
    linka8.matrixAutoUpdate = false;
    linka9.matrixAutoUpdate = false;
    linka10.matrixAutoUpdate = false;
    linka11.matrixAutoUpdate = false;
    linka12.matrixAutoUpdate = false;
    linka13.matrixAutoUpdate = false;

    linkFramea1.matrixAutoUpdate = false;  
    linkFramea2.matrixAutoUpdate = false;  
    linkFramea3.matrixAutoUpdate = false;  
    linkFramea4.matrixAutoUpdate = false;  
    linkFramea5.matrixAutoUpdate = false;
    linkFramea6.matrixAutoUpdate = false;  
    linkFramea7.matrixAutoUpdate = false;
    linkFramea8.matrixAutoUpdate = false;
    linkFramea9.matrixAutoUpdate = false;
    linkFramea10.matrixAutoUpdate = false;
    linkFramea11.matrixAutoUpdate = false;
    linkFramea12.matrixAutoUpdate = false;
    linkFramea13.matrixAutoUpdate = false;

}
/////////////////////////////////////////////////////////////////////////////////////
//  create customShader material
/////////////////////////////////////////////////////////////////////////////////////

var customShaderMaterial = new THREE.ShaderMaterial( {
//        uniforms: { textureSampler: {type: 't', value: floorTexture}},
	vertexShader: document.getElementById( 'customVertexShader' ).textContent,
	fragmentShader: document.getElementById( 'customFragmentShader' ).textContent
} );

var ctx = renderer.context;
ctx.getShaderInfoLog = function () { return '' };   // stops shader warnings, seen in some browsers



////////////////////////////////////////////////////////////////////////    
// initCustomObjects():   UFO obj from free copyright resource.
////////////////////////////////////////////////////////////////////////    
function initCustomObjects() {
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath('obj/Low_poly_ufo_OBJ/');
    var onError = function ( xhr ) {};
    var onProgress = function ( xhr ) {};
    mtlLoader.load('Low_poly_UFO.mtl', function(materials) {
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath('obj/Low_poly_ufo_OBJ/');
        objLoader.load('Low_poly_UFO.obj', function(object) {
            object.position.y = -25;
            object.position.z = -25;
            scene.add(object);
      }, onProgress, onError);
});
}
////////////////////////////////////////////////////////////////////////    
// initGalaxy():   
//                        Galaxy obj created
////////////////////////////////////////////////////////////////////////    
function initGalaxy() {
    var loader = new THREE.TextureLoader();
                loader.load( 'images/planet.png', function ( texture ) {
                    var geometry = new THREE.SphereBufferGeometry( 200, 20, 20 );
                    var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );
                    planetLink = new THREE.Mesh( geometry, material );
                    scene.add( planetLink );
                    planetLink.position.set(100, 0, -400);
                } );
}

////////////////////////////////////////////////////////////////////////    
// initAudio
////////////////////////////////////////////////////////////////////////
function initSounds(){
}
////////////////////////////////////////////////////////////////////////	
// initFileObjects():    read object data from OBJ files;  see onResourcesLoaded() for instances
////////////////////////////////////////////////////////////////////////	

function initFileObjects() {
        // list of OBJ files that we want to load, and their material
    models = {     
//	bunny:     {obj:"obj/bunny.obj", mtl: diffuseMaterial, mesh: null},
//	horse:     {obj:"obj/horse.obj", mtl: diffuseMaterial, mesh: null },
//	minicooper:{obj:"obj/minicooper.obj", mtl: diffuseMaterial, mesh: null },
//	trex:      { obj:"obj/trex.obj", mtl: normalShaderMaterial, mesh: null },
	teapot:    {obj:"obj/teapot.obj", mtl: customShaderMaterial, mesh: null	},
	armadillo: {obj:"obj/armadillo.obj", mtl: customShaderMaterial, mesh: null },
	dragon:    {obj:"obj/dragon.obj", mtl: customShaderMaterial, mesh: null }
    };

    var manager = new THREE.LoadingManager();
    manager.onLoad = function () {
	console.log("loaded all resources");
	RESOURCES_LOADED = true;
	onResourcesLoaded();
    }
    var onProgress = function ( xhr ) {
	if ( xhr.lengthComputable ) {
	    var percentComplete = xhr.loaded / xhr.total * 100;
	    console.log( Math.round(percentComplete, 2) + '% downloaded' );
	}
    };
    var onError = function ( xhr ) {
    };

    // Load models;  asynchronous in JS, so wrap code in a fn and pass it the index
    for( var _key in models ){
	console.log('Key:', _key);
	(function(key){
	    var objLoader = new THREE.OBJLoader( manager );
	    objLoader.load( models[key].obj, function ( object ) {
		object.traverse( function ( child ) {
		    if ( child instanceof THREE.Mesh ) {
			child.material = models[key].mtl;
			child.material.shading = THREE.SmoothShading;
		    }	} );
		models[key].mesh = object;
//		scene.add( object );
	    }, onProgress, onError );
	})(_key);
    }
}

/////////////////////////////////////////////////////////////////////////////////////
// onResourcesLoaded():  once all OBJ files are loaded, this gets called
//                       Object instancing is done here
/////////////////////////////////////////////////////////////////////////////////////

function onResourcesLoaded(){
	
 // Clone models into meshes;   [Michiel:  AFAIK this makes a "shallow" copy of the model,
 //                             i.e., creates references to the geometry, and not full copies ]
    meshes["armadillo1"] = models.armadillo.mesh.clone();
    meshes["armadillo2"] = models.armadillo.mesh.clone();
    meshes["dragon1"] = models.dragon.mesh.clone();
    meshes["dragon2"] = models.dragon.mesh.clone();
    meshes["teapot1"] = models.teapot.mesh.clone();
    
    // position the object instances and parent them to the scene, i.e., WCS
    
    meshes["armadillo1"].position.set(-6, 1.5, 2);
    meshes["armadillo1"].rotation.set(0,-Math.PI/2,0);
    meshes["armadillo1"].scale.set(1,1,1);
    scene.add(meshes["armadillo1"]);

    meshes["armadillo2"].position.set(-3, 1.5, 2);
    meshes["armadillo2"].rotation.set(0,-Math.PI/2,0);
    meshes["armadillo2"].scale.set(1,1,1);
    scene.add(meshes["armadillo2"]);

    meshes["dragon1"].position.set(-5, 0.2, 4);
    meshes["dragon1"].rotation.set(0, Math.PI, 0);
    meshes["dragon1"].scale.set(0.3,0.3,0.3);
    scene.add(meshes["dragon1"]);

    meshes["dragon2"].position.set(-5, 0.2, -2);
    meshes["dragon2"].rotation.set(0, Math.PI, 0);
    meshes["dragon2"].scale.set(0.3,0.3,0.3);
    scene.add(meshes["dragon2"]);

    meshes["teapot1"].position.set(3, 0, 3);
    meshes["teapot1"].scale.set(0.5, 0.5, 0.5);
    scene.add(meshes["teapot1"]);
}


///////////////////////////////////////////////////////////////////////////////////////
// LISTEN TO KEYBOARD
///////////////////////////////////////////////////////////////////////////////////////

var keyboard = new THREEx.KeyboardState();
function checkKeyboard() {
  if (keyboard.pressed("W")) 
    light.position.y += 0.1;
  else if (keyboard.pressed("S")) 
    light.position.y -= 0.1;
  else if (keyboard.pressed("A"))
    light.position.x -= 0.1;
  else if (keyboard.pressed("D"))
    light.position.x += 0.1;
  else if (keyboard.pressed(" "))
    animation = !animation;
  else if (keyboard.pressed("1"))
    alienMotion = alienMotion1;
  else if (keyboard.pressed("2"))
    alienMotion = alienMotion2;
}

///////////////////////////////////////////////////////////////////////////////////////
// UPDATE CALLBACK:    This is the main animation loop
///////////////////////////////////////////////////////////////////////////////////////

function update() {
    var dt=0.02;
    checkKeyboard();
    if (animation) {
	  // advance the motion of all the animated objects
	myboxMotion.timestep(dt);
	handMotion.timestep(dt);
    alienMotion.timestep(dt);
    }
    sphere.position.set(light.position.x, light.position.y, light.position.z);
    requestAnimationFrame(update);      // requests the next update call;  this creates a loop
    planetLink.rotateY(SPEED * 1);
    renderer.render(scene, camera);
}

init();
update();

