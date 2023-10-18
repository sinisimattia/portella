// IMPORTS
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
// import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';

class SpinningTowerScene {
	elements = {
		target: null,
		wrapper: null,
	}

	config = {
		dimensions: {
			height: 700,
			width: 700,
		},
	}

	content = {
		scene: null,
		light: null,
		camera: null,
		controls: null,
		models: {
			tower: null,
		},
	}

	tools = {
		modelLoader: null,
		renderer: null,
	}

	constructor() {
		this.elements.target = document.getElementById('scene3d')
		this.elements.wrapper = document.getElementById('sceneWrapper')

		this.config.dimensions = { height: 700, width: 500 }

		this.content.scene = new THREE.Scene()
		this.content.camera = new THREE.PerspectiveCamera( 80, this.config.dimensions.width / this.config.dimensions.height, 0.1, 1000 )

		this.content.camera.position.set(0, 1, 3)
		this.content.camera.rotation.set(0.6, 0, 0)

		this.content.light = new THREE.AmbientLight()
		this.content.scene.add(this.content.light)

		this.tools.renderer = new THREE.WebGLRenderer({alpha: true, canvas: this.elements.target})
		// this.tools.renderer.physicallyCorrectLights = true
		this.tools.renderer.outputEncoding = THREE.sRGBEncoding
		this.tools.renderer.setSize(this.config.dimensions.width, this.config.dimensions.height)

		this.tools.modelLoader = new GLTFLoader()

		this.loadModels()
		this.setUp()
	}

	setUp() {
		this.elements.wrapper.style.height = this.config.dimensions.height + 'px'
		this.elements.wrapper.style.width = this.config.dimensions.width + 'px'
		this.elements.target.height = this.config.dimensions.height
		this.elements.target.width = this.config.dimensions.width
	}

	loadModels() {
		this.tools.modelLoader.load( 'tower.glb', (gltf) => {
			this.content.models.tower = gltf.scene
			var newMaterial = new THREE.MeshStandardMaterial({
				color: 'yellow',
				wireframe: true,
			});
		
			this.content.models.tower.traverse((o) => {
				if (o.isMesh) o.material = newMaterial;
			  });
			this.content.scene.add(this.content.models.tower)

			this.content.models.tower.position.y = 4.5
			this.content.models.tower.rotation.y = 3
		})
	}

	render() {
		this.tools.renderer.render(this.content.scene, this.content.camera)
	}

	animate() {
		requestAnimationFrame(() => this.animate())
		// controls.update()
		this.content.models.tower.rotation.y += 0.004
		
		if (this.content.models.tower.position.y >= 0) {
			this.content.models.tower.position.y -= 0.004
		}
		this.render()
	}

	listeners = {
		onResize: () => {
			this.elements.target.height = this.config.dimensions.height
			this.elements.target.width = this.config.dimensions.width
			this.content.camera.aspect = this.elements.target.width / this.elements.target.height
			this.content.camera.updateProjectionMatrix()
			this.tools.renderer.setSize(this.elements.target.width, this.elements.target.height)
			this.render()
		},
	}
}

// USER INTERACTION
// const controls = new OrbitControls(camera, renderer.domElement)
// controls.enableDamping = true
// controls.target.set(0, 3, 5)

// RESIZEABLE

const scene = new SpinningTowerScene

scene.animate()
window.addEventListener('resize', scene.listeners.onResize, false)