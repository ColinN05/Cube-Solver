import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js'
import { OrbitControls } from 'https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js'

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({antialias : true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(2,2,5);
scene.add(directionalLight);

const orbit = new OrbitControls(camera, renderer.domElement);

const tileGeometry = new THREE.PlaneGeometry(0.99,0.99);
const faceGeometry = new THREE.PlaneGeometry(3.00, 3.00);
const redMaterial = new THREE.MeshBasicMaterial({color: 0xe3320c, side: THREE.DoubleSide});
const orangeMaterial = new THREE.MeshBasicMaterial({color: 0xFE8B00, side: THREE.DoubleSide});
const yellowMaterial = new THREE.MeshBasicMaterial({color: 0xFEF600, side: THREE.DoubleSide});
const whiteMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide});
const greenMaterial = new THREE.MeshBasicMaterial({color: 0x68FE00, side: THREE.DoubleSide});
const blueMaterial = new THREE.MeshBasicMaterial({color: 0x00A2FE, side: THREE.DoubleSide});
const blackMaterial = new THREE.MeshBasicMaterial({color: 0x000000, side: THREE.DoubleSide});

const tileMaterials = [greenMaterial, blueMaterial, redMaterial, orangeMaterial, yellowMaterial, whiteMaterial];

const tiles = [];

// Load tiles into the scene
for (let i = 0; i < 9; i++) {
	const greenTile = new THREE.Mesh( tileGeometry, greenMaterial );
	scene.add(greenTile);
	greenTile.position.set(i % 3 - 1, 1 - Math.trunc(i / 3), 1.5);

	const blueTile = new THREE.Mesh( tileGeometry, blueMaterial );
	scene.add(blueTile);
	blueTile.position.set(i % 3 - 1, 1 - Math.trunc(i / 3), -1.5);

	const redTile = new THREE.Mesh(tileGeometry, redMaterial);
	scene.add(redTile);
	redTile.position.set(-1.5, 1 - Math.trunc(i / 3), i % 3 - 1);
	redTile.rotateOnAxis(new THREE.Vector3(0.0,1.0,0.0),Math.PI/2);

	const orangeTile = new THREE.Mesh(tileGeometry, orangeMaterial);
	scene.add(orangeTile);
	orangeTile.position.set(1.5, 1 - Math.trunc(i / 3), i % 3 - 1);
	orangeTile.rotateOnAxis(new THREE.Vector3(0.0,1.0,0.0),Math.PI/2);

	const yellowTile = new THREE.Mesh(tileGeometry, yellowMaterial);
	scene.add(yellowTile);
	yellowTile.position.set(i % 3 - 1, 1.5, 1 - Math.trunc(i / 3));
	yellowTile.rotateOnAxis(new THREE.Vector3(1.0,0.0,0.0),Math.PI/2);

	const whiteTile = new THREE.Mesh(tileGeometry, whiteMaterial);
	scene.add(whiteTile);
	whiteTile.position.set(i % 3 - 1, -1.5, 1 - Math.trunc(i / 3));
	whiteTile.rotateOnAxis(new THREE.Vector3(1.0,0.0,0.0),Math.PI/2);

	tiles.push(greenTile, blueTile, redTile, orangeTile, yellowTile, whiteTile);
}

