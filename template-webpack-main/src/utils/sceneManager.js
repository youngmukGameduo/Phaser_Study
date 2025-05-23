

export function loseGame(playingScene)
{
    playingScene.m_gameOverSound.play();
    playingScene.scene.start("gameOverScene",
        {
            mobsKilled: playingScene.m_player.m_mobsKilled,
            level: playingScene.m_player.m_level,
            secondElapsed: playingScene.m_secondElapsed,
        }
    );
}

export function winGame(playingScene)
{
    playingScene.m_gameClearSound.play();
    playingScene.scene.start("gameClearScene",
        {
                    mobsKilled: playingScene.m_player.m_mobsKilled,
            level: playingScene.m_player.m_level,
            secondElapsed: playingScene.m_secondElapsed,
        }
    );
}