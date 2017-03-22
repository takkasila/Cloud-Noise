
const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'

class Config{
  constructor(speed, octave, persistence, innerRadius, outterRadius, hueStop, rangeMultiplier, topColor, btmColor, skyboxRadius)
  {
    this.speed = speed;
    this.octave = octave;
    this.persistence = persistence;
    this.innerRadius = innerRadius;
    this.outterRadius = outterRadius;
    this.hueStop = hueStop;
    this.rangeMultiplier = rangeMultiplier;
    this.topColor = topColor;
    this.btmColor = btmColor;
    this.skyboxRadius = skyboxRadius;

    this.topColorGUI = [this.topColor.x * 255, this.topColor.y * 255, this.topColor.z * 255];
    this.btmColorGUI = [this.btmColor.x * 255, this.btmColor.y * 255, this.btmColor.z * 255];
  }
}

var config = new Config(1.0, 4, 0.89, 0.5, 2.2, 0.95, 4.1, new THREE.Vector3(0.9686274, 0.737254902, 0.4313725), new THREE.Vector3(1, 0.6941176, 0.6078431), 1000);

var oldTime = (Date.now()%1000000)/10000;
var newTime;

var icoMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time:{
        type: "float"
        , value: oldTime
      }
      , speed:{
        type: "float"
        , vlaue: config.speed
      }
      , octave:{
        type: "int"
        , value: config.octave
      } 
      , persistence:{
        type: "float"
        , value: config.persistence
      }
      , innerRadius:{
        type: "float"
        , vlaue: config.innerRadius
      }
      , outterRadius:{
        type: "float"
        , value: config.outterRadius
      }
      , hueStart:{
        type: "float"
        , value: config.hueStart
      }
      , hueStop:{
        type: "float"
        , value: config.hueStop
      }
      , rangeMultiplier:{
        type: "float"
        , value: config.rangeMultiplier
      }
    }
    , vertexShader: require('./shaders/noise-vert.glsl')
    , fragmentShader: require('./shaders/noise-frag.glsl')
});

var skyboxMaterial = new THREE.ShaderMaterial({
  uniforms:{
    topColor:{
      type: "v3"
      , value: config.topColor
    }
    , btmColor:{
      type: "v3"
      , value: config.btmColor
    }
    , skyboxRadius:{
      type: "float"
      , value: config.skyboxRadius
    }
  }
  , vertexShader: require('./shaders/skybox-vert.glsl')
  , fragmentShader: require('./shaders/skybox-frag.glsl')
})

// called after the scene loads
function onLoad(framework) {
  var scene = framework.scene;
  var camera = framework.camera;
  var renderer = framework.renderer;
  var gui = framework.gui;
  var stats = framework.stats;
  
  var ico = new THREE.IcosahedronGeometry(1, 6);
  var icoMesh = new THREE.Mesh(ico, icoMaterial);
  scene.add(icoMesh);

  var skybok = new THREE.IcosahedronGeometry(config.skyboxRadius, 5);
  var skyboxMesh = new THREE.Mesh(skybok, skyboxMaterial);
  skyboxMesh.material.side = THREE.BackSide;
  scene.add(skyboxMesh);

  // set camera position
  camera.position.set(1, 1, 2);
  camera.lookAt(new THREE.Vector3(0,0,0));

  // edit params and listen to changes like this
  // more information here: https://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage
  gui.add(camera, 'fov', 0, 180).name('Camera FOV').onChange(function(newVal) {
    camera.updateProjectionMatrix();
  });
  gui.add(config, 'speed', 0, 8).name('Speed');
  gui.add(config, 'octave').name('Noise Octave').min(1).max(30).step(1).onChange(function(newVal) {
    icoMaterial.uniforms.octave.value = config.octave;
  });
  gui.add(config, 'persistence').name('Noise Persistence').min(0.00001).max(1.0).onChange(function(newVal) {
    icoMaterial.uniforms.persistence.value = config.persistence;
  }); 
  gui.add(config, 'innerRadius').name('Core Radius').min(0).max(5).onChange(function(newVal){
    icoMaterial.uniforms.innerRadius.value = config.innerRadius;
  });
  gui.add(config, 'outterRadius').name('Noise Radius').min(0).max(10).onChange(function(newVal){
    icoMaterial.uniforms.outterRadius.value = config.outterRadius;
  });
  gui.add(config, 'hueStop').name('HUE Distort').min(0).max(1).onChange(function(newVal){
    icoMaterial.uniforms.hueStop.value = config.hueStop;
  });
  gui.add(config, 'rangeMultiplier').name('HUE Range Scale').min(0).max(5).onChange(function(newVal){
    icoMaterial.uniforms.rangeMultiplier.value = config.rangeMultiplier;
  });
  gui.addColor(config, 'topColorGUI').name('North Pole').onChange(function(newVal){
    skyboxMaterial.uniforms.topColor.value = new THREE.Vector3(config.topColorGUI[0]/255, config.topColorGUI[1]/255, config.topColorGUI[2]/255);
  });
  gui.addColor(config, 'btmColorGUI').name('South Pole').onChange(function(newVal){
    skyboxMaterial.uniforms.btmColor.value = new THREE.Vector3(config.btmColorGUI[0]/255, config.btmColorGUI[1]/255, config.btmColorGUI[2]/255);
  })
  // to prevent some kind of init bug
  icoMaterial.uniforms.innerRadius.value = config.innerRadius;
  icoMaterial.uniforms.speed.value = config.speed;
}

// called on frame updates
function onUpdate(framework) {
  newTime = (Date.now()%1000000)/10000;
  icoMaterial.uniforms.time.value += (newTime - oldTime) * config.speed;
  oldTime = newTime;
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);