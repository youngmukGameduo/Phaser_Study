// Config 파일에서 게임 설정을 가져옵니다. 
// 이 설정에는 게임의 크기, 씬, 물리 엔진 등 다양한 설정이 포함됩니다.
import Config from "./Config";

// Phaser.Game 객체를 생성하고, 위에서 가져온 Config를 전달하여 게임을 초기화합니다.
// Phaser.Game 객체는 게임의 엔진을 담당하며, 게임 설정에 따라 화면을 렌더링하고 씬을 전환합니다.
const game = new Phaser.Game(Config);

// 게임 인스턴스를 내보냅니다. 
// 다른 모듈에서 이 객체를 사용할 수 있도록 export 합니다.
export default game;