/*
const face1 = new THREE.Mesh(faceGeometry, blackMaterial);
scene.add(face1);
face1.position.set(0.0,0.0,1.49);

const face2 = new THREE.Mesh(faceGeometry, blackMaterial);
scene.add(face2);
face2.position.set(0.0,0.0,-1.49);

const face3 = new THREE.Mesh(faceGeometry, blackMaterial);
scene.add(face3);
face3.position.set(-1.49,0.0,0.0);
face3.rotateOnAxis(new THREE.Vector3(0.0,1.0,0.0),Math.PI/2);

const face4 = new THREE.Mesh(faceGeometry, blackMaterial);
scene.add(face4);
face4.position.set(1.49,0.0,0.0);
face4.rotateOnAxis(new THREE.Vector3(0.0,1.0,0.0),Math.PI/2);

const face5 = new THREE.Mesh(faceGeometry, blackMaterial);
scene.add(face5);
face5.position.set(0.0,1.49,0.0);
face5.rotateOnAxis(new THREE.Vector3(1.0,0.0,0.0),Math.PI/2);

const face6 = new THREE.Mesh(faceGeometry, blackMaterial);
scene.add(face6);
face6.position.set(0.0,-1.49,0.0);
face6.rotateOnAxis(new THREE.Vector3(1.0,0.0,0.0),Math.PI/2);
*/


const rotationStep = 0.08;

function moveF(deltaf) {
	for (let i = 0; i < tiles.length; i++) {
		const tile = tiles[i];
		if (tile.position.z > 0.5) {
			const x0 = tile.position.x;
			const y0 = tile.position.y;
			const z0 = tile.position.z;

			const df = deltaf;
			const PI = Math.PI;
			const t = df * PI/2;
			tile.position.set(x0 * Math.cos(t) + y0 * Math.sin(t), -x0 * Math.sin(t) + y0 * Math.cos(t),z0);

			tile.rotateOnWorldAxis(new THREE.Vector3(0.0,0.0,1.0), -df * PI/2);
		}
	}
}

function moveB(deltaf) {
	for (let i = 0; i < tiles.length; i++) {
		const tile = tiles[i];
		if (tile.position.z < -0.5) {
			const x0 = tile.position.x;
			const y0 = tile.position.y;
			const z0 = tile.position.z;

			const df = deltaf;
			const PI = Math.PI;
			const t = df * PI/2;
			tile.position.set(x0 * Math.cos(t) - y0 * Math.sin(t), x0 * Math.sin(t) + y0 * Math.cos(t),z0);

			tile.rotateOnWorldAxis(new THREE.Vector3(0.0,0.0,1.0), df * PI/2);
		}
	}
}

function moveL(deltaf) {
	for (let i = 0; i < tiles.length; i++) {
		const tile = tiles[i];
		if (tile.position.x < -0.5) {
			const x0 = tile.position.x;
			const y0 = tile.position.y;
			const z0 = tile.position.z;

			const df = deltaf;
			const PI = Math.PI;
			tile.position.set(x0, y0 * Math.cos(df * PI/2) - z0 * Math.sin(df * PI/2), y0 * Math.sin(df * PI/2) + z0 * Math.cos(df * PI/2));

			tile.rotateOnWorldAxis(new THREE.Vector3(1.0,0.0,0.0), df * PI/2);
		}
	}
}

function moveR(deltaf) {
	for (let i = 0; i < tiles.length; i++) {
		const tile = tiles[i];
		if (tile.position.x > 0.5) {
			const x0 = tile.position.x;
			const y0 = tile.position.y;
			const z0 = tile.position.z;

			const df = deltaf;
			const PI = Math.PI;
			tile.position.set(x0, y0 * Math.cos(df * PI/2) + z0 * Math.sin(df * PI/2), -y0 * Math.sin(df * PI/2) + z0 * Math.cos(df * PI/2));

			tile.rotateOnWorldAxis(new THREE.Vector3(1.0,0.0,0.0), -df * PI/2);
		}
	}
}

function moveU(deltaf) {
	for (let i = 0; i < tiles.length; i++) {
		const tile = tiles[i];
		if (tile.position.y > 0.5) {
			const x0 = tile.position.x;
			const y0 = tile.position.y;
			const z0 = tile.position.z; 

			const df = deltaf;
			const PI = Math.PI;
			const t = df * PI/2;
			tile.position.set(x0 * Math.cos(t) - z0 * Math.sin(t), y0, x0 * Math.sin(t) + z0 * Math.cos(t));

			tile.rotateOnWorldAxis(new THREE.Vector3(0.0,1.0,0.0), -df * PI/2);
		}
	}
}

