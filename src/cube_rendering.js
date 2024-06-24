import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js'
import { OrbitControls } from 'https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js'

export default class CubeRenderer {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this.camera.position.x = 3.5;
        this.camera.position.y = 3;
        this.camera.position.z = 5;

        this.renderer = new THREE.WebGLRenderer({antialias : true});
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        this.scene.add(this.ambientLight);

        this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        this.directionalLight.position.set(2,2,5);
        this.scene.add(this.directionalLight);

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement);

        const tileGeometry = new THREE.PlaneGeometry(0.99,0.99);
        const faceGeometry = new THREE.PlaneGeometry(3.00, 3.00);
        const redMaterial = new THREE.MeshBasicMaterial({color: 0xe3320c, side: THREE.DoubleSide});
        const orangeMaterial = new THREE.MeshBasicMaterial({color: 0xFE8B00, side: THREE.DoubleSide});
        const yellowMaterial = new THREE.MeshBasicMaterial({color: 0xFEF600, side: THREE.DoubleSide});
        const whiteMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide});
        const greenMaterial = new THREE.MeshBasicMaterial({color: 0x68FE00, side: THREE.DoubleSide});
        const blueMaterial = new THREE.MeshBasicMaterial({color: 0x00A2FE, side: THREE.DoubleSide});
        const blackMaterial = new THREE.MeshBasicMaterial({color: 0x000000, side: THREE.DoubleSide});
        this.tileMaterials = [greenMaterial, blueMaterial, redMaterial, orangeMaterial, yellowMaterial, whiteMaterial];

        this.tiles = [];

        // Load tiles into the scene
        for (let i = 0; i < 9; i++) {
            const greenTile = new THREE.Mesh(tileGeometry, greenMaterial);
            this.scene.add(greenTile);
            greenTile.position.set(i % 3 - 1, 1 - Math.trunc(i / 3), 1.5);

            const blueTile = new THREE.Mesh(tileGeometry, blueMaterial);
            this.scene.add(blueTile);
            blueTile.position.set(i % 3 - 1, 1 - Math.trunc(i / 3), -1.5);

            const redTile = new THREE.Mesh(tileGeometry, redMaterial);
            this.scene.add(redTile);
            redTile.position.set(-1.5, 1 - Math.trunc(i / 3), i % 3 - 1);
            redTile.rotateOnAxis(new THREE.Vector3(0.0,1.0,0.0),Math.PI/2);

            const orangeTile = new THREE.Mesh(tileGeometry, orangeMaterial);
            this.scene.add(orangeTile);
            orangeTile.position.set(1.5, 1 - Math.trunc(i / 3), i % 3 - 1);
            orangeTile.rotateOnAxis(new THREE.Vector3(0.0,1.0,0.0),Math.PI/2);

            const yellowTile = new THREE.Mesh(tileGeometry, yellowMaterial);
            this.scene.add(yellowTile);
            yellowTile.position.set(i % 3 - 1, 1.5, 1 - Math.trunc(i / 3));
            yellowTile.rotateOnAxis(new THREE.Vector3(1.0,0.0,0.0),Math.PI/2);

            const whiteTile = new THREE.Mesh(tileGeometry, whiteMaterial);
            this.scene.add(whiteTile);
            whiteTile.position.set(i % 3 - 1, -1.5, 1 - Math.trunc(i / 3));
            whiteTile.rotateOnAxis(new THREE.Vector3(1.0,0.0,0.0),Math.PI/2);

            this.tiles.push(greenTile, blueTile, redTile, orangeTile, yellowTile, whiteTile);
        }

        this.moveAnimations = [];
        this.animationCompletion = 0.0;
        this.turnStep = 0.04;

        this.animate();
    }

    rotateTileAboutWorldAxis(tile, axis, angle)
    {
        var rotationMatrix = new THREE.Matrix4();
        rotationMatrix.makeRotationAxis(axis.normalize(), angle);
        var currentPos = new THREE.Vector4(tile.position.x, tile.position.y, tile.position.z, 1);
        var newPos = currentPos.applyMatrix4(rotationMatrix);
        tile.position.x = newPos.x;
        tile.position.y = newPos.y;
        tile.position.z = newPos.z;

        tile.rotateOnWorldAxis(axis, angle);
    }

    correctError() {
        for (let i = 0; i < this.tiles.length; i++) {
            const tile = this.tiles[i];
            tile.position.set(Math.round(tile.position.x * 2)/2, Math.round(tile.position.y * 2)/2, Math.round(tile.position.z * 2)/2);

            const axes = [new THREE.Vector3(1.0,0.0,0.0),new THREE.Vector3(0.0,1.0,0.0),new THREE.Vector3(0.0,0.0,1.0),new THREE.Vector3(-1.0,0.0,0.0),new THREE.Vector3(0.0,-1.0,0.0),new THREE.Vector3(0.0,0.0,-1.0)];

            var tileNormal = new THREE.Vector3( 0, 0, -1 ).applyQuaternion( tile.quaternion );
            const correctedNormal = new THREE.Vector3(Math.round(tileNormal.x), Math.round(tileNormal.y), Math.round(tileNormal.z));
            
            tile.lookAt(correctedNormal.add(tile.position));
        }
    }

    turnCube(move, amount) {
        var rotationAxis = new THREE.Vector3(0.0,0.0,0.0);
        var rotationAngle = -amount * Math.PI/2;

        switch (move) {
            case "F": {rotationAxis.z = 1.0; break;}
            case "F-": {rotationAxis.z = 1.0; rotationAngle *= -1; break;}
            case "B": {rotationAxis.z = -1.0; break;}
            case "B-": {rotationAxis.z = -1.0; rotationAngle *= -1;break;}
            case "L": {rotationAxis.x = -1.0; break;}
            case "L-": {rotationAxis.x = -1.0; rotationAngle *= -1; break;}
            case "R": {rotationAxis.x = 1.0; break;}
            case "R-": {rotationAxis.x = 1.0; rotationAngle *= -1; break;}
            case "U": {rotationAxis.y = 1.0; break;}
            case "U-": {rotationAxis.y = 1.0; rotationAngle *= -1; break;}
            case "D": {rotationAxis.y = -1.0; break;}
            case "D-": {rotationAxis.y = -1.0; rotationAngle *= -1; break;}
        }

        for (let i = 0; i < this.tiles.length; i++) {
            const tile = this.tiles[i];
            if (rotationAxis.dot(tile.position) > 0.5) {
                this.rotateTileAboutWorldAxis(tile, rotationAxis, rotationAngle);
            }
        }
    }

    executeMove(move)
    {
        this.moveAnimations.push(move);
    }

    executeMoves(moveset)
    {
        for (let i = 0; i < moveset.length; i++) {
            this.moveAnimations.push(moveset[i]);
        }
    }

    playMoveAnimations() {
        if (this.moveAnimations.length == 0) { return; }
        const currentAnimation = this.moveAnimations[0];

        this.turnCube(currentAnimation, this.turnStep);

        this.animationCompletion += this.turnStep;
        if (this.animationCompletion >= 1.0)
        {
            this.animationCompletion = 0.0;
            this.moveAnimations.shift();
            this.correctError();
        }
    }

    animate() {
        this.renderer.render(this.scene,this.camera);
        requestAnimationFrame(this.animate.bind(this));

        this.playMoveAnimations();
    }
}


