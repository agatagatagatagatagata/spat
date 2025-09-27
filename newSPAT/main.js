// Import helper functions to load models, audio, and videos
import {loadGLTF, loadAudio} from "./libs/loader.js";
const THREE = window.MINDAR.IMAGE.THREE; // Use THREE.js from the MindAR library

// Wait for the DOM content to fully load before running the script
document.addEventListener('DOMContentLoaded', () => {
  let mindarThree = null; // Variable to hold the AR session instance
  let isStarted = false;  // Flag to track if the AR session is running

  // Function to start the AR experience
  const start = async () => {
    if (isStarted) return; // If already started, do nothing
    isStarted = true;      // Mark the session as started

    // Initialize MindAR with the container and image target configuration
    mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,                // Use the whole page as the AR view
      imageTargetSrc: './assets/targets/targets.mind' // Define the image target file
    });
    const {renderer, scene, camera} = mindarThree;

    // Add ambient light to the scene to illuminate 3D models
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);
	
	
    // Load the raccoon 3D model
    const photograph = await loadGLTF('./assets/models/scroll_base/scene.glb');
    photograph.scene.scale.set(3, 3, 3);  // Scale the model
    photograph.scene.position.set(0, 0, 0);  // Set the model's position in the scene
	photograph.scene.rotation.set(0, -90, 0);
	
    // Load the mapmarker 3D model
    const mapmarker = await loadGLTF('./assets/models/scroll_base_map/scene.glb');
    mapmarker.scene.scale.set(3, 3, 3);
    mapmarker.scene.position.set(0, 0, 0);
	mapmarker.scene.rotation.set(0, -90, 0);

	// Load the a marker 3D model
    const amarker = await loadGLTF('./assets/models/scroll_base_a/scene.glb');
    amarker.scene.scale.set(3, 3, 3);
    amarker.scene.position.set(0, 0, 0);
	amarker.scene.rotation.set(0, -90, 0);
	
	// Load the b marker 3D model
	const bmarker = await loadGLTF('./assets/models/scroll_base_b/scene.glb');
    bmarker.scene.scale.set(3, 3, 3);
    bmarker.scene.position.set(0, 0, 0);
	bmarker.scene.rotation.set(0, -90, 0);

	//Backkground music
	var music = new Audio('./assets/sounds/musicband-background.mp3');
	music.volume = 0.2;
	music.play();
	music.loop=true;
	
    // Load and add audio to the raccoon target
	var audio = new Audio('./assets/sounds/sfx.mp3');	
	
    // Create anchors for each target in the AR experience
    const photographAnchor = mindarThree.addAnchor(0);
    photographAnchor.group.add(photograph.scene);

    // Play/pause audio when the raccoon target is found/lost
    photographAnchor.onTargetFound = () => {
      audio.play();
    };
    photographAnchor.onTargetLost = () => {
      audio.pause();
	  audio.currentTime=0;
    };

    // Setup mapmarker anchor with similar logic as the raccoon
    const mapmarkerAnchor = mindarThree.addAnchor(1);
    mapmarkerAnchor.group.add(mapmarker.scene);

    mapmarkerAnchor.onTargetFound = () => {
      audio.play();
    };
    mapmarkerAnchor.onTargetLost = () => {
      audio.pause();
	  audio.currentTime=0;
    };

	// marker a anchor
	const amarkerAnchor = mindarThree.addAnchor(2);
    amarkerAnchor.group.add(amarker.scene);
	
	amarkerAnchor.onTargetFound = () => {
      audio.play();
    };
    amarkerAnchor.onTargetLost = () => {
      audio.pause();
	  audio.currentTime=0;
    };
	
		// marker b anchor
	const bmarkerAnchor = mindarThree.addAnchor(3);
    bmarkerAnchor.group.add(bmarker.scene);

	bmarkerAnchor.onTargetFound = () => {
      audio.play();
    };
    bmarkerAnchor.onTargetLost = () => {
      audio.pause();
	  audio.currentTime=0;
    };

    // Start the AR experience and continuously render the scene
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });

    // Enable stop button, disable start button
    document.getElementById('startButton').disabled = true;
    document.getElementById('stopButton').disabled = false;
  };

  // Function to stop the AR experience
  const stop = () => {
    if (!isStarted) return; // Prevent stopping if not started
    isStarted = false;

    // Stop the AR experience and animation loop
    mindarThree.stop();
    mindarThree.renderer.setAnimationLoop(null);
    mindarThree = null; // Reset the AR instance

    // Enable start button, disable stop button
    document.getElementById('startButton').disabled = false;
    document.getElementById('stopButton').disabled = true;
  };

  // Add event listeners to the start and stop buttons
  document.getElementById('startButton').addEventListener('click', start);
  
  document.getElementById('stopButton').addEventListener('click', stop);
});
