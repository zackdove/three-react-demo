import logo from './logo.svg';
import './App.css';
import * as THREE from "three";
import React, { Component } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

const cubeSize = 4;
const numBlobs = 6;

function getRndFloat(min, max){
  return (Math.random() * (max - min) ) + min;
}

class Blob extends THREE.Mesh {
  constructor() {
    const geometry = new THREE.SphereGeometry( 0.2, 32, 32 );
    const material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    super(geometry, material)
    // this.x = getRndFloat(-cubeSize/2, cubeSize/2);
    this.position.x = getRndFloat(-cubeSize/2, cubeSize/2);
    this.position.y = getRndFloat(-cubeSize/2, cubeSize/2);
    this.position.z = getRndFloat(-cubeSize/2, cubeSize/2);
    // this.y = getRndFloat(-cubeSize/2, cubeSize/2);
    // this.z = getRndFloat(-cubeSize/2, cubeSize/2);
    this.velocity = new THREE.Vector3().random().subScalar(0.5).multiplyScalar(0.05);
  }
  update() {
    this.position.add(this.velocity);
    if (Math.abs(this.position.x) > Math.abs(cubeSize/2)){
      this.velocity.x *= -1;
    }
    if (Math.abs(this.position.y) > Math.abs(cubeSize/2)){
      this.velocity.y *= -1;
    }
    if (Math.abs(this.position.z) > Math.abs(cubeSize/2)){
      this.velocity.z *= -1;
    }
  }
}

class App extends Component {
  componentDidMount(){
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    // document.body.appendChild( renderer.domElement );
    // use ref as a mount point of the Three.js scene instead of the document.body
    this.mount.appendChild( renderer.domElement );
    var geometry = new THREE.BoxGeometry( cubeSize, cubeSize, cubeSize );
    const wireframe = new THREE.WireframeGeometry( geometry );
    const line = new THREE.LineSegments( wireframe );
    line.material.depthTest = false;
    line.material.opacity = 0.25;
    line.material.transparent = true;

    scene.add( line );
    const blobs = [];
    for (let i = 0; i < numBlobs; i++){
      let blob = new Blob();
      scene.add(blob);
      blobs.push(blob);
      // blob.updatePos();
    }
    // var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    // var cube = new THREE.Mesh( geometry, material );
    // scene.add( cube );
    camera.position.z = 5;
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.25
    controls.enableZoom = false
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.5
    var animate = function () {
      requestAnimationFrame( animate );
      // wireframe.rotation.x += 0.0001;
      // wireframe.rotation.y += 0.001;
      for (const blob of blobs){
        // console.log(blob);
        blob.update();
      }
      controls.update()
      renderer.render( scene, camera );
    };
    animate();
  }
  render(){
    return (
      <div ref={ref => (this.mount = ref)} />
    );
  }
}

export default App;