function moveD(deltaf) {
	for (let i = 0; i < tiles.length; i++) {
		const tile = tiles[i];
		if (tile.position.y < -0.5) {
			const x0 = tile.position.x;
			const y0 = tile.position.y;
			const z0 = tile.position.z; 

			const df = deltaf;
			const PI = Math.PI;
			const t = df * PI/2;
			tile.position.set(x0 * Math.cos(t) + z0 * Math.sin(t), y0, -x0 * Math.sin(t) + z0 * Math.cos(t));

			tile.rotateOnWorldAxis(new THREE.Vector3(0.0,1.0,0.0), df * PI/2);
		}
	}
}

function correctError() {
	for (let i = 0; i < tiles.length; i++) {
		const tile = tiles[i];
		const pos = tile.position;
		tile.position.set(Math.round(pos.x * 2)/2, Math.round(pos.y * 2)/2, Math.round(pos.z * 2)/2);

		const axes = [new THREE.Vector3(1.0,0.0,0.0),new THREE.Vector3(0.0,1.0,0.0),new THREE.Vector3(0.0,0.0,1.0),new THREE.Vector3(-1.0,0.0,0.0),new THREE.Vector3(0.0,-1.0,0.0),new THREE.Vector3(0.0,0.0,-1.0)];

		var closestAxis = axes[0];

		for (let j = 0; j < axes.length; j++) {
			const axis = axes[j];

			var tileNormal = new THREE.Vector3( 0, 0, -1 ).applyQuaternion( tile.quaternion );

			if (tileNormal.dot(axis) > 0.9) {
				closestAxis = axis;
			}
		}
		
		tile.lookAt(closestAxis.add(pos));
	}
}

function executeMove(move)
{
	animations.push(move);
}

function executeMoves(moveset)
{
	for (let i = 0; i < moveset.length; i++) {
		animations.push(moveset[i]);
	}
}

const animations = [];
let animationf = 0.0;

function playAnimations() {
	if (animations.length == 0) { return; }
	const currentAnimation = animations[0];
	switch (currentAnimation) {
		case 'F':
			moveF(Math.min(1.0 - animationf, rotationStep));
			break;
		case 'B':
			moveB(Math.min(1.0 - animationf, rotationStep));
			break;
		case 'L':
			moveL(Math.min(1.0 - animationf, rotationStep));
			break;
		case 'R':
			moveR(Math.min(1.0 - animationf, rotationStep));
			break;
		case 'U':
			moveU(Math.min(1.0 - animationf, rotationStep));
			break;
		case 'D':
			moveD(Math.min(1.0 - animationf, rotationStep)); 
			break;
		case 'F-':
			moveF(Math.max(-animationf, -rotationStep));
			break;
		case 'B-':
			moveB(Math.max(-animationf, -rotationStep));
			break;
		case 'L-':
			moveL(Math.max(-animationf, -rotationStep));
			break;
		case 'R-':
			moveR(Math.max(-animationf, -rotationStep));
			break;
		case 'U-':
			moveU(Math.max(-animationf, -rotationStep));
			break;
		case 'D-':
			moveD(Math.max(-animationf, -rotationStep));
			break;
	}

	animationf += rotationStep;
	if (animationf >= 1.0)
	{
		animationf = 0.0;
		animations.shift();
		correctError();
	}

	if (animationf < 0.0)
		{
			animationf = 0.0;
			animations.shift();
			correctError();
		}
}

function animate() {
	renderer.render(scene, camera);

	if (animations.length == 0) {
		const moveChoices = ["F", "F-", "B", "B-", "L", "L-", "R", "R-", "U", "U-"]
		animations.push(moveChoices[Math.floor(Math.random()*moveChoices.length)]);
	}

	playAnimations();
}
renderer.setAnimationLoop( animate );