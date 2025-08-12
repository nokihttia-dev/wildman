// Import โมดูลที่จำเป็นจากไลบรารี Three.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ดึงอิลิเมนต์ canvas จากไฟล์ HTML
const canvas = document.querySelector('#webgl');

// สร้าง Renderer สำหรับ WebGL และตั้งค่าบางอย่าง
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
//เปิดการใช้งานเงา
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;


// สร้างฉาก 3D
const scene = new THREE.Scene()

// โหลดภาพพื้นหลัง skybox
const skyboxTextureLoader = new THREE.CubeTextureLoader();
const skyboxTextures = [
    'desertdawn_lf.jpg',  // right
    'desertdawn_rt.jpg',  // left
    'desertdawn_up.jpg',  // up (top)
    'desertdawn_dn.jpg',  // dn (bottom)
    'desertdawn_ft.jpg',  // ft (front)
    'desertdawn_bk.jpg'   // bk (back)
];
const skyboxTexture = skyboxTextureLoader.load(skyboxTextures);
scene.background = skyboxTexture;

// สร้างกล้องที่มีเลนส์มุมกว้างและตั้งตำแหน่ง
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(-30, 5, 0);
camera.near = 0.1;
camera.far = 100;

// ปรับค่ากล้องเมื่อหน้าต่างเปลี่ยนขนาด
window.addEventListener('resize', () => {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(newWidth, newHeight);
});

const textureLoader = new THREE.TextureLoader();

// โหลดโมเดล 3D และกำหนดวัสดุให้กับ mesh ของมัน
const loader = new GLTFLoader();
loader.load('test4.glb', function (gltf) {
    const model = gltf.scene;
    model.castShadow = true;

    
    scene.add(model);
});

// โหลดโมเดล 3D อีกอัน และปรับตำแหน่งและขนาด พร้อมกับการกำหนดวัสดุ
loader.load('camp.glb', function (gltf) {
    const model = gltf.scene;
    model.castShadow = true;
    model.position.x = -7;
    model.position.y = 0.5;
    model.position.z = 7;
        // ตั้งค่าขนาดของโมเดลเพื่อทำให้มีขนาดเล็กลง
        const scaleFactor = 0.5; // ลองปรับตามต้องการ
        model.scale.set(scaleFactor, scaleFactor, scaleFactor);

        model.traverse((child) => {
            if (child.isMesh) {
                // สร้าง texture map สำหรับ diffuse และ specular
                const diffuseMap = textureLoader.load("WoodenSurface_basecolor.jpg");
                const specularMap = textureLoader.load("WoodenSurface_normal.jpg"); // Load your displacement map
    
                // ตั้งค่า material ให้เป็น MeshPhongMaterial และกำหนด texture map
                const material = new THREE.MeshPhongMaterial({
                    color: 0xffffff,
                    specular: 0x111111,
                    shininess:30,
                    map: diffuseMap, // กำหนด texture map สำหรับ diffuse
                    specularMap: specularMap, // กำหนด texture map สำหรับ specular
                });
    
                child.material = material;
            }
        });

        
    scene.add(model);
});


// คนจนมีสิทธ์ไหมคะะ อนิเมชั่นคนป่า
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.target.set(0, 1, 0)
     //load our animation effect
     const assetLoader = new GLTFLoader();
  let mixer;
  let action;
  assetLoader.load('Wildmanhit4.glb', function(gltf){
    const model = gltf.scene;
    scene.add(model);
        model.position.x = -10;
       model.position.y = 0.5;
       model.position.z = 1;
       model.rotation.set(0, -1, 0);

    mixer = new THREE.AnimationMixer(model);
    const clips = gltf.animations;

    clips.forEach(function(clip){
       action = mixer.clipAction(clip);
      
    });
    
  }, undefined, function(error){
    console.error(error);
  });

  const clock = new THREE.Clock();


// ไฟของกองไฟ
const campLight = new THREE.PointLight( 0xff0000, 1000,  10, 10 );
campLight.position.set( -7,0.5,7 );
campLight.lookAt( -7,5,7 );
campLight.castShadow = true;

const campLight2 = new THREE.SpotLight( 0xffff00, 1000,  15, 15 );
campLight2.position.set( -7,10,7 );
campLight2.lookAt( -7,1,7 );
campLight2.castShadow = true;

const campLight3 = new THREE.SpotLight( 0xff0000, 500,  15, 15 );
campLight3.position.set( -7,5,7 );
campLight3.lookAt( -7,1,7 );
campLight3.castShadow = true;

    //แสงแดด
    const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.2);
    directionalLight.position.set(0, 10, 20);
    directionalLight.lookAt( 0,0,-20 );
    directionalLight.castShadow = true;
    scene.add(directionalLight);


    // อันนี้เกี่ยวกับเงา ไม่รู้ใช้งานได้ไหม ถถถถ
    campLight.shadow.bias = -0.001; // ปรับค่า bias ตามความต้องการ
campLight2.shadow.bias = -0.001;
campLight2.shadow.mapSize.width = 1024; // ปรับขนาดแผนที่เงาตามความต้องการ
campLight2.shadow.mapSize.height = 1024;
const gui = new dat.GUI();

// Object to hold parameters
const lightParams = {
    addDirectionalLight: addDirectionalLight,
    removeDirectionalLight: removeDirectionalLight
};
const musicParams = {
    addmusic: addmusic,
    removemusict: removemusict
};

const danceParams = {
    adddance: adddance,
    removedance: removedance
};

// เพิ่มบล็อกเลือก
gui.add(lightParams, "addDirectionalLight", 0, 0.1).name("on_light");
gui.add(lightParams, "removeDirectionalLight", 0, 0.1).name("off_light");

gui.add(musicParams, "addmusic", 0, 0.1).name("play_music");
gui.add(musicParams, "removemusict", 0, 0.1).name("stop_music");

gui.add(danceParams, "adddance", 0, 0.1).name("play_dance");
gui.add(danceParams, "removedance", 0, 0.1).name("stop_dance");


// Function to add a directional light to the scene
function addDirectionalLight() {
scene.add( campLight )
scene.add( campLight2 )
scene.add( campLight3 )
}

// Function to remove the last directional light from the scene
function removeDirectionalLight() {
scene.remove(campLight)
scene.remove(campLight2)
scene.remove(campLight3)
}

//music play stop
    function addmusic() {
        backgroundSound.play(); // เริ่มเล่นเพลง)
    }
    
    function removemusict() {
        backgroundSound.stop(); //หยุดเล่นเพลง
    }

    //dance play stop
    function adddance() {
        action.play(); // เริ่มเต้น)
    }
    
    function removedance() {
        action.stop(); //หยุดเต้น
    }



// const ambientLight2 = new THREE.AmbientLight(0xffffff, 0.2);
// scene.add(ambientLight2);



//ใส่เพลง
const listener = new THREE.AudioListener();
camera.add(listener);

const audioLoader = new THREE.AudioLoader();

const backgroundSound = new THREE.Audio(listener);

audioLoader.load('music.mp3', function (buffer) {
    backgroundSound.setBuffer(buffer);
    backgroundSound.setLoop(true);
    backgroundSound.setVolume(0.4);
});



// คำสั่งแสดงผล
function animate() {
    requestAnimationFrame(animate);

    if (mixer) {
        mixer.update(clock.getDelta());
    }

    controls.update();

    renderer.render(scene, camera);
}

    // Handle window resize
window.addEventListener('resize', () => {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(newWidth, newHeight);
});

// Initial call to add ambient light
addDirectionalLight();
animate();