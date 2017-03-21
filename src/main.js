
const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'

class Config{
  constructor(octave, persistence, innerRadius, outterRadius, hueStart, hueStop, rangeMultiplier)
  {
    this.octave = octave;
    this.persistence = persistence;
    this.innerRadius = innerRadius;
    this.outterRadius = outterRadius;
    this.hueStart = hueStart;
    this.hueStop = hueStop;
    this.rangeMultiplier = rangeMultiplier;
  }
}

var config = new Config(4, 0.89, 0.5, 2.2, 0.05, 0.95, 4.1);

var icoMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time:{
        type: "float"
        , value: (Date.now()%10000000)/10000
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
    , vertexShader: require('./shaders/adam-vert.glsl')
    , fragmentShader: require('./shaders/adam-frag.glsl')
  });

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

  // set camera position
  camera.position.set(1, 1, 2);
  camera.lookAt(new THREE.Vector3(0,0,0));

  // edit params and listen to changes like this
  // more information here: https://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage
  gui.add(camera, 'fov', 0, 180).onChange(function(newVal) {
    camera.updateProjectionMatrix();
  });
  gui.add(config, 'octave').min(1).max(30).step(1).onChange(function(newVal) {
    icoMaterial.uniforms.octave.value = config.octave;
  });
  gui.add(config, 'persistence').min(0.00001).max(1.0).onChange(function(newVal) {
    icoMaterial.uniforms.persistence.value = config.persistence;
  }); 
  gui.add(config, 'innerRadius').min(0).max(5).onChange(function(newVal){
    icoMaterial.uniforms.innerRadius.value = config.innerRadius;
  });
  gui.add(config, 'outterRadius').min(0).max(10).onChange(function(newVal){
    icoMaterial.uniforms.outterRadius.value = config.outterRadius;
  });
  gui.add(config, 'hueStart').min(0).max(1).onChange(function(newVal){
    icoMaterial.uniforms.hueStart.value = config.hueStart;
  });
  gui.add(config, 'hueStop').min(0).max(1).onChange(function(newVal){
    icoMaterial.uniforms.hueStop.value = config.hueStop;
  });
  gui.add(config, 'rangeMultiplier').min(0).max(5).onChange(function(newVal){
    icoMaterial.uniforms.rangeMultiplier.value = config.rangeMultiplier;
  });
  // to prevent some kind of init bug
  icoMaterial.uniforms.innerRadius.value = config.innerRadius;
}

// called on frame updates
function onUpdate(framework) {
  icoMaterial.uniforms.time.value = (Date.now()%10000000)/10000;
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);