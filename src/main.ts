import './style.scss';
import * as BABYLON from '@babylonjs/core';

const main = async () => {
  const renderCanvas = <HTMLCanvasElement>(
    document.getElementById('renderCanvas')
  );

  if (renderCanvas) {
    const engine = new BABYLON.Engine(renderCanvas, true);
    const scene = new BABYLON.Scene(engine);

    scene.createDefaultCameraOrLight(true, true, true);
    // scene.createDefaultEnvironment();

    const xr =  await scene.createDefaultXRExperienceAsync({
      uiOptions: {
        sessionMode: 'immersive-ar',
      },
      // webXR Featuresを有効にする
      optionalFeatures: true,
    });

    // FeaturesManagerを取得
    const featureManager = xr.baseExperience.featuresManager;

    // hitTestを設定
    const hitTestOptions: BABYLON.IWebXRHitTestOptions = {
      enableTransientHitTest: true,
      disablePermanentHitTest: true,
      transientHitTestProfile: 'generic-touchscreen',
    };

    // hitTestを有効にする
    const hitTest = featureManager.enableFeature(
      BABYLON.WebXRHitTest,
      'latest',
      hitTestOptions,
    ) as BABYLON.WebXRHitTest;

    hitTest?.onHitTestResultObservable.add((result) => {
      // コールバックで受け取ったresultが空の場合は処理を終了
      if (!result.length) {
        return;
      }

      const boxSize = 0.2;
      const box = BABYLON.MeshBuilder.CreateBox("box", { size: boxSize });
      // box.position.addInPlaceFromFloats(0, boxSize / 2.0, 0);
      // Cubeの高さを1.6mに設定
      // box.position.addInPlaceFromFloats(0, 1.6, 0);

      // hitTestの結果をboxの位置に設定
      box.position = result[0].position;
      box.rotationQuaternion = result[0].rotationQuaternion;
    });

    engine.runRenderLoop(() => {
      scene.render();
    });
  }
};

main();