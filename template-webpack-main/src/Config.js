// 이들을 게임에서 사용할 씬 목록에 포함시키는 설정입니다.
import LoadingScene from "./scenes/LoadingScene";
import PlayingScene from "./scenes/PlayingScene";
import GameOverScene from "./scenes/GameOverScene";
import MainScene from "./scenes/MainScene";
import GameClaerScene from "./scenes/GameClearScene";

// 게임의 설정을 정의하는 객체입니다.
const Config = 
{
    // 게임 화면의 가로 크기 (픽셀 단위)
    width: 800,
    
    // 게임 화면의 세로 크기 (픽셀 단위)
    height: 600,
    
    // 게임 배경색을 검정색으로 설정. Hex 코드 사용.
    backgroundColor: 0x000000, 

    // 게임에서 사용할 씬을 배열로 정의. 
    scene: [LoadingScene,MainScene, PlayingScene,GameOverScene,GameClaerScene],

    // `pixelArt: true`는 게임이 픽셀 아트 스타일로 렌더링되도록 설정.
    // 이 옵션을 활성화하면 이미지 크기가 일정 배수로 맞춰지고,
    // 픽셀 아트 특유의 '네이티브 해상도'를 유지할 수 있게 됩니다.
    pixelArt: true,

    parent: "game-container",

    // 물리 엔진 설정. Phaser는 다양한 물리 엔진을 지원합니다.
    physics: 
    {
        // 기본 물리 엔진을 'arcade'로 설정 (간단하고 빠른 물리 시스템)
        default: "arcade",
        
        arcade:
        {
            // 디버그 모드를 활성화하거나 비활성화할 수 있습니다.
            // `process.env.DEBUG === "true"`는 환경 변수에서 DEBUG 값을 확인하여,
            // true일 경우 디버그 모드를 활성화합니다.
            debug: process.env.DEBUG === "true", 
        },
    },
};

// Config 객체를 내보냄 (게임의 설정을 다른 파일에서 사용할 수 있도록 함)
export default Config;
