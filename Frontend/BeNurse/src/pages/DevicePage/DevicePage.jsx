import React, {
  useRef,
  useState,
  useLayoutEffect,
  Suspense,
  useEffect,
} from "react";
import { Common } from "../../utils/global.styles";
import { customAxios } from "../../libs/axios";

import DeviceItem from "../../components/templates/DeviceItem/DeviceItem";
import RecentUsageList from "../../components/templates/DeviceItem/RecentUsageList";
import RecentUsageHeader from "../../components/templates/DeviceItem/RecentUsageHeader";

// three.js
import * as THREE from "three";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { gsap } from "gsap/gsap-core";
import { BottomSheet } from "react-spring-bottom-sheet";

// emotion
import Container from "../../components/atoms/Container/Container";
import Button from "../../components/atoms/Button/Button";
import Input from "../../components/atoms/Input/Input";
import Box from "../../components/atoms/Box/Box";

// icons
import deviceListIcon from "@assets/Icons/deviceList.svg";
import mapIcon from "@assets/Icons/map.svg";
import { MdHistory } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import { SiNfc } from "react-icons/si";

// zustand
import { useDeviceStore } from "../../store/store";
import { useTabBarStore } from "../../store/store";

// Images
import temp from "@assets/Images/temp.png";

export default function DevicePage() {
  const [devices, setDevices] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [deviceHistory, setDeviceHistory] = useState(null);
  const [historyKeys, setHistoryKeys] = useState(null);
  const [beacon, setBeacon] = useState(null);
  const [target, setTarget] = useState(false);
  const [position, setPosition] = useState();
  const { isListActivated, ActivateList, DeactivateList } = useDeviceStore(
    (state) => state,
  );
  const { currentTab, setCurrentTab } = useTabBarStore((state) => state);

  const locationData = {
    소회의실: {
      camera: {
        x: -4,
        y: -50,
        z: 66,
        duration: 0.8,
        ease: "ease-in-out",
      },
      beacon: [-3, 2, 50],
    },
    로비: {
      camera: {
        x: -30,
        y: -90,
        z: 10,
        duration: 0.8,
        ease: "ease-in-out",
      },
      beacon: [-34, -5, -19],
    },
    201: {
      camera: {
        x: 0,
        y: -70,
        z: 36,
        duration: 0.8,
        ease: "ease-in-out",
      },
      beacon: [-3, 12, 19],
    },
    202: {
      camera: {
        x: 30,
        y: -40,
        z: 36,
        duration: 0.8,
        ease: "ease-in-out",
      },
      beacon: [27, 26, 19],
    },
  };

  function activateNFC() {
    const accessToken = localStorage.getItem("accessToken");
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(accessToken);
    }
  }

  //three.js models
  function GroundGLTF(props) {
    const groupRef = useRef();
    const { nodes, materials } = useGLTF("src/assets/GLTFModels/Ground.glb");
    return (
      <mesh
        {...props}
        castShadow
        receiveShadow
        geometry={nodes.Mesh_Mesh_head_geo001_lambert2SG001.geometry}
        material={nodes.Mesh_Mesh_head_geo001_lambert2SG001.material}
      />
    );
  }
  function HospitalGLTF(props) {
    const groupRef = useRef();
    const { nodes, materials } = useGLTF("src/assets/GLTFModels/Hospital.glb");
    return (
      <mesh
        {...props}
        castShadow
        receiveShadow
        geometry={nodes.Mesh_Mesh_head_geo001_lambert2SG001.geometry}
        material={nodes.Mesh_Mesh_head_geo001_lambert2SG001.material}
      />
    );
  }
  function HospitalOutsideGLTF(props) {
    const groupRef = useRef();
    const { nodes, materials } = useGLTF(
      "src/assets/GLTFModels/HospitalOutside.glb",
    );
    return (
      <mesh
        {...props}
        castShadow
        receiveShadow
        geometry={nodes.Mesh_Mesh_head_geo001_lambert2SG001.geometry}
        material={nodes.Mesh_Mesh_head_geo001_lambert2SG001.material}
      />
    );
  }
  function BeaconGLTF(props) {
    const { nodes, materials } = useGLTF("src/assets/GLTFModels/Beacon.glb");
    const beaconRef = useRef();
    const beaconMaterial = new THREE.MeshStandardMaterial({
      color: "#C13232",
      transparent: true,
      roughness: 1,
      opacity: selectedDevice ? 1 : 0,
      flatShading: true,
    });

    useFrame((state, delta) => {
      beaconRef.current.rotation.z += 0.04;
    });

    return (
      <mesh
        {...props}
        ref={beaconRef}
        castShadow
        receiveShadow
        geometry={nodes.Mesh_Mesh_head_geo001_lambert2SG001.geometry}
        material={beaconMaterial}
      />
    );
  }

  // camera
  function selectDeviceItem(device) {
    if (selectedDevice && selectedDevice.id === device.id) {
      setSelectedDevice(null);
    } else {
      setSelectedDevice(device);
    }
    DeactivateList();
  }

  const CameraMove = () => {
    const { camera } = useThree();

    useLayoutEffect(() => {
      if (selectedDevice) {
        beacon &&
          gsap.to(camera.position, locationData[beacon.location].camera);
      } else {
        gsap.to(camera.position, {
          x: 1,
          y: -180,
          z: 100,
          duration: 0.8,
          ease: "ease-in-out",
        });
      }
      // camera={{ position: [0, -100, 120] }}
    }, [position, selectedDevice]);
  };

  useEffect(() => {
    if (selectedDevice) {
      customAxios
        .get("device-history/all?DeviceID=" + selectedDevice.id)
        .then((res) => {
          const lastHistory = res.data.responseData[0];

          const history = res.data.responseData;
          const newHistory = {};
          history.map((item) => {
            const itemTime = item.time.slice(0, 10);
            if (newHistory[itemTime]) {
              newHistory[itemTime].push(item);
            } else {
              newHistory[itemTime] = [item];
            }
          });
          setHistoryKeys(Object.keys(newHistory));
          setDeviceHistory(newHistory);
          customAxios.get("beacon?ID=" + lastHistory.beaconID).then((res) => {
            setBeacon(res.data.responseData);
          });
        });
    }
  }, [selectedDevice]);

  useEffect(() => {
    customAxios.get("device/all").then((res) => {
      setDevices(res.data.responseData);
    });
    setCurrentTab("device");
  }, []);

  if (isListActivated) {
    return (
      <Container backgroundColor={"purple"}>
        <div
          style={{
            position: "absolute",
            zIndex: 100,
            display: "flex",
            width: "412px",
            height: "100px",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "74px",
          }}
        >
          <Button
            style={{ margin: "0px 10px 0px 0px" }}
            variant="primary"
            width="50px"
            radius="10px"
            onClick={() => {
              setSelectedDevice(null);
              DeactivateList();
            }}
          >
            <img
              style={{ width: "24px" }}
              src={mapIcon}
              alt=""
            />
          </Button>
          <Input
            onFocus={ActivateList}
            variant="search"
            placeholder="장비 이름으로 검색"
            width="298px"
            type="text"
          />
        </div>
        <div
          style={{
            marginTop: "74px",
            width: "412px",
            height: "576px",
            padding: "100px 0px 60px 0px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            overflow: "scroll",
            transition: "ease-in-out",
          }}
        >
          <div>
            {devices?.map((device, index) => {
              return (
                <DeviceItem
                  key={index}
                  listItem={true}
                  item={device}
                  onClick={() => {
                    selectDeviceItem(device);
                  }}
                />
              );
            })}
          </div>
        </div>
      </Container>
    );
  } else {
    return (
      <Container backgroundColor={"purple"}>
        <div
          style={{
            position: "absolute",
            zIndex: 100,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "412px",
            height: "100px",
            marginTop: "74px",
          }}
        >
          <Button
            style={{ margin: "0px 10px 0px 0px" }}
            variant="primary"
            width="50px"
            radius="10px"
            onClick={ActivateList}
          >
            <img
              style={{ width: "24px" }}
              src={deviceListIcon}
              alt=""
            />
          </Button>
          <Input
            onFocus={ActivateList}
            variant="search"
            placeholder="장비 이름으로 검색"
            width="298px"
            type="text"
          />
        </div>
        <Box
          type={"white"}
          size={["70px", "70px"]}
          props={
            "position: absolute; right: 30px; bottom: 90px; z-index: 100; border-radius: 40px; flex-direction: column;"
          }
          onClick={activateNFC}
        >
          <SiNfc
            size={30}
            color={Common.color.purple03}
          />
        </Box>
        <Canvas
          style={{
            marginTop: "74px",
            width: "412px",
            height: "736px",
            backgroundColor: "#E7E6F5",
          }}
          camera={{ position: [1, -180, 100] }}
          // camera={{ position: [0, -100, 120] }}
          flat={true}
        >
          <Suspense>
            <ambientLight intensity={2} />
            <directionalLight
              color="white"
              intensity={1}
              position={[-10, -30, 30]}
            />
            <directionalLight
              color="white"
              intensity={2}
              position={[100, -100, 30]}
            />
            <directionalLight
              color="white"
              intensity={1}
              position={[1000, -30, 30]}
            />
            <HospitalGLTF
              scale={0.52}
              position={[3, 0, 34]}
              rotation={[0, 0, 0.5]}
            />
            <BeaconGLTF
              scale={0.4}
              position={beacon && locationData[beacon.location].beacon}
            />
            <>
              <HospitalGLTF
                scale={0.53}
                position={[3, 0, 7]}
                rotation={[0, 0, 0.5]}
              />
              <HospitalGLTF
                scale={0.54}
                position={[3, 0, -24]}
                rotation={[0, 0, 0.5]}
              />
            </>
            {!selectedDevice && (
              <HospitalOutsideGLTF
                scale={1}
                position={[10, -20, -12]}
                rotation={[0, 0, 0.5]}
              />
            )}
            <GroundGLTF
              scale={2.4}
              position={[0, 0, -40]}
              rotation={[0, 0, 0.5]}
              flatShading={true}
            />
            <CameraMove />
          </Suspense>
        </Canvas>
        <BottomSheet
          open={selectedDevice}
          blocking={false}
          onDismiss={() => {
            setSelectedDevice(null);
          }}
          defaultSnap={({ maxHeight }) => maxHeight / 4}
          snapPoints={({ maxHeight }) => [maxHeight / 4, maxHeight * 0.64]}
        >
          <DeviceItem
            item={selectedDevice && selectedDevice}
            beacon={beacon && beacon}
          />
          <hr style={{ margin: "0px 20px", border: "0.5px solid #D9D9D9" }} />
          <RecentUsageHeader />
          <RecentUsageList
            historyKeys={historyKeys}
            usage={deviceHistory}
          />
        </BottomSheet>
      </Container>
    );
  }
}