/*
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

const turnStep = 0.04;

function rotateTileAboutWorldAxis(tile, axis, angle)
{
	var rotationMatrix = new THREE.Matrix4();
	rotationMatrix.makeRotationAxis(axis.normalize(), angle);
	var currentPos = new THREE.Vector4(tile.position.x, tile.position.y, tile.position.z, 1);
	var newPos = currentPos.applyMatrix4(rotationMatrix);
	tile.position.x = newPos.x;
	tile.position.y = newPos.y;
	tile.position.z = newPos.z;

	tile.rotateOnWorldAxis(axis, angle);
}

function correctError() {
	for (let i = 0; i < tiles.length; i++) {
		const tile = tiles[i];
		tile.position.set(Math.round(tile.position.x * 2)/2, Math.round(tile.position.y * 2)/2, Math.round(tile.position.z * 2)/2);

		const axes = [new THREE.Vector3(1.0,0.0,0.0),new THREE.Vector3(0.0,1.0,0.0),new THREE.Vector3(0.0,0.0,1.0),new THREE.Vector3(-1.0,0.0,0.0),new THREE.Vector3(0.0,-1.0,0.0),new THREE.Vector3(0.0,0.0,-1.0)];

		var tileNormal = new THREE.Vector3( 0, 0, -1 ).applyQuaternion( tile.quaternion );
		const correctedNormal = new THREE.Vector3(Math.round(tileNormal.x), Math.round(tileNormal.y), Math.round(tileNormal.z));
		
		tile.lookAt(correctedNormal.add(tile.position));
	}
}

function turnCube(move, amount) {
	var rotationAxis = new THREE.Vector3(0.0,0.0,0.0);
	var rotationAngle = -amount * Math.PI/2;

	switch (move) {
		case "F": {rotationAxis.z = 1.0; break;}
		case "F-": {rotationAxis.z = 1.0; rotationAngle *= -1; break;}
		case "B": {rotationAxis.z = -1.0; break;}
		case "B-": {rotationAxis.z = -1.0; rotationAngle *= -1;break;}
		case "L": {rotationAxis.x = -1.0; break;}
		case "L-": {rotationAxis.x = -1.0; rotationAngle *= -1; break;}
		case "R": {rotationAxis.x = 1.0; break;}
		case "R-": {rotationAxis.x = 1.0; rotationAngle *= -1; break;}
		case "U": {rotationAxis.y = 1.0; break;}
		case "U-": {rotationAxis.y = 1.0; rotationAngle *= -1; break;}
		case "D": {rotationAxis.y = -1.0; break;}
		case "D-": {rotationAxis.y = -1.0; rotationAngle *= -1; break;}
	}

	for (let i = 0; i < tiles.length; i++) {
		const tile = tiles[i];
		if (rotationAxis.dot(tile.position) > 0.5) {
			rotateTileAboutWorldAxis(tile, rotationAxis, rotationAngle);
		}
	}
}

function executeMove(move)
{
	moveAnimations.push(move);
}

function executeMoves(moveset)
{
	for (let i = 0; i < moveset.length; i++) {
		moveAnimations.push(moveset[i]);
	}
}

const moveAnimations = [];
let animationCompletion = 0.0;

function playMoveAnimations() {
	if (moveAnimations.length == 0) { return; }
	const currentAnimation = moveAnimations[0];

	turnCube(currentAnimation, turnStep);

	animationCompletion += turnStep;
	if (animationCompletion >= 1.0)
	{
		animationCompletion = 0.0;
		moveAnimations.shift();
		correctError();
	}
}

function animate() {
	renderer.render(scene, camera);

	playMoveAnimations();
}

moveAnimations.push("R","U","R-","U-","F","F-","B","B-","L","L-","R","R-","U","U-","D","D-");
renderer.setAnimationLoop(animate);
*/